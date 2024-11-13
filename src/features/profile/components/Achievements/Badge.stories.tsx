import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { AchievementId } from 'features/profile/pages/Achievements/AchievementData'
import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'
import { BicolorTrophy, Trophy } from 'ui/svg/icons/Trophy'

import { Badge } from './Badge'

const meta: ComponentMeta<typeof Badge> = {
  title: 'Features/profile/achievements/Badge',
  component: Badge,
}
export default meta

const variantConfig = [
  {
    label: 'Achievement Badge completed',
    props: {
      id: AchievementId.FIRST_MOVIE_BOOKING,
      Illustration: BicolorTrophy,
      isCompleted: true,
    },
  },
  {
    label: 'Achievement Badge not completed',
    props: {
      id: AchievementId.FIRST_MOVIE_BOOKING,
      Illustration: Trophy,
      isCompleted: false,
    },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={Badge} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'Badge'
