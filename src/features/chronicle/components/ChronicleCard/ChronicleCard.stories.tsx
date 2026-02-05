import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { ChronicleCard } from 'features/chronicle/components/ChronicleCard/ChronicleCard'
import { Button } from 'ui/designSystem/Button/Button'
import { VariantsTemplate, type Variants } from 'ui/storybook/VariantsTemplate'
import { BookClubCertification } from 'ui/svg/BookClubCertification'

const meta: Meta<typeof ChronicleCard> = {
  title: 'ui/ChronicleCard',
  component: ChronicleCard,
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
}

const variantConfig: Variants<typeof ChronicleCard> = [
  {
    label: 'ChronicleCard default',
    props: { ...baseProps },
  },
  {
    label: 'ChronicleCard with see more button',
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
]

type Story = StoryObj<typeof ChronicleCard>

export const AllVariants: Story = {
  name: 'ChronicleCard',
  render: (args: React.ComponentProps<typeof ChronicleCard>) => (
    <VariantsTemplate variants={variantConfig} Component={ChronicleCard} defaultProps={args} />
  ),
}
