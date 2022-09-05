import mockdate from 'mockdate'
import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'

import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import Section from 'features/search/sections'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render } from 'tests/utils'

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

describe('Analytics - logUseFilter', () => {
  beforeEach(() => {
    mockdate.set(Today)
    expect(analytics.logUseFilter).not.toBeCalled()
  })
  it('should log UseFilter for selecting a new Location', () => {
    fireEvent.press(render(<Section.Location />).getByTestId('changeLocation'))
    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Location)
    expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })

  it('should log UseFilter for sliding the radius', () => {
    const { getByTestId } = render(<Section.Radius />)
    const slider = getByTestId('slider').children[0] as ReactTestInstance
    slider.props.onValuesChangeFinish([50])
    slider.props.onValuesChangeFinish([23])
    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Radius)
    expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })

  it('should log UseFilter once when selecting multiple categories', () => {
    const { getByText } = render(<Section.Category />)
    fireEvent.press(getByText('Films, séries, cinéma'))
    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Category)
    fireEvent.press(getByText('Jeux & jeux vidéos'))
    fireEvent.press(getByText('Médias & presse'))
    expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })
  it('should log UseFilter once when selecting multiple offer types', () => {
    const { getByText } = render(<Section.OfferType />)
    fireEvent.press(getByText('Offre numérique'))
    fireEvent.press(getByText('Offre physique'))
    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.OfferType)
    expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })
  it('should log UseFilter once when sliding the price', () => {
    const { getByTestId } = render(<Section.Price />)
    const slider = getByTestId('slider').children[0] as ReactTestInstance
    slider.props.onValuesChangeFinish([20, 300])
    slider.props.onValuesChangeFinish([20, 30])
    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Price)
    expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })

  it('should log UseFilter once when changing free offer', () => {
    const { getByTestId } = render(<Section.FreeOffer />)
    fireEvent.press(getByTestId('Interrupteur'))
    fireEvent.press(getByTestId('Interrupteur'))
    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Free)
    expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })

  it('should log UseFilter once when changing duo offer', () => {
    const { getByTestId } = render(<Section.DuoOffer />)
    fireEvent.press(getByTestId('Interrupteur'))
    fireEvent.press(getByTestId('Interrupteur'))
    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Duo)
    expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })

  it('should log UseFilter once when changing new offer', () => {
    const { getByTestId } = render(<Section.NewOffer />)
    fireEvent.press(getByTestId('Interrupteur'))
    fireEvent.press(getByTestId('Interrupteur'))
    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.New)
    expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })

  it('should log UseFilter once when changing date filter', () => {
    const { getByTestId } = render(<Section.Date />)
    fireEvent.press(getByTestId('Interrupteur'))
    fireEvent.press(getByTestId('Interrupteur'))
    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Date)
    expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })

  it('should log UseFilter once when changing OfferDate filter', () => {
    mockSearchState.date = { option: DATE_FILTER_OPTIONS.TODAY, selectedDate: Today }
    const { getByText } = render(<Section.OfferDate />)
    fireEvent.press(getByText('Cette semaine'))
    fireEvent.press(getByText('Ce week-end'))
    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.OfferDate)
    expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })
  it('should log UseFilter once when changing hour filter', () => {
    const { getByTestId } = render(<Section.Hour />)
    fireEvent.press(getByTestId('Interrupteur'))
    fireEvent.press(getByTestId('Interrupteur'))
    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Hour)
    expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })

  it('should log UseFilter once when sliding the time range', () => {
    const { getByTestId } = render(<Section.TimeSlot />)
    const slider = getByTestId('slider').children[0] as ReactTestInstance
    slider.props.onValuesChangeFinish([8, 21])
    slider.props.onValuesChangeFinish([18, 21])
    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.TimeSlot)
    expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })

  it('should log UseFilter once for each changed filter', () => {
    const { getByTestId } = render(<Section.TimeSlot />)
    const slider = getByTestId('slider').children[0] as ReactTestInstance
    const hourSwitch = render(<Section.Hour />).getByTestId('Interrupteur')

    fireEvent.press(hourSwitch)
    fireEvent.press(hourSwitch)

    slider.props.onValuesChangeFinish([8, 21])
    slider.props.onValuesChangeFinish([18, 21])

    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Hour)
    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.TimeSlot)
    expect(analytics.logUseFilter).toHaveBeenCalledTimes(2)
  })
})
