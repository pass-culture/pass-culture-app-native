import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { Section } from 'features/search/atoms/Sections'
import { useLocationChoice } from 'features/search/components/locationChoice.utils'
import { LocationType } from 'features/search/enums'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { useLocationType } from 'features/search/pages/useLocationType'
import { SectionTitle } from 'features/search/sections/titles'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { GreyDarkCaption } from 'ui/components/GreyDarkCaption'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ArrowNext as DefaultArrowNext } from 'ui/svg/icons/ArrowNext'
import { Typo, Spacer } from 'ui/theme'

export const Location: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { searchState } = useSearch()

  const { locationType, section } = useLocationType(searchState)
  const { Icon, label } = useLocationChoice(section)
  const logUseFilter = useLogFilterOnce(SectionTitle.Location)

  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    color: theme.colors.black,
    color2: theme.colors.black,
    size: theme.icons.sizes.small,
  }))``

  const onPressChangeLocation = () => {
    logUseFilter()
    navigate('LocationFilter')
  }

  const captionId = locationType === LocationType.AROUND_ME ? uuidv4() : undefined
  return (
    <Section title={SectionTitle.Location} count={+(locationType !== LocationType.EVERYWHERE)}>
      <LocationContentContainer
        testID="changeLocation"
        onPress={onPressChangeLocation}
        aria-describedby={captionId}>
        <StyledIcon />
        <Spacer.Row numberOfSpaces={2} />
        <Label numberOfLines={2}>{label}</Label>
        <Spacer.Flex />
        <ArrowNext />
      </LocationContentContainer>
      {locationType === LocationType.AROUND_ME ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={2} />
          <GreyDarkCaption nativeID={captionId}>
            {t`Seules les sorties et offres physiques seront affichées`}
          </GreyDarkCaption>
        </React.Fragment>
      ) : null}
    </Section>
  )
}

const LocationContentContainer = styled(TouchableOpacity)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const Label = styled(Typo.ButtonText)({
  flexShrink: 1,
})

const ArrowNext = styled(DefaultArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
