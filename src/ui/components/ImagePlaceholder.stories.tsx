import { StoryFn } from '@storybook/react'
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

export const Default: StoryFn<typeof ImagePlaceholder> = (props) => <ImagePlaceholder {...props} />
Default.args = {
  size: getSpacing(24),
  borderRadius: 4,
  Icon: mapCategoryToIcon(CategoryIdEnum.FILM),
}
