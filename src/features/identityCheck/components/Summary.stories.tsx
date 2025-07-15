import { Meta, StoryObj } from '@storybook/react-vite'

import { Summary } from './Summary'

const meta: Meta<typeof Summary> = {
  title: 'Features/IdentityCheck/Summary',
  component: Summary,
}

export default meta

type Story = StoryObj<typeof Summary>

export const Default: Story = {
  args: {
    title: 'Récapitulatif',
    data: [
      { title: 'Nom', value: 'Dupont' },
      { title: 'Prénom', value: 'Jean' },
      { title: 'Date de naissance', value: '01/01/1990' },
      { title: 'Adresse', value: '123 rue de la Paix, 75001 Paris' },
    ],
  },
}

export const WithEmptyValues: Story = {
  args: {
    title: 'Récapitulatif',
    data: [
      { title: 'Nom', value: 'Dupont' },
      { title: 'Prénom', value: 'Jean' },
      { title: 'Date de naissance', value: null },
      { title: 'Adresse', value: undefined },
    ],
  },
}
