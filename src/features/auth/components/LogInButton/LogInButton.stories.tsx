import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { LogInButton } from './LogInButton'

export default {
  title: 'Features/Auth/LogInButton',
  component: LogInButton,
} as ComponentMeta<typeof LogInButton>

const Template: ComponentStory<typeof LogInButton> = () => <LogInButton />

// TODO(PC-17931): Fix this stories
const Login = Template.bind({})
Login.storyName = 'LoginButton'
