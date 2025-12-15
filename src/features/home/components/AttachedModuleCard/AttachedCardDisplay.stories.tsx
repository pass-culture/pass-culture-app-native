import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { type ComponentProps } from 'react'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { AttachedCardImage } from 'features/home/components/AttachedModuleCard/AttachedCardImage'
import { VariantsTemplate, type Variants } from 'ui/storybook/VariantsTemplate'
import { ArrowRight } from 'ui/svg/icons/ArrowRight'

import { AttachedCardDisplay } from './AttachedCardDisplay'
const meta: Meta<typeof AttachedCardDisplay> = {
  title: 'ui/AttachedCardDisplay',
  component: AttachedCardDisplay,
}
export default meta

const baseProps: ComponentProps<typeof AttachedCardDisplay> = {
  title: 'La Joconde',
  accessibilityLabel: 'La Joconde - Arts visuels, Du 12/06 au 24/06',
  subtitle: 'Arts visuels',
  details: ['Du 12/06 au 24/06'],
  rightTagLabel: 'Gratuit',
}
const StyledArrowRight = styled(ArrowRight).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))({
  flexShrink: 0,
})

const variantConfig: Variants<typeof AttachedCardDisplay> = [
  {
    label: 'AttachedCardDisplay default',
  },
  {
    label: 'AttachedCardDisplay with image',
    props: {
      LeftImageComponent: AttachedCardImage,
      leftImageProps: {
        imageUrl:
          'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW',
        categoryId: CategoryIdEnum.BEAUX_ARTS,
      },
    },
  },
  {
    label: 'AttachedCardDisplay with multiple details',
    props: {
      details: ['Du 12/06 au 24/06', 'Duo'],
      LeftImageComponent: AttachedCardImage,
      leftImageProps: {
        imageUrl:
          'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW',
        categoryId: CategoryIdEnum.BEAUX_ARTS,
      },
    },
  },
  {
    label: 'AttachedCardDisplay with right element',
    props: {
      bottomRightElement: <StyledArrowRight />,
    },
  },
  {
    label: 'AttachedCardDisplay with coming soon info',
    props: {
      bottomBannerText: 'Disponible le 17 février',
      details: ['Du 12/06 au 24/06', 'Duo'],
      LeftImageComponent: AttachedCardImage,
      leftImageProps: {
        imageUrl:
          'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW',
        categoryId: CategoryIdEnum.BEAUX_ARTS,
      },
    },
  },
]

type Story = StoryObj<typeof AttachedCardDisplay>

export const AllVariants: Story = {
  name: 'AttachedCardDisplay',
  render: (args: ComponentProps<typeof AttachedCardDisplay>) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={AttachedCardDisplay}
      defaultProps={{ ...baseProps, ...args }}
    />
  ),
}
