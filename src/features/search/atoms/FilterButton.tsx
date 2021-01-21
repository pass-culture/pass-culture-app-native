import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { Filter } from 'ui/svg/icons/Filter'
import { ColorsEnum, UniqueColors, getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'
import { BorderRadiusEnum } from 'ui/theme/grid'

export const FilterButton: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  return (
    <Container onPress={() => navigate('SearchFilter')} testID="FilterButton">
      <StyledLinearGradient colors={[ColorsEnum.PRIMARY, UniqueColors.FILTER_BUTTON]} angle={106}>
        <Filter color={ColorsEnum.WHITE} />
        <Spacer.Row numberOfSpaces={1} />
        <Title>{_(t`Filtrer`)}</Title>
        <Spacer.Row numberOfSpaces={2} />
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

const Title = styled(Typo.ButtonText)({
  color: ColorsEnum.WHITE,
})
