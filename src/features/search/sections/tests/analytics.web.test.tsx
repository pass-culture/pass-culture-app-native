import mockdate from 'mockdate'
import React from 'react'

import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import Section from 'features/search/sections'
import { analytics } from 'libs/analytics'
import { fireEvent, render } from 'tests/utils/web'

import { SectionTitle } from '../titles'

const Today = new Date(2020, 10, 1)
const mockSearchState = initialSearchState
const mockStagedDispatch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useStagedSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockStagedDispatch,
  }),
}))

jest.mock('features/search/components', () => ({
  CalendarPicker: ({ visible }: { visible: boolean }) =>
    visible ? 'CalendarPicker' : 'NoCalendar',
}))

describe('Analytics - logUseFilter', () => {
  beforeEach(() => {
    mockdate.set(Today)
    expect(analytics.logUseFilter).not.toBeCalled()
  })
  it('should log UseFilter for selecting a new Location', () => {
    fireEvent.click(render(<Section.Location />).getByTestId('changeLocation'))
    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Location)
    expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })
  it('should log UseFilter once when selecting multiple offer types', () => {
    const { getByText } = render(<Section.OfferType />)
    fireEvent.click(getByText('Offre numérique'))
    fireEvent.click(getByText('Offre physique'))
    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.OfferType)
    expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })

  it('should log UseFilter once when changing free offer', () => {
    const { getByTestId } = render(<Section.FreeOffer />)
    fireEvent.click(getByTestId('Interrupteur filtre offres gratuites'))
    fireEvent.click(getByTestId('Interrupteur filtre offres gratuites'))
    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Free)
    expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })

  it('should log UseFilter once when changing duo offer', () => {
    const { getByTestId } = render(<Section.DuoOffer />)
    fireEvent.click(getByTestId('Interrupteur filtre offres duo'))
    fireEvent.click(getByTestId('Interrupteur filtre offres duo'))
    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Duo)
    expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })

  it('should log UseFilter once when changing new offer', () => {
    const { getByTestId } = render(<Section.NewOffer />)
    fireEvent.click(getByTestId('Interrupteur filtre nouvelles offres'))
    fireEvent.click(getByTestId('Interrupteur filtre nouvelles offres'))
    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.New)
    expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })

  it('should log UseFilter once when changing date filter', () => {
    const { getByTestId } = render(<Section.Date />)
    fireEvent.click(getByTestId('Interrupteur filtre dates'))
    fireEvent.click(getByTestId('Interrupteur filtre dates'))
    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Date)
    expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })

  it('should log UseFilter once when changing OfferDate filter', () => {
    mockSearchState.date = { option: DATE_FILTER_OPTIONS.TODAY, selectedDate: Today }
    const { getByText } = render(<Section.OfferDate />)
    fireEvent.click(getByText('Cette semaine'))
    fireEvent.click(getByText('Ce week-end'))
    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.OfferDate)
    expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })
  it('should log UseFilter once when changing hour filter', () => {
    const { getByTestId } = render(<Section.Hour />)
    fireEvent.click(getByTestId('Interrupteur filtre heures'))
    fireEvent.click(getByTestId('Interrupteur filtre heures'))
    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Hour)
    expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })
})
