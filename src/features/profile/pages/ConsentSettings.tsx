import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent, useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { usePreviousRoute } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { firebaseAnalytics } from 'libs/analytics'
import { _ } from 'libs/i18n'
import { storage } from 'libs/storage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import FilterSwitch from 'ui/components/FilterSwitch'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { ExternalLinkSite } from 'ui/svg/icons/ExternalLinkSite'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { ProfileContainer, Separator } from '../components/reusables'
import { SectionRow } from '../components/SectionRow'

type Props = StackScreenProps<RootStackParamList, 'ConsentSettings'>

export const ConsentSettings: FunctionComponent<Props> = ({ route }) => {
  const { goBack } = useNavigation()
  const [isTrackingSwitchActive, setIsTrackingSwitchActive] = useState(false)
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true)
  const previousRoute = usePreviousRoute()

  useEffect(() => {
    storage.readObject('has_accepted_cookie').then((hasAcceptedCookie) => {
      if (hasAcceptedCookie === null) {
        // default user choice is true
        storage.saveObject('has_accepted_cookie', true)
        setIsTrackingSwitchActive(true)
      } else {
        setIsTrackingSwitchActive(Boolean(hasAcceptedCookie))
      }
    })
  }, [])

  function toggleTrackingSwitch() {
    setIsTrackingSwitchActive((prevActive) => !prevActive)
    setIsSaveButtonDisabled((prevValue) => !prevValue)
  }

  function save() {
    storage.saveObject('has_accepted_cookie', isTrackingSwitchActive).then(() => {
      setIsSaveButtonDisabled((prevValue) => !prevValue)
      firebaseAnalytics.setAnalyticsCollectionEnabled(isTrackingSwitchActive)
    })
    if (previousRoute?.name === 'FirstTutorial') {
      goBack()
    }
  }

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <Spacer.Column numberOfSpaces={18} />
      <ProfileContainer>
        <Typo.Body color={ColorsEnum.BLACK}>
          {_(
            t`L'application pass Culture utilise des traceurs susceptibles de réaliser des statistiques sur ta navigation. Ceci permet d'améliorer la qualité et la sureté de ton expérience. Pour ces besoins, les analyses réalisées sont strictement anonymes et ne comportent aucune donnée personnelle.`
          )}
        </Typo.Body>
        <Spacer.Column numberOfSpaces={4} />
        <MoreInformationContainer>
          <Typo.Caption color={ColorsEnum.GREY_DARK}>
            {_(t`Pour plus d'informations, nous t'invitons à consulter notre`)}
            <ButtonTertiaryWhite
              title={_(t`Politique des cookies`)}
              icon={ExternalLinkSite}
              textSize={12}
              disabled
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
            title={_(t`Autoriser l’utilisation de mes données de navigation`)}
            cta={<FilterSwitch active={isTrackingSwitchActive} toggle={toggleTrackingSwitch} />}
          />
          <Spacer.Column numberOfSpaces={3} />
        </Line>
        <Spacer.Flex flex={1} />
        <ButtonPrimary title={_(t`Enregistrer`)} onPress={save} disabled={isSaveButtonDisabled} />
        <Spacer.Column numberOfSpaces={8} />
      </ProfileContainer>

      <PageHeader title={_(t`Paramètres de confidentialité`)} onGoBack={route.params?.onGoBack} />
    </React.Fragment>
  )
}

const Line = styled.View({
  paddingVertical: getSpacing(4),
})

const MoreInformationContainer = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
})
