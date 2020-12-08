import { renderHook } from '@testing-library/react-hooks'

import { logConsultOffer, logConsultOfferFromDeeplink } from 'libs/analytics'

import { useDeeplinkUrlHandler } from './useDeeplinkUrlHandler'
import { DEEPLINK_DOMAIN } from './utils'

describe('useDeeplinkUrlHandler Analytics', () => {
  it('should log an event when we open an offer', () => {
    const {
      result: { current: handleDeeplinkUrl },
    } = renderHook(useDeeplinkUrlHandler)

    const url = DEEPLINK_DOMAIN + 'offer/?id=ABCDE'

    handleDeeplinkUrl({ url })

    expect(logConsultOffer).not.toHaveBeenCalled()
    expect(logConsultOfferFromDeeplink).toHaveBeenCalledWith('ABCDE')
  })
})
