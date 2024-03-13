import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { VenueMapPreview } from './VenueMapPreview'

const meta: ComponentMeta<typeof VenueMapPreview> = {
  title: 'features/search/VenueMapPreview',
  component: VenueMapPreview,
}
export default meta

const Template: ComponentStory<typeof VenueMapPreview> = (props) => <VenueMapPreview {...props} />
export const Default = Template.bind({})
Default.args = {
  venueName: 'Cinéma La Chapelle',
  address: '4 rue de la Chapelle, 75018 Paris',
  bannerUrl:
    'https://www.gamewallpapers.com/wallpapers_slechte_compressie/wallpaper_magic_the_gathering_arena_01_1920x1080.jpg',
  tags: ['à 500m', 'Cinéma'],
}
