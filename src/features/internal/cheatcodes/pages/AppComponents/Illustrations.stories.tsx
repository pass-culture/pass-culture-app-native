import { ComponentStory } from '@storybook/react'
import React, { ComponentProps } from 'react'

import { IconsContainer as Illustrations } from 'features/internal/cheatcodes/pages/AppComponents/IconsContainer'
import {
  BicolorIllustrations,
  DetailedAchievementIllustrations,
  SimpleAchievementIllustrations,
  UniqueColorIllustrations,
} from 'features/internal/cheatcodes/pages/AppComponents/illustrationsExports'
import { SearchCategoriesIllustrations } from 'features/search/enums'

export default {
  title: 'Fondations/Illustrations',
  parameters: {
    axe: {
      // Disabled this rule because we use SvgIdentifier for all Illustration linearGradient id
      disabledRules: ['duplicate-id'],
    },
  },
}

const illustrationSets: ComponentProps<typeof Illustrations>[] = [
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

const Template: ComponentStory<typeof Illustrations> = () => (
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

export const AllIllustrations = Template.bind({})
AllIllustrations.storyName = 'Illustrations'
