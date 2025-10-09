import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components/native'

import { CookiesSettings } from 'features/cookies/components/CookiesSettings'
import { COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { getCookiesChoiceFromCategories } from 'features/cookies/helpers/getCookiesChoiceFromCategories'
import { startTrackingAcceptedCookies } from 'features/cookies/helpers/startTrackingAcceptedCookies'
import { useCookies } from 'features/cookies/helpers/useCookies'
import { CookiesChoiceByCategory } from 'features/cookies/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabHookConfig } from 'features/navigation/TabBar/getTabHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { LinkInsideText } from 'ui/components/buttons/linkInsideText/LinkInsideText'
import { styledButton } from 'ui/components/buttons/styledButton'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { getSpacing, Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const ConsentSettings = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack(...getTabHookConfig('Profile'))

  const { showSuccessSnackBar } = useSnackBarContext()
  const { setCookiesConsent } = useCookies()
  const [settingsCookiesChoice, setSettingsCookiesChoice] = useState<CookiesChoiceByCategory>({
    customization: false,
    performance: false,
    marketing: false,
    video: false,
  })

  const saveChoice = useCallback(() => {
    const { accepted, refused } = getCookiesChoiceFromCategories(settingsCookiesChoice)
    setCookiesConsent({
      mandatory: COOKIES_BY_CATEGORY.essential,
      accepted,
      refused,
    })
    startTrackingAcceptedCookies(accepted)
    analytics.logHasMadeAChoiceForCookies({
      from: 'ConsentSettings',
      type: settingsCookiesChoice,
    })
    showSuccessSnackBar({
      message: 'Ton choix a bien été enregistré.',
      timeout: SNACK_BAR_TIME_OUT,
    })
    navigate(...getTabHookConfig('Profile'))
  }, [navigate, setCookiesConsent, settingsCookiesChoice, showSuccessSnackBar])

  return (
    <SecondaryPageWithBlurHeader onGoBack={goBack} title="Paramètres de confidentialité" scrollable>
      <Typo.Body>
        L’application pass Culture utilise des outils et traceurs appelés cookies pour améliorer ton
        expérience de navigation.
      </Typo.Body>
      <StyledBodyAccentXs>
        Tu peux choisir d’accepter ou non l’activation de leur suivi.
      </StyledBodyAccentXs>
      <CookiesSettings
        settingsCookiesChoice={settingsCookiesChoice}
        setSettingsCookiesChoice={setSettingsCookiesChoice}
      />
      <StyledTitle4 {...getHeadingAttrs(2)}>Tu as la main dessus</StyledTitle4>
      <StyledBody>
        Ton choix est enregistré pour 6 mois et tu peux changer d’avis à tout moment.
      </StyledBody>
      <Typo.Body>On te redemandera bien sûr ton consentement si notre politique évolue.</Typo.Body>
      <StyledBodyAccentXs>
        Pour plus d’informations, nous t’invitons à consulter notre
        {SPACE}
        <ExternalTouchableLink
          as={LinkInsideText}
          wording="politique de gestion des cookies"
          externalNav={{ url: env.COOKIES_POLICY_LINK }}
          typography="BodyAccentXs"
          accessibilityRole={AccessibilityRole.LINK}
        />
      </StyledBodyAccentXs>
      <SaveButton wording="Enregistrer mes choix" onPress={saveChoice} center />
    </SecondaryPageWithBlurHeader>
  )
}

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
  marginTop: getSpacing(4),
  marginBottom: getSpacing(8),
}))

const StyledTitle4 = styled(Typo.Title4)({
  marginVertical: getSpacing(4),
})

const StyledBody = styled(Typo.Body)({
  marginBottom: getSpacing(4),
})

const SaveButton = styledButton(ButtonPrimary)({
  marginBottom: getSpacing(4),
})
