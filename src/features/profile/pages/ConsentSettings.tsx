import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent, useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { openUrl } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { SectionWithSwitch } from 'features/profile/components/SectionWithSwitch'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { storage } from 'libs/storage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonQuaternary } from 'ui/components/buttons/ButtonQuaternary'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { Separator } from 'ui/components/Separator'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer, Typo } from 'ui/theme'
import { A } from 'ui/web/link/A'

import { ProfileContainer } from '../components/reusables'

type Props = StackScreenProps<RootStackParamList, 'ConsentSettings'>
const cookieButtonText = 'Politique des cookies'

export const ConsentSettings: FunctionComponent<Props> = ({ route }) => {
  const { goBack } = useNavigation()
  const [isTrackingSwitchActive, setIsTrackingSwitchActive] = useState(false)
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true)

  useEffect(() => {
    storage.readObject('has_accepted_cookie').then((hasAcceptedCookie) => {
      // If the user has navigated to this page from the privacy modal, we consider that
      // as an implicit refusal, which they can change with the switch if they want to.
      if (hasAcceptedCookie === null) {
        storage.saveObject('has_accepted_cookie', false)
      }
      setIsTrackingSwitchActive(Boolean(hasAcceptedCookie))
    })
  }, [])

  function toggleTrackingSwitch() {
    setIsTrackingSwitchActive((prevActive) => !prevActive)
    setIsSaveButtonDisabled((prevValue) => !prevValue)
  }

  function save() {
    storage.saveObject('has_accepted_cookie', isTrackingSwitchActive).then(() => {
      setIsSaveButtonDisabled((prevValue) => !prevValue)
      if (isTrackingSwitchActive) {
        analytics.enableCollection()
      } else {
        analytics.disableCollection()
      }
    })
    goBack()
  }

  async function openCookiesPolicyExternalUrl() {
    await openUrl(env.COOKIES_POLICY_LINK)
  }

  return (
    <Container>
      <PageHeader title={t`Paramètres de confidentialité`} onGoBack={route.params?.onGoBack} />
      <Spacer.TopScreen />
      <Spacer.Column numberOfSpaces={18} />
      <ProfileContainer>
        <StyledBody>
          {t`L'application pass Culture utilise des traceurs susceptibles de réaliser des statistiques sur ta navigation. Ceci permet d'améliorer la qualité et la sureté de ton expérience. Pour ces besoins, les analyses réalisées sont strictement anonymes et ne comportent aucune donnée personnelle.`}
        </StyledBody>
        <Spacer.Column numberOfSpaces={4} />
        <MoreInformationContainer>
          <StyledCaption>
            {t`Pour plus d'informations, nous t'invitons à consulter notre`}
            <Spacer.Row numberOfSpaces={1} />
            <A href={env.COOKIES_POLICY_LINK}>
              <ButtonQuaternary
                wording={cookieButtonText}
                icon={ExternalSiteFilled}
                onPress={openCookiesPolicyExternalUrl}
                inline
              />
            </A>
          </StyledCaption>
        </MoreInformationContainer>
        <Spacer.Column numberOfSpaces={4} />
        <Separator />
        <SectionWithSwitch
          title={t`Autoriser l’utilisation de mes données de navigation`}
          active={isTrackingSwitchActive}
          accessibilityLabel={t`Interrupteur données de navigation`}
          toggle={toggleTrackingSwitch}
        />
        <Spacer.Flex />
        <ButtonPrimary
          wording={t`Enregistrer`}
          accessibilityLabel={t`Enregistrer les modifications`}
          onPress={save}
          disabled={isSaveButtonDisabled}
          center
        />
        <Spacer.Column numberOfSpaces={8} />
      </ProfileContainer>
    </Container>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.black,
}))

const StyledCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const MoreInformationContainer = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
})
