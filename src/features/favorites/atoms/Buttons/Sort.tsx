import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { Sort as SortIcon } from 'ui/svg/icons/Sort'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

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
        <SortIcon color={ColorsEnum.WHITE} />
        <Spacer.Row numberOfSpaces={1} />
        <Title>{t`Trier`}</Title>
        <Spacer.Row numberOfSpaces={2} />
      </StyledLinearGradient>
    </Container>
  )
}

const Container = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
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
