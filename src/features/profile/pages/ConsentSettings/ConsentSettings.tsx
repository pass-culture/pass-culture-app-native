import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent, useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { SectionWithSwitch } from 'features/profile/components/SectionWithSwitch/SectionWithSwitch'
import { NewConsentSettings } from 'features/profile/pages/ConsentSettings/NewConsentSettings'
import { PageProfileSection } from 'features/profile/pages/PageProfileSection/PageProfileSection'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { getCookiesConsent, setCookiesConsent } from 'libs/trackingConsent/consent'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Separator } from 'ui/components/Separator'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer, Typo } from 'ui/theme'

type Props = StackScreenProps<RootStackParamList, 'ConsentSettings'>

export const ConsentSettings: FunctionComponent<Props> = () => {
  const { data: settings } = useAppSettings()
  const { goBack } = useNavigation()
  const { showSuccessSnackBar } = useSnackBarContext()
  const [isTrackingSwitchActive, setIsTrackingSwitchActive] = useState(false)
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true)

  useEffect(() => {
    getCookiesConsent().then((hasAcceptedCookie) => {
      // If the user has navigated to this page from the privacy modal, we consider that
      // as an implicit refusal, which they can change with the switch if they want to.
      if (hasAcceptedCookie === null) {
        setCookiesConsent(false)
      }
      setIsTrackingSwitchActive(Boolean(hasAcceptedCookie))
    })
  }, [])

  function toggleTrackingSwitch() {
    setIsTrackingSwitchActive((prevActive) => !prevActive)
    setIsSaveButtonDisabled((prevValue) => !prevValue)
  }

  function save() {
    setCookiesConsent(isTrackingSwitchActive).then(() => {
      setIsSaveButtonDisabled((prevValue) => !prevValue)
      if (isTrackingSwitchActive) {
        analytics.enableCollection()
      } else {
        analytics.disableCollection()
      }
    })
    showSuccessSnackBar({
      message: 'Paramètre enregistré',
      timeout: SNACK_BAR_TIME_OUT,
    })
    goBack()
  }

  return settings?.appEnableCookiesV2 ? (
    <NewConsentSettings />
  ) : (
    <PageProfileSection title="Paramètres de confidentialité">
      <StyledBody>
        L’application pass Culture utilise des traceurs susceptibles de réaliser des statistiques
        sur ta navigation. Ceci permet d’améliorer la qualité et la sureté de ton expérience. Pour
        ces besoins, les analyses réalisées sont strictement anonymes et ne comportent aucune donnée
        personnelle.
      </StyledBody>
      <Spacer.Column numberOfSpaces={4} />
      <MoreInformationContainer>
        <Typo.CaptionNeutralInfo>
          Pour plus d’informations, nous t’invitons à consulter notre
          <Spacer.Row numberOfSpaces={1} />
          <TouchableLink
            as={ButtonInsideText}
            wording="Politique des cookies"
            externalNav={{ url: env.COOKIES_POLICY_LINK }}
            icon={ExternalSiteFilled}
            typography="Caption"
          />
        </Typo.CaptionNeutralInfo>
      </MoreInformationContainer>
      <Spacer.Column numberOfSpaces={4} />
      <Separator />
      <SectionWithSwitch
        title="Autoriser l’utilisation de mes données de navigation"
        active={isTrackingSwitchActive}
        toggle={toggleTrackingSwitch}
      />
      <Spacer.Flex />
      <ButtonPrimary
        wording="Enregistrer"
        accessibilityLabel="Enregistrer les modifications"
        onPress={save}
        disabled={isSaveButtonDisabled}
        center
      />
    </PageProfileSection>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.black,
}))

const MoreInformationContainer = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
})
