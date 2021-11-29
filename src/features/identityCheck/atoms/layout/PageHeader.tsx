import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { accessibilityAndTestId } from 'tests/utils'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

export const HEADER_HEIGHT = getSpacing(16)

interface Props {
  title: string
  onGoBack?: () => void
}

export const PageHeader: React.FC<Props> = (props) => (
  <HeaderContainer>
    <Title>{props.title}</Title>
    <BackIcon />
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

const BackIcon = () => {
  const { goBack } = useGoBack(...homeNavConfig)
  return (
    <StyledTouchableOpacity onPress={goBack} {...accessibilityAndTestId(t`Revenir en arrière`)}>
      <ArrowPrevious color={ColorsEnum.WHITE} testID="icon-back" />
    </StyledTouchableOpacity>
  )
}

const StyledTouchableOpacity = styled.TouchableOpacity.attrs({
  activeOpacity: ACTIVE_OPACITY,
})({ position: 'absolute', left: getSpacing(3) })
