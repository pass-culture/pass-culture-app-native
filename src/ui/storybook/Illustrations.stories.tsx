import { StoryFn } from '@storybook/react'
import React from 'react'

import { SearchCategoriesIllustrations } from 'features/search/enums'
import {
  BicolorIllustrations,
  DetailedAchievementIllustrations,
  SimpleAchievementIllustrations,
  UniqueColorIllustrations,
} from 'ui/storybook/illustrationsExports'
import { SVGTemplate as Illustrations } from 'ui/storybook/SVGTemplate'

export default {
  title: 'Fondations/Illustrations',
  parameters: {
    axe: {
      // Disabled this rule because we use SvgIdentifier for all Illustration linearGradient id
      disabledRules: ['duplicate-id'],
    },
  },
}

const illustrationSets = [
  {
    title: 'BicolorIllustrations',
    icons: BicolorIllustrations,
  },
  {
    title: 'UniqueColorIllustrations',
    icons: UniqueColorIllustrations,
  },
  {
    title: 'SearchCategoriesIllustrations',
    icons: SearchCategoriesIllustrations,
  },
  {
    title: 'Simple Achievement Illustrations',
    icons: SimpleAchievementIllustrations,
  },
  {
    title: 'Detailed Achievement Illustrations',
    icons: DetailedAchievementIllustrations,
  },
]

const Template: StoryFn<typeof Illustrations> = () => (
  <React.Fragment>
    {illustrationSets.map((illustration) => (
      <Illustrations
        key={illustration.title}
        title={illustration.title}
        icons={illustration.icons}
        isIllustration
      />
    ))}
  </React.Fragment>
)

export const AllIllustrations = {
  name: 'Illustrations',
  render: Template,
}
