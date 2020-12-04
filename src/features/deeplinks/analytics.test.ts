import { renderHook } from '@testing-library/react-hooks'

import { navigate } from '__mocks__/@react-navigation/native'
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

    expect(navigate).toHaveBeenCalledWith('Offer', { id: 'ABCDE' })
    expect(logConsultOffer).not.toHaveBeenCalled()
    expect(logConsultOfferFromDeeplink).toHaveBeenCalledWith('ABCDE')
  })
})
