import React from 'react'

import { OfferResponse } from 'api/gen'
import { Helmet } from 'libs/react-helmet/Helmet'
import { openGraphMetas } from 'libs/react-helmet/metas/openGraphMetas'
import { twitterMetas } from 'libs/react-helmet/metas/twitterMetas'

import { description } from '../../../../../package.json'

interface Props {
  offer: OfferResponse
}

export const OfferWebHead = ({ offer }: Props) => (
  <Helmet>
    <title>{offer.name}</title>
    <meta name="title" content={offer.name} />
    <meta name="description" content={offer.description || description} />
    {twitterMetas({
      description: offer.description || description,
      summary: offer.description || description,
      title: offer.name,
      image: offer.image?.url,
    })}
    {openGraphMetas({
      locale: 'fr-FR',
      description: offer.description || description,
      title: offer.name,
      image: offer.image?.url,
      type: 'article',
      ...(offer.category.name ? { ['article:section']: offer.category.name } : {}),
    })}
  </Helmet>
)
