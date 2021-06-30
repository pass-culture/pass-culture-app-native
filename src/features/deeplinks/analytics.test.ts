import { renderHook } from '@testing-library/react-hooks'

import { analytics } from 'libs/analytics'

import { useDeeplinkUrlHandler } from './useDeeplinkUrlHandler'
import { DEEPLINK_DOMAIN } from './utils'

jest.mock('features/auth/settings')

describe('useDeeplinkUrlHandler Analytics', () => {
  it('should log an event when we open an offer', () => {
    const {
      result: { current: handleDeeplinkUrl },
    } = renderHook(useDeeplinkUrlHandler)

    const url = DEEPLINK_DOMAIN + 'offer/?id=1234'

    handleDeeplinkUrl({ url })

    expect(analytics.logConsultOffer).toHaveBeenCalledWith({ offerId: 1234, from: 'deeplink' })
  })
})
