import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { useSearch } from 'features/search/pages/SearchWrapper'
import { _ } from 'libs/i18n'
import { Rectangle } from 'ui/svg/Rectangle'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'
import { BorderRadiusEnum } from 'ui/theme/grid'

export const SearchButton: React.FC = () => {
  const { dispatch } = useSearch()

  const onPress = () => {
    dispatch({ type: 'SHOW_RESULTS', payload: true })
  }

  return (
    <Container onPress={onPress}>
      <Rectangle height={getSpacing(12)} size="100%" />
      <Title adjustsFontSizeToFit numberOfLines={1}>
        {_(t`Rechercher`)}
      </Title>
    </Container>
  )
}

const Container = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: ACTIVE_OPACITY,
}))({
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: BorderRadiusEnum.BUTTON,
  overflow: 'hidden',
})

const Title = styled(Typo.ButtonText)({
  position: 'absolute',
  color: ColorsEnum.WHITE,
  padding: getSpacing(5),
})
