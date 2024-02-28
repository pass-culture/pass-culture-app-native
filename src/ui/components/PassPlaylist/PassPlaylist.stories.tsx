import { NavigationContainer } from '@react-navigation/native'
import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { HitOfferWithArtistAndEan } from 'features/offer/components/OfferPlaylistOld/api/fetchOffersByArtist'
import { OfferTile } from 'features/offer/components/OfferTile/OfferTile'
import { PlaylistType } from 'features/offer/enums'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { getDisplayPrice } from 'libs/parsers'
import { Offer } from 'shared/offer/types'
import { PassPlaylist } from 'ui/components/PassPlaylist/PassPlaylist'

const meta: ComponentMeta<typeof PassPlaylist> = {
  title: 'ui/PassPlaylist',
  component: PassPlaylist,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const Template: ComponentStory<typeof PassPlaylist> = (props) => <PassPlaylist {...props} />

const renderItem = ({
  width,
  height,
  item,
}: {
  item: Offer | HitOfferWithArtistAndEan
  width: number
  height: number
  playlistType?: PlaylistType
}) => (
  <OfferTile
    thumbUrl="https://image-resizing.testing.passculture.team/?size=654&filename=passculture-metier-ehp-staging-assets-fine-grained/thumbs/mediations/BN7RW"
    categoryId={CategoryIdEnum.LIVRE}
    categoryLabel="Livre"
    subcategoryId={item.offer.subcategoryId}
    offerId={Number(item.objectID)}
    price={getDisplayPrice(item.offer.prices)}
    analyticsFrom="search"
    width={width}
    height={height}
    handlePressOffer={action('handlePressOffer')}
    name={item.offer.name}
  />
)

export const Default = Template.bind({})
Default.storyName = 'PassPlaylist'
Default.args = {
  data: mockedAlgoliaOffersWithSameArtistResponse,
  title: 'Du même auteur',
  renderItem,
  itemHeight: 250,
  itemWidth: 200,
  playlistType: PlaylistType.SAME_ARTIST_PLAYLIST,
}
