import { t } from '@lingui/macro'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { Filter as FilterIcon } from 'ui/svg/icons/Filter'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'
import { BorderRadiusEnum } from 'ui/theme/grid'

export const Filter: React.FC = () => {
  return (
    <Container onPress={() => null} testID="FilterButton">
      <StyledLinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={['#bf275f', '#5a0d80']}>
        <FilterIcon color={ColorsEnum.WHITE} />
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

const Title = styled(Typo.ButtonText)({ color: ColorsEnum.WHITE })
