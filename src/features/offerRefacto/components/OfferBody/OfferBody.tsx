import React from 'react'

import { OfferBodyComponentProps } from 'features/offerRefacto/types'

import { OfferBodyView } from './OfferBodyView'
import { useOfferBody } from './useOfferBody'

export const OfferBody = (props: Readonly<OfferBodyComponentProps>) => {
  const { offer, subcategory, searchGroupList, userId } = props
  const viewModel = useOfferBody({ offer, subcategory, searchGroupList, userId })

  return <OfferBodyView viewModel={viewModel} {...props} />
}
