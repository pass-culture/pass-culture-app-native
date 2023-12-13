import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { HitOfferWithArtistAndEan } from 'features/offer/components/OfferPlaylist/api/fetchOffersByArtist'
import { OfferPlaylist } from 'features/offer/components/OfferPlaylist/component/OfferPlaylist'
import { PlaylistType } from 'features/offer/enums'
import {
  mockedAlgoliaOffersWithSameArtistResponse,
  moreHitsForSimilarOffersPlaylist,
} from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { getDisplayPrice } from 'libs/parsers'
import { Offer } from 'shared/offer/types'

const meta: ComponentMeta<typeof OfferPlaylist> = {
  title: 'features/offer/OfferPlaylist',
  component: OfferPlaylist,
}
export default meta

const Template: ComponentStory<typeof OfferPlaylist> = (props) => <OfferPlaylist {...props} />

const renderItem = (props: {
  item: Offer | HitOfferWithArtistAndEan
  width: number
  height: number
  playlistType?: PlaylistType
}) => (
  <StyledOfferTile>
    <StyledImage
      source={{
        uri: 'https://img.freepik.com/photos-gratuite/produit-beaute-explosant-couleurs-vibrantes-ia-generatrice-poudre_188544-9687.jpg?size=626&ext=jpg&ga=GA1.1.953763522.1701356022',
      }}
      accessibilityLabel={props.item.offer.name}
    />
    <StyledOfferName>{props.item.offer.name}</StyledOfferName>
    <StyledOfferPrice>{getDisplayPrice(props.item.offer.prices)}</StyledOfferPrice>
  </StyledOfferTile>
)

export const SameArtistPlaylist = Template.bind({})
SameArtistPlaylist.args = {
  items: mockedAlgoliaOffersWithSameArtistResponse,
  title: 'Du même auteur',
  renderItem,
  itemHeight: 250,
  itemWidth: 200,
  playlistType: PlaylistType.SAME_ARTIST_PLAYLIST,
}

export const SimilarOfferPlaylist = Template.bind({})
SimilarOfferPlaylist.args = {
  items: moreHitsForSimilarOffersPlaylist,
  title: 'Ça peut aussi te plaire',
  renderItem,
  itemHeight: 250,
  itemWidth: 200,
  playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
}

const StyledOfferTile = styled.View({
  padding: '5px',
  margin: '5px',
  borderRadius: '5px',
  width: '200px',
})

const StyledImage = styled.Image({
  width: '100%',
  height: '200px',
  marginBottom: '10px',
  borderRadius: '8px',
})

const StyledOfferName = styled.Text({
  fontSize: '12px',
  fontWeight: 'bold',
})

const StyledOfferPrice = styled.Text({
  fontSize: '14px',
  color: '#6e6f74',
})
