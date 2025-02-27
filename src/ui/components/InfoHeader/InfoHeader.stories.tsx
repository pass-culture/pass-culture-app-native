import { Meta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { All } from 'ui/svg/icons/bicolor/All'
import { RightFilled } from 'ui/svg/icons/RightFilled'

import { InfoHeader } from './InfoHeader'

const meta: Meta<typeof InfoHeader> = {
  title: 'ui/InfoHeader',
  component: InfoHeader,
}
export default meta

const baseProps = {
  title: offerResponseSnap.venue.name,
  subtitle: offerResponseSnap.venue.address ?? '',
  defaultThumbnailSize: 56,
}

const RightArrow = () => (
  <React.Fragment>
    <RightIcon testID="RightFilled" />
  </React.Fragment>
)

const RightIcon = styled(RightFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))({
  flexShrink: 0,
})

const variantConfig: Variants<typeof InfoHeader> = [
  {
    label: 'InfoHeader default',
    props: { ...baseProps },
  },
  {
    label: 'InfoHeader with image',
    props: {
      ...baseProps,
      thumbnailComponent: <All size={56} />,
    },
  },
  {
    label: 'InfoHeader with arrow',
    props: {
      ...baseProps,
      rightComponent: <RightArrow />,
    },
  },
  {
    label: 'InfoHeader without subtitle',
    props: {
      ...baseProps,
      subtitle: undefined,
    },
  },
]

const Template: VariantsStory<typeof InfoHeader> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={InfoHeader} defaultProps={args} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'InfoHeader'
