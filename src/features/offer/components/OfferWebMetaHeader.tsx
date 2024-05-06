import React from 'react'

import { OfferResponseV2 } from 'api/gen'
import { Helmet } from 'libs/react-helmet/Helmet'

import { description } from '../../../../package.json'

interface Props {
  offer: OfferResponseV2
}

export const OfferWebMetaHeader = ({ offer }: Props) => (
  <Helmet>
    <title>{offer.name + ' | pass Culture'}</title>
    <meta name="title" content={offer.name} />
    <meta name="description" content={offer.description ?? description} />
  </Helmet>
)
