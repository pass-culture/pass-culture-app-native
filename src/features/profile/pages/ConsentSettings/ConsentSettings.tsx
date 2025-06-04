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
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const ConsentSettings = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack(...getTabNavConfig('Profile'))

  const { showSuccessSnackBar } = useSnackBarContext()
  const { setCookiesConsent } = useCookies()
  const [settingsCookiesChoice, setSettingsCookiesChoice] = useState<CookiesChoiceByCategory>({
    customization: false,
    performance: false,
    marketing: false,
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
    navigate(...getTabNavConfig('Profile'))
  }, [navigate, setCookiesConsent, settingsCookiesChoice, showSuccessSnackBar])

  return (
    <SecondaryPageWithBlurHeader onGoBack={goBack} title="Paramètres de confidentialité" scrollable>
      <Typo.Body>
        L’application pass Culture utilise des outils et traceurs appelés cookies pour améliorer ton
        expérience de navigation.
      </Typo.Body>
      <Spacer.Column numberOfSpaces={4} />
      <StyledBodyAccentXs>
        Tu peux choisir d’accepter ou non l’activation de leur suivi.
      </StyledBodyAccentXs>
      <Spacer.Column numberOfSpaces={8} />
      <CookiesSettings
        settingsCookiesChoice={settingsCookiesChoice}
        setSettingsCookiesChoice={setSettingsCookiesChoice}
      />
      <Spacer.Column numberOfSpaces={4} />
      <Typo.Title4 {...getHeadingAttrs(2)}>Tu as la main dessus</Typo.Title4>
      <Spacer.Column numberOfSpaces={4} />
      <Typo.Body>
        Ton choix est enregistré pour 6 mois et tu peux changer d’avis à tout moment.
      </Typo.Body>
      <Spacer.Column numberOfSpaces={4} />
      <Typo.Body>On te redemandera bien sûr ton consentement si notre politique évolue.</Typo.Body>
      <Spacer.Column numberOfSpaces={4} />
      <StyledBodyAccentXs>
        Pour plus d’informations, nous t’invitons à consulter notre
        <Spacer.Row numberOfSpaces={1} />
        <ExternalTouchableLink
          as={ButtonInsideText}
          wording="Politique de gestion des cookies"
          externalNav={{ url: env.COOKIES_POLICY_LINK }}
          icon={ExternalSiteFilled}
          typography="BodyAccentXs"
        />
      </StyledBodyAccentXs>
      <Spacer.Column numberOfSpaces={8} />
      <ButtonPrimary wording="Enregistrer mes choix" onPress={saveChoice} center />
      <Spacer.Column numberOfSpaces={4} />
    </SecondaryPageWithBlurHeader>
  )
}

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
