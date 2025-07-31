import type { StoryObj } from '@storybook/react-vite'
import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { mapCategoryToIcon } from 'libs/parsers/category'
import { getSpacing } from 'ui/theme'

import { ImagePlaceholder } from './ImagePlaceholder'

export default {
  title: 'ui/ImagePlaceholder',
  argTypes: {
    Icon: {
      control: false,
    },
  },
}

type Story = StoryObj<typeof ImagePlaceholder>

export const Default: Story = {
  name: 'ImagePlaceholder',
  render: () => (
    <ImagePlaceholder size={getSpacing(24)} Icon={mapCategoryToIcon(CategoryIdEnum.FILM)} />
  ),
}
