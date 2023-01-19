// eslint-disable-next-line import/no-extraneous-dependencies
import { ComponentStory } from '@storybook/react'
import React, { useMemo } from 'react'
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
> = ({ title, icons, isBicolor = false }) => {
  const sortedIcons = useMemo(() => {
    return Object.entries(icons).sort(([iconName1], [iconName2]) => {
      if (iconName1 < iconName2) return -1
      else if (iconName1 > iconName2) return 1
      else return 0
    })
  }, [icons])
  return (
    <React.Fragment>
      {!!title && <Text>{title}</Text>}
      {sortedIcons.map(([name, icon]) => {
        const IconComponent = styled(icon)({})
        const IconComponentBicolor = styled(icon).attrs(({ theme }) => ({
          color: theme.colors.primary,
          color2: theme.colors.secondary,
        }))``
        return (
          <AlignedText key={name}>
            <IconComponent />
            {!!isBicolor && <IconComponentBicolor />}
            <Text> - {name}</Text>
          </AlignedText>
        )
      })}
    </React.Fragment>
  )
}

const AlignedText = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: getSpacing(1),
})
