import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { Touchable } from 'ui/components/touchable/Touchable'
import { Typo } from 'ui/theme'

import { PageHeaderNew } from './PageHeaderNew'

export default {
  title: 'ui/Header',
  component: PageHeaderNew,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
} as ComponentMeta<typeof PageHeaderNew>

const Template: ComponentStory<typeof PageHeaderNew> = (props) => <PageHeaderNew {...props} />

export const Default = Template.bind({})
Default.args = {
  title: 'Titre du header',
}

export const WithRightComponent = Template.bind({})
WithRightComponent.args = {
  title: 'Titre du header',
  RightComponent: () => (
    <Touchable>
      <Typo.ButtonText>{`Réinitialiser`}</Typo.ButtonText>
    </Touchable>
  ),
}

export const WithPrimaryBackgorund = Template.bind({})
WithPrimaryBackgorund.args = {
  title: 'Titre du header',
  background: 'primary',
}

export const WithGradientBackgorund = Template.bind({})
WithGradientBackgorund.args = {
  title: 'Titre du header',
  background: 'gradient',
}

export const Small = Template.bind({})
Small.args = {
  title: 'Titre du header',
  size: 'small',
}
