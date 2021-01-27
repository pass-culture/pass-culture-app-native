import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Dimensions, ScrollView, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { CategoryNameEnum } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { TAB_BAR_COMP_HEIGHT } from 'features/navigation/TabBar/TabBarComponent'
import { Search as SearchButton } from 'features/search/atoms/Buttons'
import { useLocationChoice } from 'features/search/components/locationChoice.utils'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { CATEGORY_CRITERIA } from 'libs/algolia/enums'
import { _ } from 'libs/i18n'
import { BicolorIconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

const { width } = Dimensions.get('window')

export const SearchLandingPage: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { searchState } = useSearch()
  const [selectedCategory] = searchState.offerCategories
  const { icon: Icon, label } = CATEGORY_CRITERIA[(selectedCategory as CategoryNameEnum) || 'ALL']
  const { Icon: LocationIcon, label: locationLabel } = useLocationChoice(searchState.searchAround)

  return (
    <React.Fragment>
      <ScrollView contentContainerStyle={contentContainerStyle}>
        <Spacer.Flex />

        <TouchableOpacity onPress={() => navigate('SearchCategories')}>
          <Typo.Body color={ColorsEnum.GREY_DARK}>{_(t`Je cherche`)}</Typo.Body>
          <Spacer.Column numberOfSpaces={2} />
          <BicolorIconLabel title={label} Icon={Icon} />
        </TouchableOpacity>

        <Separator />

        <TouchableOpacity onPress={() => navigate('LocationFilter')}>
          <Typo.Body color={ColorsEnum.GREY_DARK}>{_(t`Où`)}</Typo.Body>
          <Spacer.Column numberOfSpaces={2} />
          <BicolorIconLabel title={locationLabel} Icon={LocationIcon} />
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

const contentContainerStyle: ViewStyle = { alignItems: 'center', flexGrow: 1 }
const Separator = styled.View({
  height: 2,
  width: width - getSpacing(2 * 6),
  backgroundColor: ColorsEnum.GREY_LIGHT,
  marginVertical: getSpacing(8),
})
const SearchButtonContainer = styled.View({
  alignSelf: 'center',
  position: 'absolute',
  bottom: TAB_BAR_COMP_HEIGHT + getSpacing(6),
  width: width - getSpacing(2 * 6),
})

const TouchableOpacity = styled.TouchableOpacity.attrs({
  activeOpacity: ACTIVE_OPACITY,
})({ alignItems: 'center' })

const BicolorIconLabel: React.FC<{
  title: string
  Icon: React.FC<BicolorIconInterface>
}> = ({ title, Icon }) => {
  return (
    <Container>
      <Icon size={getSpacing(12)} color={ColorsEnum.PRIMARY} color2={ColorsEnum.SECONDARY} />
      <Typo.Title3>{title}</Typo.Title3>
    </Container>
  )
}

const Container = styled.View({ flexDirection: 'row', alignItems: 'center' })
