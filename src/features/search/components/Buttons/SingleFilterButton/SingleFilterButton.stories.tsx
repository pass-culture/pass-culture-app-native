import type { Meta } from '@storybook/react-vite'
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

const GradientBullet = styled(LinearGradient).attrs<{ colors?: string[] }>(({ theme }) => ({
  colors: [
    theme.designSystem.color.background.brandPrimary,
    theme.designSystem.color.background.brandPrimaryHover,
  ],
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

export const Template: VariantsStory<typeof SingleFilterButton> = {
  name: 'SingleFilterButton',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={SingleFilterButton}
      defaultProps={props}
    />
  ),
}
