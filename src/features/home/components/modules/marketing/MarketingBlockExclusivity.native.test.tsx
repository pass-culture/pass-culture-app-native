import mockdate from 'mockdate'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { offersFixture } from 'shared/offer/offer.fixture'
import { render, screen, userEvent } from 'tests/utils'

import { MarketingBlockExclusivity } from './MarketingBlockExclusivity'

const today = 1736870746 // 14/01/2025 - 17:05:46
const tomorrow = today + 24 * 60 * 60
const yesterday = today - 24 * 60 * 60

const props = {
  moduleId: '1',
  offer: offersFixture[0],
}

const propsWithPublicationDateTomorrow = {
  moduleId: '1',
  offer: { ...offersFixture[0], offer: { ...offersFixture[0].offer, publicationDate: tomorrow } },
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
    mockdate.set(new Date(today))
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
      offerId: 102280,
    })
  })

  describe('publicationDate is after today', () => {
    it('should display a text with date when shouldDisplayPublicationDate is true', async () => {
      render(
        <MarketingBlockExclusivity
          {...propsWithPublicationDateTomorrow}
          shouldDisplayPublicationDate
        />
      )
      await screen.findByText('La nuit des temps')

      expect(await screen.findByText('Disponible le 15 janvier')).toBeOnTheScreen()
    })

    it('should display a generic text when shouldDisplayPublicationDate is false', async () => {
      render(
        <MarketingBlockExclusivity
          {...propsWithPublicationDateTomorrow}
          shouldDisplayPublicationDate={false}
        />
      )

      await screen.findByText('La nuit des temps')

      expect(screen.getByText('Bientôt disponible')).toBeOnTheScreen()
    })
  })

  describe('publicationDate is today', () => {
    it('should not display bottomBanner with comingSoon information', () => {
      render(
        <MarketingBlockExclusivity
          {...{
            ...props,
            offer: {
              ...offersFixture[0],
              offer: { ...offersFixture[0].offer, publicationDate: today },
            },
          }}
        />
      )

      expect(screen.queryByTestId('bottom-banner')).not.toBeOnTheScreen()
    })
  })

  describe('publicationDate is yesterday', () => {
    it('should not display bottomBanner with comingSoon information', () => {
      render(
        <MarketingBlockExclusivity
          {...{
            ...props,
            offer: {
              ...offersFixture[0],
              offer: { ...offersFixture[0].offer, publicationDate: yesterday },
            },
          }}
        />
      )

      expect(screen.queryByTestId('bottom-banner')).not.toBeOnTheScreen()
    })
  })
})
