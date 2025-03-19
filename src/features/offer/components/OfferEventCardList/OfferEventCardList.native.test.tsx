import React from 'react'

import {
  CategoryIdEnum,
  HomepageLabelNameEnumv2,
  NativeCategoryIdEnumv2,
  OnlineOfflinePlatformChoicesEnum,
  SearchGroupNameEnumv2,
  SubcategoryIdEnum,
} from 'api/gen'
import { useMovieScreeningCalendar } from 'features/offer/components/MovieScreeningCalendar/useMovieScreeningCalendar'
import { useSelectedDateScreening } from 'features/offer/components/MovieScreeningCalendar/useSelectedDateScreenings'
import { useOfferCTAButton } from 'features/offer/components/OfferCTAButton/useOfferCTAButton'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { SubcategoriesMapping } from 'libs/subcategories/types'
import { dateBuilder, mockBuilder } from 'tests/mockBuilder'
import { render, screen } from 'tests/utils'

import { OfferEventCardList } from './OfferEventCardList'

jest.mock('features/offer/components/MovieScreeningCalendar/useMovieScreeningCalendar')
jest.mock('features/offer/components/MovieScreeningCalendar/useSelectedDateScreenings')
jest.mock('features/offer/components/OfferCTAButton/useOfferCTAButton')
jest.mock('libs/subcategories')
jest.mock('libs/firebase/analytics/analytics')

jest.mock('ui/components/eventCard/EventCardList', () => ({
  EventCardList: () => 'EventCardList',
}))

const object = {
  categoryId: CategoryIdEnum.CINEMA,
  appLabel: 'CINEMA',
  homepageLabelName: HomepageLabelNameEnumv2.CINEMA,
  isEvent: false,
  nativeCategoryId: NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
  onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.ONLINE,
  searchGroupName: SearchGroupNameEnumv2.CINEMA,
}

const stockDate = new Date('2024-01-01')

const bookingData = {
  date: stockDate,
  hour: 12,
  stockId: 1,
}

describe('OfferEventCardList', () => {
  const mockUseMovieScreeningCalendar = useMovieScreeningCalendar as jest.MockedFunction<
    typeof useMovieScreeningCalendar
  >
  const mockUseSelectedDateScreening = useSelectedDateScreening as jest.MockedFunction<
    typeof useSelectedDateScreening
  >
  const mockUseOfferCTAButton = useOfferCTAButton as jest.MockedFunction<typeof useOfferCTAButton>
  const mockUseSubcategoriesMapping = useSubcategoriesMapping as jest.MockedFunction<
    typeof useSubcategoriesMapping
  >

  const stock = mockBuilder.offerStockResponse({
    beginningDatetime: dateBuilder().withDay(1).withMonth(0).withYear(2024).toString(),
  })
  const subcategoryId = SubcategoryIdEnum.SEANCE_CINE
  const defaultOffer = mockBuilder.offerResponseV2({
    subcategoryId,
    stocks: [stock],
  })

  beforeEach(() => {
    mockUseMovieScreeningCalendar.mockReturnValue({
      movieScreenings: {},
      movieScreeningDates: [],
      selectedDate: stockDate,
      setSelectedDate: jest.fn(),
      selectedScreeningStock: [stock],
    })

    mockUseSelectedDateScreening.mockReturnValue({
      bookingData,
      selectedDateScreenings: jest.fn().mockReturnValue([{}]),
    })

    mockUseOfferCTAButton.mockReturnValue({
      ctaWordingAndAction: {
        onPress: jest.fn(),
        bottomBannerText: 'CTA',
        externalNav: {
          url: '',
        },
        isDisabled: false,
        wording: 'CTA',
        navigateTo: {
          screen: 'Offer',
        },
      },
      showOfferModal: jest.fn(),
      openModalOnNavigation: false,
      onPress: jest.fn(),
      CTAOfferModal: null,
      movieScreeningUserData: {},
    })
    mockUseSubcategoriesMapping.mockReturnValueOnce({
      [subcategoryId]: object,
    } as SubcategoriesMapping)
  })

  it('should not render EventCardList when eventCardData is not available', () => {
    mockUseSelectedDateScreening.mockReturnValueOnce({
      bookingData,
      selectedDateScreenings: jest.fn().mockReturnValue(null),
    })

    render(<OfferEventCardList offer={defaultOffer} />)

    expect(screen.queryByText('EventCardList')).toBeFalsy()
  })

  it('should use the provided selectedDate', () => {
    const selectedDate = new Date('2024-02-01')
    render(<OfferEventCardList offer={defaultOffer} selectedDate={selectedDate} />)

    expect(mockUseMovieScreeningCalendar).toHaveBeenCalledWith(defaultOffer.stocks, selectedDate)
  })

  it('should use the default date when selectedDate is not provided', () => {
    render(<OfferEventCardList offer={defaultOffer} />)

    expect(mockUseMovieScreeningCalendar).toHaveBeenCalledWith(
      defaultOffer.stocks,
      expect.any(Date)
    )
  })

  it('should pass correct props to useSelectedDateScreening', () => {
    render(<OfferEventCardList offer={defaultOffer} />)

    expect(mockUseSelectedDateScreening).toHaveBeenCalledWith(
      [defaultOffer.stocks[0]],
      defaultOffer.isExternalBookingsDisabled
    )
  })

  it('should pass correct props to useOfferCTAButton', () => {
    render(<OfferEventCardList offer={defaultOffer} />)

    expect(mockUseOfferCTAButton).toHaveBeenCalledWith(defaultOffer, object, bookingData)
  })
})
