import mockdate from 'mockdate'
import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'

import { OfferType } from 'features/search/enums'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
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

  it('should log UseFilter once when changing duo offer', () => {
    const { getByTestId } = render(<Section.DuoOffer />)
    fireEvent.press(getByTestId('Interrupteur'))
    fireEvent.press(getByTestId('Interrupteur'))
    expect(analytics.logUseFilter).toHaveBeenNthCalledWith(1, SectionTitle.Duo)
  })

  it('should log UseFilter once when changing new offer', () => {
    const { getByTestId } = render(<Section.NewOffer />)
    fireEvent.press(getByTestId('Interrupteur'))
    fireEvent.press(getByTestId('Interrupteur'))
    expect(analytics.logUseFilter).toHaveBeenNthCalledWith(1, SectionTitle.New)
  })

  it('should log UseFilter once when changing date filter', () => {
    const { getByTestId } = render(<Section.Date />)
    fireEvent.press(getByTestId('Interrupteur'))
    fireEvent.press(getByTestId('Interrupteur'))
    expect(analytics.logUseFilter).toHaveBeenNthCalledWith(1, SectionTitle.Date)
  })

  it('should log UseFilter once when changing OfferDate filter', () => {
    mockSearchState.date = { option: DATE_FILTER_OPTIONS.TODAY, selectedDate: Today }
    const { getByText } = render(<Section.OfferDate />)
    fireEvent.press(getByText('Cette semaine'))
    fireEvent.press(getByText('Ce week-end'))
    expect(analytics.logUseFilter).toHaveBeenNthCalledWith(1, SectionTitle.OfferDate)
  })

  it('should log UseFilter once when changing hour filter', () => {
    const { getByTestId } = render(<Section.Hour />)
    fireEvent.press(getByTestId('Interrupteur'))
    fireEvent.press(getByTestId('Interrupteur'))
    expect(analytics.logUseFilter).toHaveBeenNthCalledWith(1, SectionTitle.Hour)
  })

  it('should log UseFilter once when sliding the time range', () => {
    const { getByTestId } = render(<Section.TimeSlot />)
    const slider = getByTestId('slider').children[0] as ReactTestInstance
    slider.props.onValuesChangeFinish([8, 21])
    slider.props.onValuesChangeFinish([18, 21])
    expect(analytics.logUseFilter).toHaveBeenNthCalledWith(1, SectionTitle.TimeSlot)
  })

  it('should log UseFilter once for each changed filter', () => {
    const { getByTestId } = render(<Section.TimeSlot />)
    const slider = getByTestId('slider').children[0] as ReactTestInstance
    const hourSwitch = render(<Section.Hour />).getByTestId('Interrupteur')

    fireEvent.press(hourSwitch)
    fireEvent.press(hourSwitch)

    slider.props.onValuesChangeFinish([8, 21])
    slider.props.onValuesChangeFinish([18, 21])

    expect(analytics.logUseFilter).toHaveBeenNthCalledWith(1, SectionTitle.Hour)
    expect(analytics.logUseFilter).toHaveBeenNthCalledWith(2, SectionTitle.TimeSlot)
  })
})
