import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { EditorialCard } from './EditorialCard'

const meta: Meta<typeof EditorialCard> = {
  title: 'ui/EditorialCard',
  component: EditorialCard,
}
export default meta

const editorialCardInfo = {
  imageURL: 'https://cdn.phototourl.com/free/2026-03-24-5f1a4c71-c6d5-45b2-94b4-2273fe731437.jpg',
  url: 'https://www.google.com/',
  date: '25 mars 2026',
  title: 'Main title',
  subtitle: 'This is a subtitle',
  callToAction: 'Read more',
}

const baseProps = {
  height: 200,
  width: 327,
  isFocus: false,
  editorialCardInfo,
  accessibilityLabel: 'Editorial card link',
}

const variantConfig: Variants<typeof EditorialCard> = [
  {
    label: 'EditorialCard with small screen',
    props: { ...baseProps },
  },
  {
    label: 'EditorialCard with large screen',
    props: { ...baseProps, width: 976 },
  },
  {
    label: 'EditorialCard disabled',
    props: {
      ...baseProps,
      editorialCardInfo: { ...editorialCardInfo, url: undefined, callToAction: undefined },
    },
  },
]

export const Template: VariantsStory<typeof EditorialCard> = {
  name: 'EditorialCard',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={EditorialCard}
      defaultProps={{ ...props }}
    />
  ),
}
