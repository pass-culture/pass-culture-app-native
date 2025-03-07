import { useMutation } from 'react-query'

import { api } from 'api/api'

export const useNotifyWebappLinkSent = () => {
  return useMutation((offerId: number) => {
    return Promise.all([
      api.postNativeV1SendOfferWebappLinkByEmailofferId(offerId),
      api.postNativeV1SendOfferLinkByPushofferId(offerId),
    ])
  })
}
