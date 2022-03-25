import { ComponentStory } from '@storybook/react'
import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'

export const IconsContainer: ComponentStory<
  React.FC<{
    title: string
    icons: Record<string, React.ComponentType<IconInterface>>
    isBicolor?: boolean
    children?: never
  }>
> = ({ title, icons, isBicolor = false }) => (
  <React.Fragment>
    {!!title && <Text>{title}</Text>}
    {Array.from(Object.entries(icons)).map(([name, icon]) => {
      const IconComponent = styled(icon)({})
      const IconComponentBicolor = styled(icon).attrs(({ theme }) => ({
        color: theme.colors.primary,
        color2: theme.colors.secondary,
      }))``
      return (
        <AlignedText key={name}>
          <IconComponent />
          {isBicolor ? <IconComponentBicolor /> : null}
          <Text> - {name}</Text>
        </AlignedText>
      )
    })}
  </React.Fragment>
)

const AlignedText = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: getSpacing(1),
})
