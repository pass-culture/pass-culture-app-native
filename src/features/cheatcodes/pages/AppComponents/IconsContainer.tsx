import { ComponentStory } from '@storybook/react'
import React from 'react'
import { Text } from 'react-native'

import { Illustration } from 'ui/storybook/Illustration'
import { IconInterface } from 'ui/svg/icons/types'

export const IconsContainer: ComponentStory<
  React.FC<{
    title: string
    icons: Record<string, React.ComponentType<IconInterface>>
    children?: never
  }>
> = ({ title, icons }) => (
  <React.Fragment>
    {!!title && <Text>{title}</Text>}
    {Array.from(Object.entries(icons)).map(([name, icon]) => (
      <Illustration key={name} name={name} component={icon} />
    ))}
  </React.Fragment>
)
