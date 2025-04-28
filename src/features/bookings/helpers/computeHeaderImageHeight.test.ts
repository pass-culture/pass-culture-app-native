import { Platform } from 'react-native'

import { TICKET_SEPARATION_HEIGHT } from 'features/bookings/components/TicketCutout/TicketCutout'
import { computeHeaderImageHeight } from 'features/bookings/helpers/computeHeaderImageHeight'
import {
  blurImageHeight,
  offerImageContainerMarginTop,
} from 'features/offer/helpers/useOfferImageContainerDimensions'
import { getSpacing } from 'ui/theme'

describe('computeHeaderImageHeight', () => {
  const params = {
    topBlockHeight: 120,
    appBarHeight: 64,
    safeAreaTop: 20,
    windowHeight: 780,
  }

  const ticketSeparationOffset = TICKET_SEPARATION_HEIGHT / 2
  const webExtraSpacing = getSpacing(offerImageContainerMarginTop)
  const nativeExtraSpacing = params.appBarHeight + params.safeAreaTop
  const expectedScrollHeight = params.windowHeight - blurImageHeight

  it('should compute right height for web', () => {
    Platform.OS = 'web'
    const { headerImageHeight, scrollContentHeight } = computeHeaderImageHeight(params)

    expect(headerImageHeight).toEqual(
      params.topBlockHeight + webExtraSpacing + ticketSeparationOffset
    )
    expect(scrollContentHeight).toEqual(expectedScrollHeight)
  })

  it('should compute right height for native devices', () => {
    Platform.OS = 'ios'
    const { headerImageHeight, scrollContentHeight } = computeHeaderImageHeight(params)

    expect(headerImageHeight).toEqual(
      params.topBlockHeight + nativeExtraSpacing + ticketSeparationOffset
    )
    expect(scrollContentHeight).toEqual(expectedScrollHeight)
  })
})
