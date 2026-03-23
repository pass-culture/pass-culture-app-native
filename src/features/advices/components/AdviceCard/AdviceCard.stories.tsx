import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { AdviceCard } from 'features/advices/components/AdviceCard/AdviceCard'
import { Button } from 'ui/designSystem/Button/Button'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagVariant } from 'ui/designSystem/Tag/types'
import { VariantsTemplate, type Variants } from 'ui/storybook/VariantsTemplate'
import { BookClubCertification } from 'ui/svg/BookClubCertification'

const meta: Meta<typeof AdviceCard> = {
  title: 'ui/AdviceCard',
  component: AdviceCard,
}
export default meta

const BookClubIcon = styled(BookClubCertification).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.bookclub,
}))``

const baseProps = {
  id: 1,
  title: 'Olivier, 15 ans',
  subtitle: 'Membre du book club',
  description:
    'Pour moi, cette biographie n’est pas comme une autre. Cela concerne le créateur de Star Wars, le premier film de la saga qui a marqué des générations entières.',
  date: 'Juin 2024',
  icon: <BookClubIcon />,
  tag: <Tag variant={TagVariant.BOOKCLUB} label="Membre du book club" />,
}

const variantConfig: Variants<typeof AdviceCard> = [
  {
    label: 'AdviceCard default',
    props: { ...baseProps },
  },
  {
    label: 'AdviceCard with see more button',
    props: {
      ...baseProps,
      description:
        'Pour moi, cette biographie n’est pas comme une autre. Cela concerne le créateur de Star Wars, le premier film de la saga qui a marqué des générations entières. J’ai appris tellement de choses sur sa vie, ses inspirations, et les défis qu’il a dû surmonter pour réaliser son rêve. C’est une lecture captivante qui m’a vraiment inspiré à poursuivre mes propres passions, peu importe les obstacles que je pourrais rencontrer en cours de route. Je recommande vivement ce livre à tous ceux qui aiment le cinéma et les histoires de réussite personnelle.',
      shouldTruncate: true,
      children: (
        <View>
          <Button wording="Voir plus" variant="tertiary" color="neutral" />
        </View>
      ),
    },
  },
  {
    label: 'AdviceCard with navigable header',
    props: { ...baseProps, headerNavigateTo: { screen: 'Login' } },
  },
]

type Story = StoryObj<typeof AdviceCard>

export const AllVariants: Story = {
  name: 'AdviceCard',
  render: (args: React.ComponentProps<typeof AdviceCard>) => (
    <VariantsTemplate variants={variantConfig} Component={AdviceCard} defaultProps={args} />
  ),
}
