import type { Meta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { All } from 'ui/svg/icons/venueAndCategories/All'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
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

const LocationIcon = styled(LocationPointer).attrs(({ theme }) => ({
  size: theme.icons.sizes.standard,
  color: theme.colors.greyMedium,
}))``

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
  {
    label: 'InfoHeader without title and with subtitle',
    props: {
      ...baseProps,
      title: undefined,
    },
  },
  {
    label: 'InfoHeader with custom icon placeholder',
    props: {
      ...baseProps,
      placeholderIcon: <LocationIcon />,
    },
  },
]

export const Template: VariantsStory<typeof InfoHeader> = {
  name: 'InfoHeader',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={InfoHeader} defaultProps={props} />
  ),
}
