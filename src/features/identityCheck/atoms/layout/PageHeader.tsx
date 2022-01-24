import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { accessibilityAndTestId } from 'tests/utils'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { getSpacing, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
export const HEADER_HEIGHT = getSpacing(16)

interface Props {
  title: string
  onGoBack?: () => void
}

export const PageHeader: React.FC<Props> = (props) => (
  <HeaderContainer>
    <Title>{props.title}</Title>
    <BackIcon onGoBack={props.onGoBack} />
  </HeaderContainer>
)

const HeaderContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  height: HEADER_HEIGHT,
})

const Title = styled(Typo.Title4).attrs({
  color: ColorsEnum.WHITE,
})({ flex: 1, textAlign: 'center' })

interface BackButtonProps {
  onGoBack?: () => void
}

const BackIcon: React.FC<BackButtonProps> = (props) => {
  const { goBack } = useGoBack(...homeNavConfig)
  return (
    <StyledTouchableOpacity
      onPress={props.onGoBack ?? goBack}
      {...accessibilityAndTestId(t`Revenir en arrière`)}>
      <ArrowPrevious color={ColorsEnum.WHITE} size={24} testID="icon-back" />
    </StyledTouchableOpacity>
  )
}

const StyledTouchableOpacity = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))({ position: 'absolute', left: getSpacing(3) })
