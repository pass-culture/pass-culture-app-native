import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { Filter } from 'ui/svg/icons/Filter'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'
import { BorderRadiusEnum } from 'ui/theme/grid'

export const FilterButton: React.FC = () => {
  const { navigate } = useNavigation()
  return (
    <Container onPress={() => navigate('SearchFilter')}>
      <Filter color={ColorsEnum.WHITE} />
      <Spacer.Row numberOfSpaces={1} />
      <Title>{_(t`Filtrer`)}</Title>
      <Spacer.Row numberOfSpaces={2} />
    </Container>
  )
}

const Container = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: ACTIVE_OPACITY,
}))({
  alignItems: 'center',
  flexDirection: 'row',
  borderRadius: BorderRadiusEnum.BUTTON,
  overflow: 'hidden',
  backgroundColor: ColorsEnum.PRIMARY,
  paddingHorizontal: getSpacing(3),
  height: getSpacing(10),
})

const Title = styled(Typo.ButtonText)({
  color: ColorsEnum.WHITE,
})
