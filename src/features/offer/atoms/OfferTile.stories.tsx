import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { CategoryIdEnum, HomepageLabelNameEnum, SubcategoryIdEnum } from 'api/gen'
import { mockedAlgoliaResponse } from 'libs/algolia/mockedResponses/mockedAlgoliaResponse'
import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'
import { OfferTile } from 'features/offer/atoms/OfferTile'

export default {
  title: 'ui/tiles/OfferTile',
  component: OfferTile,
  argTypes: {
    categoryId: selectArgTypeFromObject(CategoryIdEnum),
    categoryLabel: selectArgTypeFromObject(HomepageLabelNameEnum),
    subcategoryId: selectArgTypeFromObject(SubcategoryIdEnum),
  },
} as ComponentMeta<typeof OfferTile>

const Template: ComponentStory<typeof OfferTile> = (args) => <OfferTile {...args} />

const offer = mockedAlgoliaResponse.hits[0].offer
const offerId = 116656

export const Default = Template.bind({})
Default.args = {
  categoryId: CategoryIdEnum.BEAUX_ARTS,
  categoryLabel: HomepageLabelNameEnum.CARTE_JEUNES,
  subcategoryId: SubcategoryIdEnum.ATELIER_PRATIQUE_ART,
  distance: '1,2km',
  date: 'Dès le 12 mars 2020',
  name: offer.name,
  isDuo: offer.isDuo,
  offerId,
  price: '28 €',
  thumbUrl: offer.thumbUrl,
  moduleName: 'Module Name',
  width: 100,
  height: 100,
}
