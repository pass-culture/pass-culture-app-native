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
import { ACTIVE_OPACITY } from 'ui/theme/colors'

const renderLocationContent = (locationChoice: LocationChoiceType, onPress: () => void) => {
  return (
    <React.Fragment>
      <LocationContentContainer onPress={onPress}>
        <Typo.ButtonText>{getLocationChoiceName(locationChoice)}</Typo.ButtonText>
        <ArrowNext size={24} />
      </LocationContentContainer>
      {locationChoice === LocationChoiceType.AROUND_ME && (
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
  const onPress = () => navigate('LocationFilter')
  // TODO: PC-6394 Count to change when we will connect Location to searchState
  return (
    <Section title={_(t`Localisation`)} count={1}>
      {renderLocationContent(LocationChoiceType.AROUND_ME, onPress)}
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
