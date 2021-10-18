import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { ScrollView, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { SearchGroupNameEnum } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { Search as SearchButton } from 'features/search/atoms/Buttons'
import { useLocationChoice } from 'features/search/components/locationChoice.utils'
import { CATEGORY_CRITERIA, LocationType } from 'features/search/enums'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { useSearchGroupLabel } from 'libs/subcategories'
import { BicolorIconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing, Spacer, Typo, TAB_BAR_COMP_HEIGHT } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

export const SearchLandingPage: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { searchState } = useStagedSearch()
  const { locationFilter, offerCategories } = searchState
  const { locationType } = locationFilter
  const [searchCategory] = [...offerCategories, SearchGroupNameEnum.NONE]

  const searchGroupLabel = useSearchGroupLabel(searchCategory)
  const { icon: Icon } = CATEGORY_CRITERIA[searchCategory]

  // PLACE and VENUE belong to the same section
  const section = locationType === LocationType.VENUE ? LocationType.PLACE : locationType
  const { Icon: LocationIcon, label: locationLabel } = useLocationChoice(section)

  return (
    <React.Fragment>
      <ScrollView contentContainerStyle={contentContainerStyle}>
        <Spacer.Flex />

        <TouchableOpacity onPress={() => navigate('SearchCategories')}>
          <BicolorListItem title={searchGroupLabel} Icon={Icon} secondaryText={t`Je cherche`} />
        </TouchableOpacity>

        <Separator />

        <TouchableOpacity onPress={() => navigate('LocationFilter')}>
          <BicolorListItem title={locationLabel} Icon={LocationIcon} secondaryText={t`Où`} />
        </TouchableOpacity>

        <Spacer.Flex flex={2} />
      </ScrollView>
      <SearchButtonContainer>
        <SearchButton />
        <Spacer.BottomScreen />
      </SearchButtonContainer>
    </React.Fragment>
  )
}

const contentContainerStyle: ViewStyle = {
  alignItems: 'center',
  flexGrow: 1,
  marginHorizontal: getSpacing(6),
}
const Separator = styled.View(({ theme }) => ({
  height: 2,
  width: theme.appContentWidth - getSpacing(2 * 6),
  backgroundColor: ColorsEnum.GREY_LIGHT,
  marginVertical: getSpacing(8),
}))
const SearchButtonContainer = styled.View(({ theme }) => ({
  alignSelf: 'center',
  position: 'absolute',
  bottom: TAB_BAR_COMP_HEIGHT + getSpacing(6),
  width: theme.appContentWidth - getSpacing(2 * 6),
}))

const TouchableOpacity = styled.TouchableOpacity.attrs({
  activeOpacity: ACTIVE_OPACITY,
})({ alignItems: 'center' })

const iconSize = getSpacing(12)
const iconSpacing = Math.round(iconSize / 5)

const BicolorListItem: React.FC<{
  title: string
  Icon: React.FC<BicolorIconInterface>
  secondaryText: string | React.ElementType
}> = ({ title, secondaryText, Icon }) => {
  return (
    <Container>
      <Typo.Body color={ColorsEnum.GREY_DARK}>{secondaryText}</Typo.Body>
      <Spacer.Column numberOfSpaces={2} />
      <TitleIconContainer>
        <IconContainer>
          <Icon size={iconSize} color={ColorsEnum.PRIMARY} color2={ColorsEnum.SECONDARY} />
        </IconContainer>
        <Title numberOfLines={1}>{title}</Title>
      </TitleIconContainer>
    </Container>
  )
}

const Container = styled.View({
  alignItems: 'center',
})

const TitleIconContainer = styled.View({
  alignItems: 'center',
  flexDirection: 'row',
})

const Title = styled(Typo.Title3)({
  flexShrink: 1,
  left: -iconSpacing,
})

const IconContainer = styled.View({
  left: -iconSpacing,
})
