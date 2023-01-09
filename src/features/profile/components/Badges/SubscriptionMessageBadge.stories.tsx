import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { CallToActionIcon, PopOverIcon } from 'api/gen'

import { SubscriptionMessageBadge } from './SubscriptionMessageBadge'

export default {
  title: 'features/profile/SubscriptionMessageBadge',
  component: SubscriptionMessageBadge,
} as ComponentMeta<typeof SubscriptionMessageBadge>

const Template: ComponentStory<typeof SubscriptionMessageBadge> = (props) => (
  <SubscriptionMessageBadge {...props} />
)

export const Default = Template.bind({})
Default.args = {
  subscriptionMessage: {
    userMessage: 'Dossier déposé, nous sommes en train de le traiter',
  },
}

export const WithUpdatedAt = Template.bind({})
WithUpdatedAt.args = {
  subscriptionMessage: {
    userMessage: 'Dossier déposé, nous sommes en train de le traiter',
    updatedAt: '2021-10-25T13:24Z',
  },
}

export const WithPopOverIcon = Template.bind({})
WithPopOverIcon.args = {
  subscriptionMessage: {
    userMessage: 'Dossier déposé, nous sommes en train de le traiter',
    popOverIcon: PopOverIcon.FILE,
  },
}

// TODO(PC-17931): Fix this story
const WithCTA = Template.bind({})
WithCTA.args = {
  subscriptionMessage: {
    userMessage: 'Dossier déposé, nous sommes en train de le traiter',
    popOverIcon: PopOverIcon.FILE,
    callToAction: {
      callToActionIcon: CallToActionIcon.RETRY,
      callToActionLink: 'https://google.com',
      callToActionTitle: 'Tu peux cliquer',
    },
  },
}
