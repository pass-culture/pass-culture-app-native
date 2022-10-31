import mockdate from 'mockdate'
import React from 'react'

import { OfferType } from 'features/search/enums'
import { RadioButtonLocation } from 'features/search/pages/LocationModal'
import { initialSearchState } from 'features/search/pages/reducer'
import Section from 'features/search/sections'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, act } from 'tests/utils'

import { SectionTitle } from '../titles'

const Today = new Date(2020, 10, 1)
const mockSearchState = initialSearchState
const mockStagedDispatch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useStagedSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockStagedDispatch,
  }),
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockStagedDispatch,
  }),
}))

jest.mock('features/search/components', () => ({
  CalendarPicker: ({ visible }: { visible: boolean }) =>
    visible ? 'CalendarPicker' : 'NoCalendar',
}))

jest.mock('features/profile/api', () => ({
  useUserProfileInfo: jest.fn(() => ({ data: { firstName: 'Christophe', lastName: 'Dupont' } })),
}))

jest.mock('ui/components/modals/useModal', () => ({
  useModal: () => jest.requireActual('ui/components/modals/useModal').useModal(true),
}))

describe('Analytics - logUseFilter', () => {
  beforeEach(() => {
    mockdate.set(Today)
    expect(analytics.logUseFilter).not.toBeCalled()
  })

  it('should log UseFilter for selecting a new Location', async () => {
    const { getByText } = render(<Section.Location />)
    await act(async () => {
      fireEvent.press(getByText(RadioButtonLocation.AROUND_ME))
    })
    expect(analytics.logUseFilter).toHaveBeenNthCalledWith(1, SectionTitle.Location)
  })

  it('should log UseFilter once when selecting multiple offer types', () => {
    const { getByText } = render(<Section.OfferType />)
    fireEvent.press(getByText(OfferType.DIGITAL))
    fireEvent.press(getByText(OfferType.THING))
    expect(analytics.logUseFilter).toHaveBeenNthCalledWith(1, SectionTitle.OfferType)
  })

  it('should log UseFilter once when changing new offer', () => {
    const { getByTestId } = render(<Section.NewOffer />)
    fireEvent.press(getByTestId('Interrupteur'))
    fireEvent.press(getByTestId('Interrupteur'))
    expect(analytics.logUseFilter).toHaveBeenNthCalledWith(1, SectionTitle.New)
  })
})
