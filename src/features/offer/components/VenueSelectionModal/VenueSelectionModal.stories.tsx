import { NavigationContainer } from '@react-navigation/native'
import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { VenueSelectionModal } from './VenueSelectionModal'

export default {
  title: 'features/offer/VenueSelectionModal',
  component: VenueSelectionModal,
  args: {
    isVisible: true,
    title: 'Lieu de retrait',
    onSubmit: action('selected'),
    onClosePress: action('close modal'),
    onRefresh: undefined,
  },
  argTypes: {
    onSubmit: { control: { disable: true } },
    onClosePress: { control: { disable: true } },
    items: { control: { disable: true } },
    selectedItem: { control: { disable: true } },
  },
} as ComponentMeta<typeof VenueSelectionModal>

const DynamicTemplate: ComponentStory<typeof VenueSelectionModal> = (props) => {
  return (
    <NavigationContainer>
      <VenueSelectionModal {...props} />
    </NavigationContainer>
  )
}

export const Default = DynamicTemplate.bind({})
Default.args = {
  items: [
    {
      title: 'Envie de lire',
      address: '94200 Ivry-sur-Seine, 16 rue Gabriel Peri',
      distance: '500 m',
      offerId: 1,
      price: 1000,
    },
    {
      title: 'Le Livre Éclaire',
      address: '75013 Paris, 56 rue de Tolbiac',
      distance: '1,5 km',
      offerId: 2,
      price: 1000,
    },
    {
      title: 'Hachette Livre',
      address: '94200 Ivry-sur-Seine, Rue Charles du Colomb',
      distance: '2,4 km',
      offerId: 3,
      price: 1000,
    },
  ],
}
