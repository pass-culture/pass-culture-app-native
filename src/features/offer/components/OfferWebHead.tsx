import React from 'react'

import { OfferResponse } from 'api/gen'
import { Helmet } from 'libs/react-helmet/Helmet'

import { description } from '../../../../package.json'

interface Props {
  offer: OfferResponse
}

export const OfferWebHead = ({ offer }: Props) => (
  <Helmet>
    <title>{offer.name + ' | pass Culture'}</title>
    <meta name="title" content={offer.name} />
    <meta name="description" content={offer.description ?? description} />
  </Helmet>
)
