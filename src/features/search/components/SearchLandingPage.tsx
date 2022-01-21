import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { ScrollView, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { SearchGroupNameEnum } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { Search as SearchButton } from 'features/search/atoms/Buttons'
import { useLocationChoice } from 'features/search/components/locationChoice.utils'
import { CATEGORY_CRITERIA, LocationType } from 'features/search/enums'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { useMediaQuery } from 'libs/react-responsive/useMediaQuery'
import { useSearchGroupLabel } from 'libs/subcategories'
import { HiddenText } from 'ui/components/HiddenText'
import { BicolorIconInterface } from 'ui/svg/icons/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'

const SMALL_VIEWPORT_MAX_HEIGHT = 500

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

  const mqSmallWebViewportHeight = useMediaQuery({ maxHeight: SMALL_VIEWPORT_MAX_HEIGHT }, 'web')

  const searchCategoriesDescribedBy = uuidv4()

  return (
    <React.Fragment>
      <ScrollView contentContainerStyle={contentContainerStyle}>
        <Spacer.Flex flex={mqSmallWebViewportHeight ? 0.5 : 1} />

        <TouchableOpacity
          onPress={() => navigate('SearchCategories')}
          aria-describedby={searchCategoriesDescribedBy}>
          <BicolorListItem title={searchGroupLabel} Icon={Icon} secondaryText={t`Je cherche`} />
        </TouchableOpacity>
        <HiddenText
          nativeID={
            searchCategoriesDescribedBy
          }>{t`Clique ici pour accéder à la liste des catégories afin d'affiner les résultats puis lance la recherche à l'aide du bouton "Rechercher"`}</HiddenText>

        <Separator isSmallWebViewportHeight={mqSmallWebViewportHeight} />

        <TouchableOpacity onPress={() => navigate('LocationFilter')}>
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
    marginVertical: getSpacing(isSmallWebViewportHeight ? 2 : 8),
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

const TouchableOpacity = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))({ alignItems: 'center' })

const iconSize = getSpacing(9)
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
        <Spacer.Row numberOfSpaces={2} />
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
