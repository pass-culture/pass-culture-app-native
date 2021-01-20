import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { Section } from 'features/search/atoms/Sections'
import { getLocationChoiceName } from 'features/search/components/locationChoice.utils'
import { LocationChoiceType } from 'features/search/locationChoice.types'
import { _ } from 'libs/i18n'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { Typo, Spacer, ColorsEnum } from 'ui/theme'

const renderLocationContent = (locationChoice: LocationChoiceType, onPress: () => void) => {
  return (
    <React.Fragment>
      <LocationContentContainer onPress={onPress}>
        <Typo.ButtonText>{getLocationChoiceName(locationChoice)}</Typo.ButtonText>
        <ArrowNext size={24} />
      </LocationContentContainer>
      {locationChoice === LocationChoiceType.LOCALIZED && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.Caption color={ColorsEnum.GREY_DARK}>
            {_(t`Seules les offres Sorties et Physiques seront affichés`)}
          </Typo.Caption>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export const LocationSection: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const onPress = () => navigate('LocationFilter')
  return (
    <React.Fragment>
      <Section title={_(t`Localisation`)}>
        {renderLocationContent(LocationChoiceType.LOCALIZED, onPress)}
      </Section>
    </React.Fragment>
  )
}

const LocationContentContainer = styled.TouchableOpacity({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
})
