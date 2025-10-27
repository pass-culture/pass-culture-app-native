import { NavigationAction, useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { CookiesSettings } from 'features/cookies/components/CookiesSettings'
import { COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { getCookiesChoiceByCategory } from 'features/cookies/helpers/getCookiesChoiceByCategory'
import { getCookiesChoiceFromCategories } from 'features/cookies/helpers/getCookiesChoiceFromCategories'
import { startTrackingAcceptedCookies } from 'features/cookies/helpers/startTrackingAcceptedCookies'
import { useCookies } from 'features/cookies/helpers/useCookies'
import { CookiesChoiceByCategory } from 'features/cookies/types'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { getTabHookConfig } from 'features/navigation/TabBar/getTabHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { haveCookieChoicesChanged } from 'features/profile/helpers/haveCookieChoicesChanged/haveCookieChoicesChanged'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { AnchorProvider } from 'ui/components/anchor/AnchorContext'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { LinkInsideText } from 'ui/components/buttons/linkInsideText/LinkInsideText'
import { styledButton } from 'ui/components/buttons/styledButton'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Close } from 'ui/svg/icons/Close'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const ConsentSettings = () => {
  const { navigate, addListener, dispatch } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack(...getTabHookConfig('Profile'))
  const { params } = useRoute<UseRouteType<'ConsentSettings'>>()
  const offerId = params?.offerId

  const scrollViewRef = useRef<ScrollView>(null)
  const scrollYRef = useRef<number>(0)

  const { showSuccessSnackBar } = useSnackBarContext()
  const { cookiesConsent, setCookiesConsent } = useCookies()
  const { visible, showModal, hideModal } = useModal(false)

  const loadedCookieChoices = useMemo(
    () => getCookiesChoiceByCategory(cookiesConsent),
    [cookiesConsent]
  )

  const [currentCookieChoices, setCurrentCookieChoices] =
    useState<CookiesChoiceByCategory>(loadedCookieChoices)

  const originalCookieChoicesRef = useRef(loadedCookieChoices)
  const interceptedBackActionRef = useRef<NavigationAction | null>(null)
  const bypassBeforeRemoveOnceRef = useRef(false)

  useEffect(() => {
    setCurrentCookieChoices(loadedCookieChoices)
    originalCookieChoicesRef.current = loadedCookieChoices
  }, [loadedCookieChoices])

  const hasUnsavedCookieChanges = haveCookieChoicesChanged(
    currentCookieChoices,
    originalCookieChoicesRef.current
  )

  useEffect(() => {
    const removeBeforeRemoveListener = addListener('beforeRemove', (event) => {
      if (bypassBeforeRemoveOnceRef.current) {
        bypassBeforeRemoveOnceRef.current = false
        return
      }

      if (!hasUnsavedCookieChanges) return

      event.preventDefault()
      if (!visible) showModal()
      interceptedBackActionRef.current = event.data.action
    })
    return removeBeforeRemoveListener
  }, [addListener, hasUnsavedCookieChanges, visible, showModal])

  const handleGoBack = useCallback(() => {
    if (offerId) {
      navigate('Offer', { id: offerId })
    } else {
      goBack()
    }
  }, [goBack, navigate, offerId])

  const handleBack = useCallback(() => {
    if (hasUnsavedCookieChanges) showModal()
    else handleGoBack()
  }, [hasUnsavedCookieChanges, showModal, handleGoBack])

  const handleSaveChoices = useCallback(async () => {
    hideModal()
    const { accepted, refused } = getCookiesChoiceFromCategories(currentCookieChoices)
    await setCookiesConsent({ mandatory: COOKIES_BY_CATEGORY.essential, accepted, refused })
    startTrackingAcceptedCookies(accepted)
    void analytics.logHasMadeAChoiceForCookies({
      from: 'ConsentSettings',
      type: currentCookieChoices,
    })

    originalCookieChoicesRef.current = currentCookieChoices
    interceptedBackActionRef.current = null

    const navigateToOfferOrProfile = () => {
      if (offerId) {
        navigate('Offer', { id: offerId })
      } else {
        navigate(...getTabHookConfig('Profile'))
      }
    }

    // Ignore the next navigation event
    bypassBeforeRemoveOnceRef.current = true
    navigateToOfferOrProfile()

    showSuccessSnackBar({
      message: 'Ton choix a bien été enregistré.',
      timeout: SNACK_BAR_TIME_OUT,
    })
  }, [currentCookieChoices, setCookiesConsent, showSuccessSnackBar, hideModal, offerId, navigate])

  const handleDiscardAndGoBack = useCallback(() => {
    setCurrentCookieChoices(originalCookieChoicesRef.current)
    hideModal()

    const pending = interceptedBackActionRef.current
    interceptedBackActionRef.current = null

    if (pending) {
      dispatch(pending)
      return
    }

    bypassBeforeRemoveOnceRef.current = true
    handleGoBack()
  }, [hideModal, handleGoBack, dispatch])

  const modalDescription = 'Tes modifications ne seront pas prises en compte.'

  const handleCheckScrollY = useRef(() => {
    return scrollYRef.current
  }).current

  return (
    <React.Fragment>
      <AnchorProvider scrollViewRef={scrollViewRef} handleCheckScrollY={handleCheckScrollY}>
        <SecondaryPageWithBlurHeader
          onGoBack={handleBack}
          title="Paramètres de confidentialité"
          scrollable
          ref={scrollViewRef}>
          <Typo.Body>
            L’application pass Culture utilise des outils et traceurs appelés cookies pour améliorer
            ton expérience de navigation.
          </Typo.Body>

          <StyledBodyAccentXs>
            Tu peux choisir d’accepter ou non l’activation de leur suivi.
          </StyledBodyAccentXs>

          <CookiesSettings
            settingsCookiesChoice={currentCookieChoices}
            setSettingsCookiesChoice={setCurrentCookieChoices}
            offerId={offerId}
          />

          <StyledTitle4 {...getHeadingAttrs(2)}>Tu as la main dessus</StyledTitle4>
          <StyledBody>
            Ton choix est enregistré pour 6 mois et tu peux changer d’avis à tout moment.
          </StyledBody>
          <Typo.Body>
            On te redemandera bien sûr ton consentement si notre politique évolue.
          </Typo.Body>

          <StyledBodyAccentXs>
            Pour plus d’informations, nous t’invitons à consulter notre {SPACE}
            <ExternalTouchableLink
              as={LinkInsideText}
              wording="politique de gestion des cookies"
              externalNav={{ url: env.COOKIES_POLICY_LINK }}
              typography="BodyAccentXs"
              accessibilityRole={AccessibilityRole.LINK}
            />
          </StyledBodyAccentXs>

          <SaveButton wording="Enregistrer mes choix" onPress={handleSaveChoices} center />
        </SecondaryPageWithBlurHeader>
      </AnchorProvider>

      <AppModal
        title=""
        visible={visible}
        customModalHeader={
          <ModalHeader
            title="Quitter sans enregistrer&nbsp;?"
            rightIconAccessibilityLabel="Fermer la modale"
            rightIcon={Close}
            onRightIconPress={hideModal}
          />
        }>
        <ViewGap gap={6}>
          <ModalDescription>{modalDescription}</ModalDescription>
          <ButtonPrimary wording="Enregistrer mes choix" onPress={handleSaveChoices} />
          <ButtonTertiaryBlack
            icon={Invalidate}
            wording="Quitter sans enregistrer"
            onPress={handleDiscardAndGoBack}
          />
        </ViewGap>
      </AppModal>
    </React.Fragment>
  )
}

const ModalDescription = styled(Typo.Body)({
  textAlign: 'center',
})

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
  marginTop: theme.designSystem.size.spacing.l,
  marginBottom: theme.designSystem.size.spacing.xxl,
}))

const StyledTitle4 = styled(Typo.Title4)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.l,
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.l,
}))

const SaveButton = styledButton(ButtonPrimary)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.l,
}))
