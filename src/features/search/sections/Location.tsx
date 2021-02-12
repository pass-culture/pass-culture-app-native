import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { Section } from 'features/search/atoms/Sections'
import { useLocationChoice } from 'features/search/components/locationChoice.utils'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { LocationType } from 'libs/algolia'
import { _ } from 'libs/i18n'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { Typo, Spacer, ColorsEnum } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

export const Location: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { searchState } = useStagedSearch()
  const locationType = searchState.locationType
  const { label } = useLocationChoice(locationType)
  const logUseFilter = useLogFilterOnce(SectionTitle.Location)

  const onPressChangeLocation = () => {
    logUseFilter()
    navigate('LocationFilter')
  }

  return (
    <Section title={SectionTitle.Location} count={+(locationType !== LocationType.EVERYWHERE)}>
      <LocationContentContainer testID="changeLocation" onPress={onPressChangeLocation}>
        <Typo.ButtonText>{label}</Typo.ButtonText>
        <ArrowNext size={24} />
      </LocationContentContainer>
      {locationType === LocationType.AROUND_ME && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.Caption color={ColorsEnum.GREY_DARK}>
            {_(t`Seules les sorties et offres physiques seront affichées`)}
          </Typo.Caption>
        </React.Fragment>
      )}
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
