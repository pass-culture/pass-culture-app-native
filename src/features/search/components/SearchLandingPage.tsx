import { t } from '@lingui/macro'
import React from 'react'
import { ScrollView, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { SearchGroupNameEnum } from 'api/gen'
import { Search as SearchButton } from 'features/search/atoms/Buttons'
import { useLocationChoice } from 'features/search/components/locationChoice.utils'
import { CATEGORY_CRITERIA, LocationType, SearchView } from 'features/search/enums'
import { useSearchView, useStagedSearch } from 'features/search/pages/SearchWrapper'
import { useMediaQuery } from 'libs/react-responsive/useMediaQuery'
import { useSearchGroupLabel } from 'libs/subcategories'
import { BicolorIconInterface } from 'ui/svg/icons/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'
const SMALL_VIEWPORT_MAX_HEIGHT = 500

export const SearchLandingPage: React.FC = () => {
  const { setSearchView } = useSearchView()
  const { searchState } = useStagedSearch()
  const { locationFilter, offerCategories } = searchState
  const { locationType } = locationFilter
  const [searchCategory] = [...offerCategories, SearchGroupNameEnum.NONE]

  const searchGroupLabel = useSearchGroupLabel(searchCategory)
  const { icon: Icon } = CATEGORY_CRITERIA[searchCategory]

  // PLACE and VENUE belong to the same section
  const section = locationType === LocationType.VENUE ? LocationType.PLACE : locationType
  const { Icon: LocationIcon, label: locationLabel } = useLocationChoice(section)

  const mqSmallWebViewportHeight = useMediaQuery({ maxHeight: SMALL_VIEWPORT_MAX_HEIGHT }, 'web')

  return (
    <React.Fragment>
      <ScrollView contentContainerStyle={contentContainerStyle}>
        <Spacer.Flex flex={mqSmallWebViewportHeight ? 0.5 : 1} />

        <TouchableOpacity onPress={() => setSearchView(SearchView.CATEGORIES)}>
          <BicolorListItem title={searchGroupLabel} Icon={Icon} secondaryText={t`Je cherche`} />
        </TouchableOpacity>

        <Separator />

        <TouchableOpacity onPress={() => setSearchView(SearchView.LOCATION_FILTERS)}>
          <BicolorListItem title={locationLabel} Icon={LocationIcon} secondaryText={t`Où`} />
        </TouchableOpacity>

        {!mqSmallWebViewportHeight && <Spacer.Flex flex={2} />}
      </ScrollView>
      <SearchButtonContainer isSmallWebViewportHeight={mqSmallWebViewportHeight}>
        <SearchButton />
        <Spacer.BottomScreen />
      </SearchButtonContainer>
    </React.Fragment>
  )
}

const Separator = styled.View<{ isSmallWebViewportHeight?: boolean }>(
  ({ theme, isSmallWebViewportHeight }) => ({
    height: 2,
    width: theme.appContentWidth - getSpacing(2 * 6),
    backgroundColor: theme.colors.greyLight,
    marginVertical: getSpacing(isSmallWebViewportHeight ? 8 : 2),
  })
)
const SearchButtonContainer = styled.View<{ isSmallWebViewportHeight?: boolean }>(
  ({ theme, isSmallWebViewportHeight }) => ({
    alignSelf: 'center',
    width: theme.appContentWidth - getSpacing(2 * 6),
    ...(isSmallWebViewportHeight
      ? {
          flex: 1,
          justifyContent: 'flex-end',
          marginBottom: theme.tabBarHeight + getSpacing(6),
        }
      : {
          position: 'absolute',
          bottom: theme.tabBarHeight + getSpacing(6),
        }),
  })
)

const contentContainerStyle: ViewStyle = {
  alignItems: 'center',
  flexGrow: 1,
}

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
  const { colors } = useTheme()
  return (
    <Container>
      <Typo.Body color={colors.greyDark}>{secondaryText}</Typo.Body>
      <Spacer.Column numberOfSpaces={2} />
      <TitleIconContainer>
        <IconContainer>
          <Icon size={iconSize} color={colors.primary} color2={colors.secondary} />
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
