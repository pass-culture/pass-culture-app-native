import type { Meta } from '@storybook/react-vite'
import React from 'react'
import styled from 'styled-components/native'

import { theme } from 'theme'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { ExpandingFlatList } from './ExpandingFlatList'

const meta: Meta<typeof ExpandingFlatList> = {
  title: 'features/offer/ExpandingFlatList',
  component: ExpandingFlatList,
  argTypes: {
    isLoading: {
      control: 'boolean',
      defaultValue: false,
    },
    skeletonListLength: {
      control: 'number',
      defaultValue: 3,
    },
  },
}
export default meta

type Item = {
  id: number
  title: string
}

const mockData: Item[] = [
  { id: 1, title: 'Item 1' },
  { id: 2, title: 'Item 2' },
  { id: 3, title: 'Item 3' },
]

const variantConfig: Variants<typeof ExpandingFlatList<Item>> = [
  {
    label: 'Default state',
    props: {
      data: mockData,
      renderItem: () => <StyledItem />,
      renderSkeleton: () => <StyledItem />,
    },
  },
]

export const Template: VariantsStory<typeof ExpandingFlatList> = {
  name: 'ExpandingFlatList',
  render: (args) => (
    <VariantsTemplate
      variants={variantConfig.map((variant) => ({
        ...variant,
        props: { ...variant.props, ...args },
      }))}
      Component={ExpandingFlatList}
    />
  ),
}

const StyledItem = styled.View({
  borderColor: theme.designSystem.color.border.default,
  backgroundColor: theme.designSystem.color.background.subtle,
  borderWidth: 1,
  height: 50,
  width: 200,
})

Template.args = {
  isLoading: false,
  skeletonListLength: 3,
}
