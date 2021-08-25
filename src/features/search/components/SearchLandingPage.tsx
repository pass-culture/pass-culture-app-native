import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { ScrollView, ViewStyle } from 'react-native'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { CategoryNameEnum } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { Search as SearchButton } from 'features/search/atoms/Buttons'
import { useLocationChoice } from 'features/search/components/locationChoice.utils'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { BicolorIconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing, Spacer, Typo, TAB_BAR_COMP_HEIGHT } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

export const SearchLandingPage: React.FC = () => {
  const windowWidth = useWindowDimensions().width
  const { navigate } = useNavigation<UseNavigationType>()
  const { searchState } = useStagedSearch()
  const [selectedCategory] = searchState.offerCategories
  const { icon: Icon, label } = CATEGORY_CRITERIA[(selectedCategory as CategoryNameEnum) || 'ALL']
  const { Icon: LocationIcon, label: locationLabel } = useLocationChoice(searchState.locationType)

  return (
    <React.Fragment>
      <ScrollView contentContainerStyle={contentContainerStyle}>
        <Spacer.Flex />

        <TouchableOpacity onPress={() => navigate('SearchCategories')}>
          <BicolorListItem title={label} Icon={Icon} secondaryText={t`Je cherche`} />
        </TouchableOpacity>

        <Separator windowWidth={windowWidth} />

        <TouchableOpacity onPress={() => navigate('LocationFilter')}>
          <BicolorListItem title={locationLabel} Icon={LocationIcon} secondaryText={t`Où`} />
        </TouchableOpacity>

        <Spacer.Flex flex={2} />
      </ScrollView>
      <SearchButtonContainer windowWidth={windowWidth}>
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
const Separator = styled.View<{ windowWidth: number }>((props) => ({
  height: 2,
  width: props.windowWidth - getSpacing(2 * 6),
  backgroundColor: ColorsEnum.GREY_LIGHT,
  marginVertical: getSpacing(8),
}))
const SearchButtonContainer = styled.View<{ windowWidth: number }>((props) => ({
  alignSelf: 'center',
  position: 'absolute',
  bottom: TAB_BAR_COMP_HEIGHT + getSpacing(6),
  width: props.windowWidth - getSpacing(2 * 6),
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
