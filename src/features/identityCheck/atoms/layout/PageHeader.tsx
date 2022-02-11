import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { ArrowPrevious as DefaultArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typography'

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

const HeaderContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  height: theme.appBarHeight,
}))

const Title = styled(Typo.Title4).attrs(() => getHeadingAttrs(1))(({ theme }) => ({
  flex: 1,
  textAlign: 'center',
  color: theme.colors.white,
}))

interface BackButtonProps {
  onGoBack?: () => void
}

const BackIcon: React.FC<BackButtonProps> = (props) => {
  const { goBack } = useGoBack(...homeNavConfig)
  return (
    <StyledTouchableOpacity
      onPress={props.onGoBack ?? goBack}
      {...accessibilityAndTestId(t`Revenir en arrière`)}>
      <ArrowPrevious testID="icon-back" />
    </StyledTouchableOpacity>
  )
}

const ArrowPrevious = styled(DefaultArrowPrevious).attrs(({ theme }) => ({
  color: theme.colors.white,
  size: theme.icons.sizes.small,
}))``

const StyledTouchableOpacity = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))({ position: 'absolute', left: getSpacing(3) })
