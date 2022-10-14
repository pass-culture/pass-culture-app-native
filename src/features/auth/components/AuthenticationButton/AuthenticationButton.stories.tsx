import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { AuthenticationButton } from './AuthenticationButton'

export default {
  title: 'Features/Auth/LogInButton',
  component: AuthenticationButton,
} as ComponentMeta<typeof AuthenticationButton>

const Template: ComponentStory<typeof AuthenticationButton> = () => <AuthenticationButton />

// TODO(PC-17931): Fix this stories
const Authentication = Template.bind({})
Authentication.storyName = 'AuthenticationButton'
