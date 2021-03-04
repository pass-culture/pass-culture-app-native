import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components/native'

import { useBackNavigation } from 'features/navigation/backNavigation'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { storage } from 'libs/storage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import FilterSwitch from 'ui/components/FilterSwitch'
import { ExternalLinkSite } from 'ui/svg/icons/ExternalLinkSite'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { ProfileHeaderWithNavigation } from '../components/ProfileHeaderWithNavigation'
import { ProfileContainer, Separator } from '../components/reusables'
import { SectionRow } from '../components/SectionRow'

type Props = StackScreenProps<RootStackParamList, 'ConsentSettings'>

export const ConsentSettings: FunctionComponent<Props> = ({ route }) => {
  const { goBack } = useNavigation()
  const [isTrackingAllowed, setIsTrackingAllowed] = useState(true)

  function save() {
    storage.saveObject('has_accepted_cookie', isTrackingAllowed)
    goBack()
  }

  return (
    <React.Fragment>
      <ProfileHeaderWithNavigation
        title={_(t`Paramètres de confidentialité`)}
        onGoBack={route.params?.onGoBack}
      />
      <Spacer.Column numberOfSpaces={6} />
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
            cta={
              <FilterSwitch
                active={isTrackingAllowed}
                toggle={() => setIsTrackingAllowed((prevActive) => !prevActive)}
              />
            }
          />
          <Spacer.Column numberOfSpaces={3} />
        </Line>
        <Spacer.Flex flex={1} />
        <ButtonPrimary title={_(t`Enregistrer`)} onPress={save} />
        <Spacer.Column numberOfSpaces={8} />
      </ProfileContainer>
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
