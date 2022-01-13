import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent, useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { openUrl } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { storage } from 'libs/storage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonQuaternary } from 'ui/components/buttons/ButtonQuaternary'
import FilterSwitch from 'ui/components/FilterSwitch'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { SectionRow } from 'ui/components/SectionRow'
import { Separator } from 'ui/components/Separator'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { ProfileContainer } from '../components/reusables'

type Props = StackScreenProps<RootStackParamList, 'ConsentSettings'>

export const ConsentSettings: FunctionComponent<Props> = ({ route }) => {
  const { goBack } = useNavigation()
  const [isTrackingSwitchActive, setIsTrackingSwitchActive] = useState(false)
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true)
  const theme = useTheme()

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
      <Spacer.TopScreen />
      <Spacer.Column numberOfSpaces={18} />
      <ProfileContainer>
        <Typo.Body color={theme.colors.black}>
          {t`L'application pass Culture utilise des traceurs susceptibles de réaliser des statistiques sur ta navigation. Ceci permet d'améliorer la qualité et la sureté de ton expérience. Pour ces besoins, les analyses réalisées sont strictement anonymes et ne comportent aucune donnée personnelle.`}
        </Typo.Body>
        <Spacer.Column numberOfSpaces={4} />
        <MoreInformationContainer>
          <Typo.Caption color={theme.colors.greyDark}>
            {t`Pour plus d'informations, nous t'invitons à consulter notre`}
            <Spacer.Row numberOfSpaces={1} />
            <ButtonQuaternary
              title={t`Politique des cookies`}
              icon={ExternalSiteFilled}
              onPress={openCookiesPolicyExternalUrl}
              inline
            />
          </Typo.Caption>
        </MoreInformationContainer>
        <Spacer.Column numberOfSpaces={4} />
        <Separator />
        <Line>
          <SectionRow
            numberOfLines={3}
            type="clickable"
            title={t`Autoriser l’utilisation de mes données de navigation`}
            cta={
              <FilterSwitch
                active={isTrackingSwitchActive}
                accessibilityLabel={t`Interrupteur données de navigation`}
                toggle={toggleTrackingSwitch}
              />
            }
          />
          <Spacer.Column numberOfSpaces={3} />
        </Line>
        <Spacer.Flex flex={1} />
        <StyledButtonPrimary
          title={t`Enregistrer`}
          onPress={save}
          disabled={isSaveButtonDisabled}
        />
        <Spacer.Column numberOfSpaces={8} />
      </ProfileContainer>

      <PageHeader title={t`Paramètres de confidentialité`} onGoBack={route.params?.onGoBack} />
    </Container>
  )
}

const StyledButtonPrimary = styled(ButtonPrimary)({
  alignSelf: 'center',
})

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const Line = styled.View({
  paddingVertical: getSpacing(4),
})

const MoreInformationContainer = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
})
