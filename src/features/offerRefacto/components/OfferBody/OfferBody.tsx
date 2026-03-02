import React from 'react'

import { OfferBodyComponentProps } from 'features/offerRefacto/types'

import { OfferBodyView } from './OfferBodyView'
import { useOfferBody } from './useOfferBody'

export const OfferBody = ({
  offer,
  subcategory,
  searchGroupList,
  userId,
  ...rest
}: Readonly<OfferBodyComponentProps>) => {
  const viewModel = useOfferBody({ offer, subcategory, searchGroupList, userId })

  return (
    <OfferBodyView
      viewModel={viewModel}
      offer={offer}
      subcategory={subcategory}
      searchGroupList={searchGroupList}
      userId={userId}
      {...rest}
    />
  )
}
