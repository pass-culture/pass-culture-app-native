import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { buildCategoryIllustrationUrl } from 'shared/illustrations/buildCategoryIllustrationUrl'
import { theme } from 'theme'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { EditorialCard } from './EditorialCard'

const meta: Meta<typeof EditorialCard> = {
  title: 'ui/EditorialCard',
  component: EditorialCard,
}
export default meta

const editorialCardInfo = {
  imageURL: buildCategoryIllustrationUrl('benevolat.png'),
  imageBackgroundColor: theme.designSystem.color.illustration.positive02,
  url: 'https://www.jeveuxaider.gouv.fr/',
  title: 'Deviens bénévole pour\n“On cherche des bénévoles”',
  subtitle: 'Donne de ton temps pour la culture\u00a0!',
  callToAction: 'Voir les missions sur jeveuxaider.gouv',
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
