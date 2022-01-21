import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { Section } from 'features/search/atoms/Sections'
import { useLocationChoice } from 'features/search/components/locationChoice.utils'
import { LocationType } from 'features/search/enums'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { Typo, Spacer, ColorsEnum, getSpacing } from 'ui/theme'

export const Location: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { searchState } = useStagedSearch()
  const { locationType } = searchState.locationFilter

  // PLACE and VENUE belong to the same section
  const section = locationType === LocationType.VENUE ? LocationType.PLACE : locationType
  const { Icon, label } = useLocationChoice(section)
  const logUseFilter = useLogFilterOnce(SectionTitle.Location)

  const onPressChangeLocation = () => {
    logUseFilter()
    navigate('LocationFilter')
  }

  return (
    <Section title={SectionTitle.Location} count={+(locationType !== LocationType.EVERYWHERE)}>
      <LocationContentContainer testID="changeLocation" onPress={onPressChangeLocation}>
        <Icon size={getSpacing(10)} color={ColorsEnum.BLACK} color2={ColorsEnum.BLACK} />
        <Spacer.Row numberOfSpaces={2} />
        <Label numberOfLines={2}>{label}</Label>
        <Spacer.Flex />
        <ArrowNext size={getSpacing(5)} />
      </LocationContentContainer>
      {locationType === LocationType.AROUND_ME ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.Caption color={ColorsEnum.GREY_DARK}>
            {t`Seules les sorties et offres physiques seront affichées`}
          </Typo.Caption>
        </React.Fragment>
      ) : null}
    </Section>
  )
}

const LocationContentContainer = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const Label = styled(Typo.ButtonText)({
  flexShrink: 1,
})
