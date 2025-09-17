import type { Meta } from '@storybook/react-vite'
import React from 'react'
import styled from 'styled-components/native'

import { TagVariant } from 'ui/designSystem/Tag/types'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { ArrowRight } from 'ui/svg/icons/ArrowRight'
import { CheckFilled } from 'ui/svg/icons/CheckFilled'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { CloseFilled } from 'ui/svg/icons/CloseFilled'
import { Star } from 'ui/svg/Star'

import { Tag } from './Tag'

const meta: Meta<typeof Tag> = {
  title: 'design system/Tag',
  component: Tag,
}
export default meta

const StyledArrowRight = styled(ArrowRight).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

const StyledClose = styled(CloseFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

const StyledCheck = styled(CheckFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

const StyledWait = styled(ClockFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

const variantConfig: Variants<typeof Tag> = [
  {
    label: 'Default',
    props: { label: 'Tag default', variant: TagVariant.DEFAULT },
  },
  {
    label: 'With Icon component',
    props: { label: 'Flèche', Icon: StyledArrowRight },
  },
  {
    label: 'With JSX icon',
    props: { label: 'Étoile', Icon: <Star size={16} /> },
  },
  {
    label: 'Success',
    props: { label: 'Tag success', variant: TagVariant.SUCCESS },
  },
  {
    label: 'Success with icon',
    props: { label: 'Validé', variant: TagVariant.SUCCESS, Icon: StyledCheck },
  },
  {
    label: 'Warning',
    props: { label: 'Tag warning', variant: TagVariant.WARNING },
  },
  {
    label: 'Warning with icon',
    props: { label: 'À venir', variant: TagVariant.WARNING, Icon: StyledWait },
  },
  {
    label: 'Error',
    props: { label: 'Erreur', variant: TagVariant.ERROR },
  },
  {
    label: 'Error with icon',
    props: { label: 'Erreur', variant: TagVariant.ERROR, Icon: StyledClose },
  },
  {
    label: 'Bookclub',
    props: { label: 'Book Club', variant: TagVariant.BOOKCLUB },
  },
  {
    label: 'Cineclub',
    props: { label: 'Ciné Club', variant: TagVariant.CINECLUB },
  },
  {
    label: 'Headline',
    props: { label: 'À la une', variant: TagVariant.HEADLINE },
  },
  {
    label: 'Like',
    props: { label: 'Aimé', variant: TagVariant.LIKE },
  },
  {
    label: 'New',
    props: { label: 'Nouveau', variant: TagVariant.NEW },
  },
]

export const Template: VariantsStory<typeof Tag> = {
  name: 'Tag',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={Tag} defaultProps={{ ...props }} />
  ),
}
