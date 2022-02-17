import { ComponentStory } from '@storybook/react'
import React from 'react'

import { MAP_CATEGORY_ID_TO_ICON } from 'libs/parsers'
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

export const Default: ComponentStory<typeof ImagePlaceholder> = (props) => (
  <ImagePlaceholder {...props} />
)
Default.args = {
  size: getSpacing(24),
  borderRadius: 4,
  Icon: MAP_CATEGORY_ID_TO_ICON.FILM,
}
