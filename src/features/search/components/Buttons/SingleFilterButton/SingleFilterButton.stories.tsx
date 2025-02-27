import { Meta } from '@storybook/react'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { SingleFilterButton } from './SingleFilterButton'

const meta: Meta<typeof SingleFilterButton> = {
  title: 'Features/search/SingleFilterButton',
  component: SingleFilterButton,
}
export default meta

const GradientBullet = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [theme.colors.primary, theme.colors.primaryDark],
}))({
  width: 10,
  height: 10,
  borderRadius: 5,
})

const variantConfig: Variants<typeof SingleFilterButton> = [
  {
    label: 'SingleFilterButton selected',
    props: { label: 'CD, vinyles, musique en ligne', isSelected: true },
  },
  {
    label: 'SingleFilterButton selected with custom icon',
    props: {
      label: 'CD, vinyles, musique en ligne',
      isSelected: true,
      icon: <GradientBullet />,
    },
  },
  {
    label: 'SingleFilterButton not selected',
    props: {
      label: 'CD, vinyles, musique en ligne',
      isSelected: false,
    },
  },
]

const Template: VariantsStory<typeof SingleFilterButton> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={SingleFilterButton} defaultProps={args} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'SingleFilterButton'
