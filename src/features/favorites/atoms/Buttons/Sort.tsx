import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { Sort as SortIconDefault } from 'ui/svg/icons/Sort'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const Sort: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  function onPress() {
    navigate('FavoritesSorts')
  }
  return (
    <Container onPress={onPress} testID="SortButton">
      <StyledLinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={['#bf275f', '#5a0d80']}>
        <SortIcon />
        <Spacer.Row numberOfSpaces={1} />
        <Title>{t`Trier`}</Title>
        <Spacer.Row numberOfSpaces={2} />
      </StyledLinearGradient>
    </Container>
  )
}

const SortIcon = styled(SortIconDefault).attrs(({ theme }) => ({
  color: theme.colors.white,
}))``

const Container = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))({
  overflow: 'hidden',
})

const StyledLinearGradient = styled(LinearGradient)(({ theme }) => ({
  backgroundColor: theme.colors.primary,
  borderRadius: theme.borderRadius.button,
  alignItems: 'center',
  flexDirection: 'row',
  overflow: 'hidden',
  paddingHorizontal: getSpacing(3),
  height: getSpacing(10),
}))

const Title = styled(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.white,
}))
