import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { Section } from 'features/search/atoms/Sections'
import { getLocationChoiceName } from 'features/search/components/locationChoice.utils'
import { LocationType } from 'libs/algolia'
import { _ } from 'libs/i18n'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { Typo, Spacer, ColorsEnum } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

import { useSearch } from '../pages/SearchWrapper'

const renderLocationContent = (locationChoice: LocationType, onPress: () => void) => {
  return (
    <React.Fragment>
      <LocationContentContainer onPress={onPress}>
        <Typo.ButtonText>{getLocationChoiceName(locationChoice)}</Typo.ButtonText>
        <ArrowNext size={24} />
      </LocationContentContainer>
      {locationChoice === LocationType.AROUND_ME && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.Caption color={ColorsEnum.GREY_DARK}>
            {_(t`Seules les offres Sorties et Physiques seront affichées`)}
          </Typo.Caption>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export const LocationSection: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { searchState } = useSearch()

  const onPress = () => navigate('LocationFilter')
  return (
    <Section title={_(t`Localisation`)} count={1}>
      {renderLocationContent(searchState.searchAround, onPress)}
    </Section>
  )
}

const LocationContentContainer = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: ACTIVE_OPACITY,
}))({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
})
