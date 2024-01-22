import { action } from '@storybook/addon-actions'
import { ComponentStory } from '@storybook/react'
import React, { useState } from 'react'

import { VenueSelectionList } from './VenueSelectionList'

export default {
  title: 'features/offer/VenueSelectionList',
  component: VenueSelectionList,
  args: {
    refreshing: false,
    onRefresh: action('refresh'),
  },
}

const DynamicTemplate: ComponentStory<typeof VenueSelectionList> = (props) => {
  const [selectedItem, setSelectedItem] = useState<number>()

  return (
    <VenueSelectionList
      {...props}
      subTitle="Sélectionner un lieu"
      selectedItem={selectedItem}
      onItemSelect={setSelectedItem}
      headerMessage='Lieux à proximité de "undefined"'
    />
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
    },
    {
      title: 'Le Livre Éclaire',
      address: '75013 Paris, 56 rue de Tolbiac',
      distance: '1,5 km',
      offerId: 2,
    },
    {
      title: 'Hachette Livre',
      address: '94200 Ivry-sur-Seine, Rue Charles du Colomb',
      distance: '2,4 km',
      offerId: 3,
    },
  ],
}
