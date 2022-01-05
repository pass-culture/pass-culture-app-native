import { useMutation } from 'react-query'

import { api } from 'api/api'

export const useNotifyWebappLinkSent = () => {
  return useMutation((offerId: number) => {
    return Promise.all([
      api.postnativev1sendOfferWebappLinkByEmailofferId(offerId),
      api.postnativev1sendOfferLinkByPushofferId(offerId),
    ])
  })
}
