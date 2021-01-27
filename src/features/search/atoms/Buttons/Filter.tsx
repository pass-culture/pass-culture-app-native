import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { getFilterCount } from 'features/search/utils/getFilterCount'
import { _ } from 'libs/i18n'
import { Filter as FilterIcon } from 'ui/svg/icons/Filter'
import { ColorsEnum, UniqueColors, getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'
import { BorderRadiusEnum } from 'ui/theme/grid'

export const Filter: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { searchState } = useSearch()
  const filterCount = getFilterCount(searchState)

  return (
    <Container onPress={() => navigate('SearchFilter')} testID="FilterButton">
      <StyledLinearGradient colors={[ColorsEnum.PRIMARY, UniqueColors.FILTER_BUTTON]} angle={106}>
        <FilterIcon color={ColorsEnum.WHITE} />
        <Spacer.Row numberOfSpaces={1} />
        <Title>{_(t`Filtrer`)}</Title>
        <Spacer.Row numberOfSpaces={2} />
        {filterCount > 0 && (
          <React.Fragment>
            <Spacer.Row numberOfSpaces={1} />
            <WhiteBackgroundContainer>
              <Spacer.Row numberOfSpaces={0.5} />
              <Typo.ButtonText color={ColorsEnum.PRIMARY}>{filterCount}</Typo.ButtonText>
            </WhiteBackgroundContainer>
            <Spacer.Row numberOfSpaces={1} />
          </React.Fragment>
        )}
      </StyledLinearGradient>
    </Container>
  )
}

const Container = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: ACTIVE_OPACITY,
}))({ overflow: 'hidden' })

const StyledLinearGradient = styled(LinearGradient)({
  borderRadius: BorderRadiusEnum.BUTTON,
  alignItems: 'center',
  flexDirection: 'row',
  overflow: 'hidden',
  paddingHorizontal: getSpacing(3),
  height: getSpacing(10),
})

const Title = styled(Typo.ButtonText)({ color: ColorsEnum.WHITE })
const WhiteBackgroundContainer = styled.View({
  flexDirection: 'row',
  backgroundColor: ColorsEnum.WHITE,
  borderRadius: getSpacing(6),
  aspectRatio: '1',
  width: getSpacing(6),
  alignItems: 'center',
  justifyContent: 'center',
})
