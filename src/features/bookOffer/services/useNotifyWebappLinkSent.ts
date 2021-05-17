import { isNil } from 'lodash'
import { useMutation } from 'react-query'

import { api } from 'api/api'

interface NotifyWebappLinkSentInterface {
  offerId?: number | undefined
}

export const useNotifyWebappLinkSent = ({ offerId }: NotifyWebappLinkSentInterface) => {
  return useMutation(async () => {
    if (isNil(offerId)) return
    const callSendWebappLinkByEmail = api.postnativev1sendOfferWebappLinkByEmailofferId(offerId)
    const callSendWebappLinkByPushNotif = api.postnativev1sendOfferLinkByPushofferId(offerId)
    return Promise.all([await callSendWebappLinkByEmail, await callSendWebappLinkByPushNotif])
  })
}
