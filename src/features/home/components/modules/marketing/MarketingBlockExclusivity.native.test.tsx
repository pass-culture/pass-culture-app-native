import mockdate from 'mockdate'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { offersFixture } from 'shared/offer/offer.fixture'
import { render, screen, userEvent } from 'tests/utils'

import { MarketingBlockExclusivity } from './MarketingBlockExclusivity'

const today = 1736853946 //'2025-01-14T16:05:46+02:00'
const tomorrow = 1736940346 //'2025-01-15T16:05:46+02:00'
const yesterday = 1736767546 //'2025-01-13T16:05:46+02:00'

const props = {
  moduleId: '1',
  offer: offersFixture[0],
}

const propsWithPublicationDateTomorrow = {
  moduleId: '1',
  offer: {
    ...offersFixture[0],
    offer: { ...offersFixture[0].offer, bookingAllowedDatetime: tomorrow },
  },
}

jest.mock('libs/subcategories/useSubcategory')
const mockSubcategories = PLACEHOLDER_DATA.subcategories
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      subcategories: mockSubcategories,
    },
  }),
}))

const user = userEvent.setup()
jest.useFakeTimers()

describe('MarketingBlockExclusivity', () => {
  beforeEach(() => {
    mockdate.set(new Date(today * 1000))
    setFeatureFlags()
  })

  it('navigate to offer when pressing', async () => {
    render(<MarketingBlockExclusivity {...props} />)

    const titlelink = screen.getByText('La nuit des temps')
    await user.press(titlelink)

    expect(navigate).toHaveBeenNthCalledWith(1, 'Offer', { id: '102280' })
  })

  it('should log consult offer when pressed', async () => {
    render(<MarketingBlockExclusivity {...props} homeEntryId="fakeEntryId" />)

    const titlelink = screen.getByText('La nuit des temps')
    await user.press(titlelink)

    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      from: 'home',
      moduleId: '1',
      homeEntryId: 'fakeEntryId',
      moduleName: 'La nuit des temps',
      offerId: '102280',
      isHeadline: false,
    })
  })

  describe('bookingAllowedDatetime is after today', () => {
    it('should display a text with date when shouldDisplayPublicationDate is true', async () => {
      render(
        <MarketingBlockExclusivity
          {...propsWithPublicationDateTomorrow}
          shouldDisplayBookingAllowedDatetime
        />
      )
      await screen.findByText('La nuit des temps')

      expect(await screen.findByText('Disponible le 15 janvier')).toBeOnTheScreen()
    })

    it('should display a generic text when shouldDisplayPublicationDate is false', async () => {
      render(
        <MarketingBlockExclusivity
          {...propsWithPublicationDateTomorrow}
          shouldDisplayBookingAllowedDatetime={false}
        />
      )

      await screen.findByText('La nuit des temps')

      expect(screen.getByText('Bientôt disponible')).toBeOnTheScreen()
    })
  })

  describe('bookingAllowedDatetime is today', () => {
    it('should not display bottomBanner with comingSoon information', () => {
      render(
        <MarketingBlockExclusivity
          {...{
            ...props,
            offer: {
              ...offersFixture[0],
              offer: { ...offersFixture[0].offer, bookingAllowedDatetime: today },
            },
          }}
        />
      )

      expect(screen.queryByTestId('bottom-banner')).not.toBeOnTheScreen()
    })
  })

  describe('bookingAllowedDatetime is yesterday', () => {
    it('should not display bottomBanner with comingSoon information', () => {
      render(
        <MarketingBlockExclusivity
          {...{
            ...props,
            offer: {
              ...offersFixture[0],
              offer: { ...offersFixture[0].offer, bookingAllowedDatetime: yesterday },
            },
          }}
        />
      )

      expect(screen.queryByTestId('bottom-banner')).not.toBeOnTheScreen()
    })
  })
})
