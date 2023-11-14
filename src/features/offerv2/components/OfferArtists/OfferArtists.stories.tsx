import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { OfferArtists } from 'features/offerv2/components/OfferArtists/OfferArtists'
import { getOfferArtists } from 'features/offerv2/helpers/getOfferArtists/getOfferArtists'

const meta: ComponentMeta<typeof OfferArtists> = {
  title: 'features/offer/OfferArtists',
  component: OfferArtists,
}
export default meta

const Template: ComponentStory<typeof OfferArtists> = (props) => <OfferArtists {...props} />

export const WithOneArtist = Template.bind({})
WithOneArtist.args = {
  artists: 'Martin Scorsese',
}

export const WithSeveralArtist = Template.bind({})
WithSeveralArtist.args = {
  artists:
    'Martin Scorsese, Eric Roth, Leonardo DiCaprio, Lily Gladstone, Robert De Niro, Jesse Plemons, John Lithgow, Brendan Fraser, Tatanka Means, ' +
    'William Belleau, Scott Sheperd, Louis Cancelmi, Jason Isbell, Sturgill Simpson, Tantoo Cardinal, Cara Jade Myers, Janae Collins, Jillian Dion, ' +
    'Michael Abbott Jr, Pat Healy, Evereth Waller, Yancey Red Corn',
}

export const WithAuthorForABook = Template.bind({})
WithAuthorForABook.args = {
  artists: getOfferArtists(CategoryIdEnum.LIVRE, {
    ...offerResponseSnap,
    extraData: { author: 'JK Rowling' },
  }),
}

export const WithPerformerForMusicRecording = Template.bind({})
WithPerformerForMusicRecording.args = {
  artists: getOfferArtists(CategoryIdEnum.MUSIQUE_ENREGISTREE, {
    ...offerResponseSnap,
    extraData: { performer: 'Edith Piaf' },
  }),
}

export const WithPerformerForLiveMusic = Template.bind({})
WithPerformerForLiveMusic.args = {
  artists: getOfferArtists(CategoryIdEnum.MUSIQUE_LIVE, {
    ...offerResponseSnap,
    extraData: { performer: 'Jul' },
  }),
}

export const WithStageDirectorForShow = Template.bind({})
WithStageDirectorForShow.args = {
  artists: getOfferArtists(CategoryIdEnum.SPECTACLE, {
    ...offerResponseSnap,
    extraData: { stageDirector: 'Thierry Suc' },
  }),
}

export const WithDirectorForCinema = Template.bind({})
WithDirectorForCinema.args = {
  artists: getOfferArtists(CategoryIdEnum.CINEMA, {
    ...offerResponseSnap,
    extraData: { stageDirector: 'Thierry Suc' },
  }),
}
