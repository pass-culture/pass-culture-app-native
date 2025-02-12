import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { STORE_LINK } from 'features/forceUpdate/constants'
import { RemoteBannerDumb } from 'features/remoteBanner/components/RemoteBanner'
import { Variants, VariantsStory, VariantsTemplate } from 'ui/storybook/VariantsTemplate'

const meta: ComponentMeta<typeof RemoteBannerDumb> = {
  title: 'ui/banners/RemoteBannerStoryBookComponent',
  component: RemoteBannerDumb,
}
export default meta

const variantConfig: Variants<typeof RemoteBannerDumb> = [
  {
    label: 'Link to stores',
    props: {
      accessibilityLabel: `Nouvelle fenêtre\u00a0: ${STORE_LINK}`,
      isStoreRedirection: true,
      redirectionUrl: '',
      showWebAlternative: false,
      subtitleMobile: 'Go to the store',
      subtitleWeb: 'Refresh the web app',
      title: 'You must update your app',
    },
  },
  {
    label: 'External link',
    props: {
      accessibilityLabel: `Nouvelle fenêtre\u00a0: https://www.google.fr`,
      isStoreRedirection: false,
      redirectionUrl: 'https://www.google.fr',
      showWebAlternative: false,
      subtitleMobile: 'This is a mobile link',
      subtitleWeb: 'This is a web link',
      title: 'This will take you to an external link',
    },
  },
]

const Template: VariantsStory<typeof RemoteBannerDumb> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={RemoteBannerDumb} defaultProps={args} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'RemoteBanner'
