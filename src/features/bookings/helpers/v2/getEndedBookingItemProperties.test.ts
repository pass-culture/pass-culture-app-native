// eslint-disable-next-line no-restricted-imports
import { NetInfoState, NetInfoStateType } from '@react-native-community/netinfo'

import { CategoryIdEnum } from 'api/gen'
import { bookingsSnapV2 } from 'features/bookings/fixtures'
import { expirationDateUtilsV2 } from 'features/bookings/helpers'
import { getEndedBookingItemProperties } from 'features/bookings/helpers/v2/getEndedBookingItemProperties'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { analytics } from 'libs/analytics/provider'
import { SegmentResult } from 'shared/useABSegment/useABSegment'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'

jest.mock('libs/analytics/provider', () => ({
  analytics: {
    logViewedBookingPage: jest.fn(),
  },
}))

jest.mock('libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog', () => ({
  triggerConsultOfferLog: jest.fn(),
}))

jest.mock('features/bookings/helpers', () => ({
  expirationDateUtilsV2: {
    isArchivableBooking: jest.fn(),
  },
}))

describe('getEndedBookingItemProperties', () => {
  const initialBooking = bookingsSnapV2.endedBookings[0]

  const bookingWithoutCancellation = {
    ...initialBooking,
    cancellationReason: null,
  }

  const mockNetInfo: NetInfoState = {
    isConnected: true,
    type: NetInfoStateType.other,
    isInternetReachable: true,
    details: { ipAddress: '1.1.1.1', subnet: '255.255.255.0', isConnectionExpensive: false },
  }
  const mockPrePopulateOffer = jest.fn()
  const mockShowErrorSnackBar = jest.fn()
  const mockSegment: SegmentResult = 'A'

  const baseArgs = {
    booking: initialBooking,
    categoryId: CategoryIdEnum.CINEMA,
    prePopulateOffer: mockPrePopulateOffer,
    segment: mockSegment,
    showErrorSnackBar: mockShowErrorSnackBar,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return the correct object structure', () => {
    jest.mocked(expirationDateUtilsV2.isArchivableBooking).mockReturnValueOnce(false)

    const properties = getEndedBookingItemProperties({ ...baseArgs, netInfo: mockNetInfo })

    expect(properties).toEqual({
      accessibilityLabel: expect.any(String),
      isBookingEligibleForArchive: expect.any(Boolean),
      handlePressOffer: expect.any(Function),
      navigateTo: expect.objectContaining({
        screen: expect.any(String),
        params: expect.any(Object),
      }),
    })
  })

  describe('When booking is archivable (redirect to BookingDetails)', () => {
    beforeEach(() => {
      jest.mocked(expirationDateUtilsV2.isArchivableBooking).mockReturnValue(true)
    })

    it('should return properties', async () => {
      const properties = getEndedBookingItemProperties({
        ...baseArgs,
        booking: bookingWithoutCancellation,
        netInfo: mockNetInfo,
      })

      expect(properties).toEqual({
        accessibilityLabel: expect.any(String),
        isBookingEligibleForArchive: true,
        handlePressOffer: expect.any(Function),
        navigateTo: {
          screen: 'BookingDetails',
          params: { id: bookingWithoutCancellation.id },
        },
      })
    })

    it('should log analytics on press', async () => {
      const properties = getEndedBookingItemProperties({
        ...baseArgs,
        booking: bookingWithoutCancellation,
        netInfo: mockNetInfo,
      })

      await properties.handlePressOffer()

      expect(analytics.logViewedBookingPage).toHaveBeenCalledWith({
        offerId: initialBooking.stock.offer.id,
        from: 'endedbookings',
      })
    })
  })

  describe('When booking is NOT archivable (redirect to Offer)', () => {
    beforeEach(() => {
      jest.mocked(expirationDateUtilsV2.isArchivableBooking).mockReturnValue(false)
    })

    it('should navigate to Offer', async () => {
      const properties = getEndedBookingItemProperties({
        ...baseArgs,
        netInfo: mockNetInfo,
      })

      expect(properties.navigateTo).toEqual({
        screen: 'Offer',
        params: { id: initialBooking.stock.offer.id, from: 'endedbookings' },
      })
    })

    it('should log analytics and populate cache on press if connected', async () => {
      const properties = getEndedBookingItemProperties({
        ...baseArgs,
        netInfo: mockNetInfo,
      })

      await properties.handlePressOffer()

      expect(mockPrePopulateOffer).toHaveBeenCalledWith(
        expect.objectContaining({
          offerId: initialBooking.stock.offer.id,
          name: initialBooking.stock.offer.name,
        })
      )
      expect(triggerConsultOfferLog).toHaveBeenCalledWith({
        offerId: initialBooking.stock.offer.id,
        from: 'endedbookings',
      })
    })

    it('should show error snackbar on press if disconnected', async () => {
      const netInfo: NetInfoState = {
        isConnected: false,
        type: NetInfoStateType.none,
        isInternetReachable: false,
        details: null,
      }

      const properties = getEndedBookingItemProperties({
        ...baseArgs,
        netInfo,
      })

      await properties.handlePressOffer()

      expect(mockPrePopulateOffer).not.toHaveBeenCalled()
      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
        message: expect.stringContaining('Impossible d’afficher'),
        timeout: SNACK_BAR_TIME_OUT,
      })
    })
  })
})
