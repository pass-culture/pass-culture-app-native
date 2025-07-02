import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { ChronicleCard } from 'features/chronicle/components/ChronicleCard/ChronicleCard'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
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
    'Pour moi, cette biographie n’est pas comme une autre. Cela concerne le créateur de Star Wars, le premier film...',
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
      children: (
        <View>
          <ButtonTertiaryBlack wording="Voir plus" />
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
