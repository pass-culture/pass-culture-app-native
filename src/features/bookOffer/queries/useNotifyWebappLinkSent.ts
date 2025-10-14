import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'

export const useNotifyWebappLinkSent = () =>
  useMutation({
    mutationFn: (offerId: number) => {
      return Promise.all([
        api.postNativeV1SendOfferWebappLinkByEmailofferId(offerId),
        api.postNativeV1SendOfferLinkByPushofferId(offerId),
      ])
    },
  })
