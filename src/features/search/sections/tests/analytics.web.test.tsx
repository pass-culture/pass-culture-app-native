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
    jest.clearAllMocks()
    mockdate.set(Today)
    expect(analytics.logUseFilter).not.toBeCalled()
  })
  it('should log UseFilter for selecting a new Location', () => {
    fireEvent.click(render(<Section.Location />).getByTestId('changeLocation'))
    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Location)
    expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })
  // FIXME: Web Integration
  it.skip('should log UseFilter for sliding the radius [Web Integration]', () => {
    // const { getByTestId } = render(<Section.Radius />)
    // const slider = getByTestId('slider').children[0] as ReactTestInstance
    // slider.props.onValuesChangeFinish([50])
    // slider.props.onValuesChangeFinish([23])
    // expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Radius)
    // expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })
  // FIXME: Web Integration
  it.skip('should log UseFilter once when selecting multiple categories [Web Integration]', () => {
    // const { getByText } = render(<Section.Category />)
    // fireEvent.click(getByText(CATEGORY_CRITERIA.CINEMA.label))
    // expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Category)
    // fireEvent.click(getByText(CATEGORY_CRITERIA.JEUX_VIDEO.label))
    // fireEvent.click(getByText(CATEGORY_CRITERIA.clickE.label))
    // expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })
  it('should log UseFilter once when selecting multiple offer types', () => {
    const { getByText } = render(<Section.OfferType />)
    fireEvent.click(getByText('Offre numérique'))
    fireEvent.click(getByText('Offre physique'))
    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.OfferType)
    expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })
  // FIXME: Web Integration
  it.skip('should log UseFilter once when sliding the price [Web Integration]', () => {
    // const { getByTestId } = render(<Section.Price />)
    // const slider = getByTestId('slider').children[0] as ReactTestInstance
    // slider.props.onValuesChangeFinish([20, 300])
    // slider.props.onValuesChangeFinish([20, 30])
    // expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Price)
    // expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })

  it('should log UseFilter once when changing free offer', () => {
    const { getByTestId } = render(<Section.FreeOffer />)
    fireEvent.click(getByTestId('Interrupteur Uniquement les offres gratuites'))
    fireEvent.click(getByTestId('Interrupteur Uniquement les offres gratuites'))
    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Free)
    expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })

  it('should log UseFilter once when changing duo offer', () => {
    const { getByTestId } = render(<Section.DuoOffer />)
    fireEvent.click(getByTestId('Interrupteur Uniquement les offres duo'))
    fireEvent.click(getByTestId('Interrupteur Uniquement les offres duo'))
    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Duo)
    expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })

  it('should log UseFilter once when changing new offer', () => {
    const { getByTestId } = render(<Section.NewOffer />)
    fireEvent.click(getByTestId('Interrupteur Uniquement les nouveautés'))
    fireEvent.click(getByTestId('Interrupteur Uniquement les nouveautés'))
    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.New)
    expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })

  it('should log UseFilter once when changing date filter', () => {
    const { getByTestId } = render(<Section.Date />)
    fireEvent.click(getByTestId('Interrupteur Date'))
    fireEvent.click(getByTestId('Interrupteur Date'))
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
    fireEvent.click(getByTestId('Interrupteur Heure'))
    fireEvent.click(getByTestId('Interrupteur Heure'))
    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Hour)
    expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })

  // FIXME: Web Integration
  it.skip('should log UseFilter once when sliding the time range [Web Integration]', () => {
    // const { getByTestId } = render(<Section.TimeSlot />)
    // const slider = getByTestId('slider').children[0] as ReactTestInstance
    // slider.props.onValuesChangeFinish([8, 21])
    // slider.props.onValuesChangeFinish([18, 21])
    // expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.TimeSlot)
    // expect(analytics.logUseFilter).toHaveBeenCalledTimes(1)
  })

  // FIXME: Web Integration
  it.skip('should log UseFilter once for each changed filter [Web Integration]', () => {
    // const { getByTestId } = render(<Section.TimeSlot />)
    // const slider = getByTestId('slider').children[0] as ReactTestInstance
    // const hourSwitch = render(<Section.Hour />).getByTestId('Interrupteur Heure')
    //
    // fireEvent.click(hourSwitch)
    // fireEvent.click(hourSwitch)
    //
    // slider.props.onValuesChangeFinish([8, 21])
    // slider.props.onValuesChangeFinish([18, 21])
    //
    // expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Hour)
    // expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.TimeSlot)
    // expect(analytics.logUseFilter).toHaveBeenCalledTimes(2)
  })
})
