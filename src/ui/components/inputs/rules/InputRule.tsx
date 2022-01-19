import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing, Typo, Spacer } from 'ui/theme'

type Props = {
  title: string
  icon: FunctionComponent<IconInterface>
  iconSize: number
  color: ColorsEnum
  testIdSuffix?: string
  centered?: boolean
}

export const InputRule: FunctionComponent<Props> = (props) => {
  const { title, icon, iconSize, color, testIdSuffix, centered } = props
  const Icon = icon
  return (
    <StyledView centered={centered}>
      <Icon testID={`rule-icon-${testIdSuffix}`} color={color} size={iconSize} />
      <Spacer.Row numberOfSpaces={1} />
      <StyledCaption color={color} centered={centered}>
        {title}
      </StyledCaption>
    </StyledView>
  )
}

const StyledView = styled.View<{ centered?: boolean }>(({ centered, theme }) => ({
  flexDirection: 'row',
  maxWidth: theme.desktopCenteredContentMaxWidth,
  alignItems: 'center',
  ...(centered ? {} : { width: '100%' }),
}))

const StyledCaption = styled(Typo.Caption)<{ centered?: boolean }>(({ centered }) => ({
  paddingLeft: getSpacing(1),
  flexShrink: 1,
  ...(centered ? { textAlign: 'center' } : {}),
}))
