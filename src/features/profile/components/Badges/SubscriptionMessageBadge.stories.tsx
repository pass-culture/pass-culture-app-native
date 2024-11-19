import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { CallToActionIcon, PopOverIcon } from 'api/gen'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { SubscriptionMessageBadge } from './SubscriptionMessageBadge'

const meta: ComponentMeta<typeof SubscriptionMessageBadge> = {
  title: 'features/profile/SubscriptionMessageBadge',
  component: SubscriptionMessageBadge,
}
export default meta

const variantConfig: Variants<typeof SubscriptionMessageBadge> = [
  {
    label: 'SubscriptionMessageBadge',
    props: {
      subscriptionMessage: {
        userMessage: 'Dossier déposé, nous sommes en train de le traiter',
      },
    },
  },
  {
    label: 'SubscriptionMessageBadge with UpdatedAt',
    props: {
      subscriptionMessage: {
        userMessage: 'Dossier déposé, nous sommes en train de le traiter',
        updatedAt: '2021-10-25T13:24Z',
      },
    },
  },
  {
    label: 'SubscriptionMessageBadge with PopOverIcon',
    props: {
      subscriptionMessage: {
        userMessage: 'Dossier déposé, nous sommes en train de le traiter',
        popOverIcon: PopOverIcon.FILE,
      },
    },
  },
  {
    label: 'SubscriptionMessageBadge with CTA',
    props: {
      subscriptionMessage: {
        userMessage: 'Dossier déposé, nous sommes en train de le traiter',
        popOverIcon: PopOverIcon.FILE,
        callToAction: {
          callToActionIcon: CallToActionIcon.RETRY,
          callToActionLink: 'https://google.com',
          callToActionTitle: 'Tu peux cliquer',
        },
      },
    },
  },
]

const Template: VariantsStory<typeof SubscriptionMessageBadge> = (args) => (
  <VariantsTemplate
    variants={variantConfig}
    Component={SubscriptionMessageBadge}
    defaultProps={args}
  />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'SubscriptionMessageBadge'
