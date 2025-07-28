import React from 'react'
import { ThemeProvider } from 'styled-components'

import { CategoryIdEnum, NativeCategoryIdEnumv2, SubcategoryIdEnum } from 'api/gen'
import * as MovieCalendarContext from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { NEXT_SCREENING_WORDING } from 'features/offer/components/MoviesScreeningCalendar/NextScreeningButton'
import { useOfferCTAButton } from 'features/offer/components/OfferCTAButton/useOfferCTAButton'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { computedTheme } from 'tests/computedTheme'
import { mockBuilder } from 'tests/mockBuilder'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'
import { theme } from 'theme'

import { CineBlock, CineBlockProps } from './CineBlock'

jest.mock('features/offer/components/MoviesScreeningCalendar/MovieCalendarContext', () => ({
  useMovieCalendar: jest.fn(),
}))

jest.mock('features/offer/components/OfferCTAButton/useOfferCTAButton')

jest.mock('libs/firebase/analytics/analytics')

const mockUseSubcategoriesMapping = jest.fn()
jest.mock('libs/subcategories/mappings', () => ({
  useSubcategoriesMapping: jest.fn(() => mockUseSubcategoriesMapping()),
}))

const mockUseOfferCTAButton = useOfferCTAButton as jest.MockedFunction<typeof useOfferCTAButton>

const mockOfferTitle = 'CINEMA DE LA RUE'
const mockOfferVenue = mockBuilder.offerVenueResponse({
  name: mockOfferTitle,
})
const mockOffer = mockBuilder.offerResponseV2({
  venue: mockOfferVenue,
})

const mockSelectedDate = new Date('2023-05-01')
const mockGoToDate = jest.fn()
const mockDisplayCalendar = jest.fn()

const mockOnPressOfferCTA = jest.fn()

const user = userEvent.setup()
jest.useFakeTimers()

describe('CineBlock', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
    jest.spyOn(MovieCalendarContext, 'useMovieCalendar').mockReturnValue({
      selectedDate: mockSelectedDate,
      goToDate: mockGoToDate,
      displayCalendar: mockDisplayCalendar,
      dates: [],
      disableDates: jest.fn(),
      displayDates: jest.fn(),
    })

    mockUseSubcategoriesMapping.mockReturnValue({
      [SubcategoryIdEnum.SEANCE_CINE]: {
        isEvent: false,
        categoryId: CategoryIdEnum.CINEMA,
        nativeCategoryId: NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
      },
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
      onPress: mockOnPressOfferCTA,
      CTAOfferModal: null,
      movieScreeningUserData: {},
      onPressSecondary: jest.fn(),
      secondaryCtaWordingAndAction: undefined,
      secondaryCTAOfferModal: null,
      secondaryShowOfferModal: jest.fn(),
    })
  })

  it('should render VenueBlock', () => {
    renderCineBlock({ offer: mockOffer })

    expect(screen.getByText(mockOfferTitle)).toBeOnTheScreen()
  })

  it('should render NextScreeningButton when nextDate is provided', async () => {
    const nextDate = new Date('2023-05-02')
    renderCineBlock({ nextDate })

    expect(await screen.findByText(NEXT_SCREENING_WORDING)).toBeOnTheScreen()
  })

  it('should render OfferEventCardList when nextDate is not provided', () => {
    renderCineBlock({})

    expect(screen.getByTestId('offer-event-card-list')).toBeOnTheScreen()
  })

  it('should call onSeeVenuePress when provided', async () => {
    const mockOnSeeVenuePress = jest.fn()
    renderCineBlock({ onSeeVenuePress: mockOnSeeVenuePress })
    const seeVenueButton = screen.getByText(mockOfferTitle)

    await user.press(seeVenueButton)

    expect(mockOnSeeVenuePress).toHaveBeenCalledTimes(1)
  })

  it('should call goToDate when NextScreeningButton is pressed and there is no screenings within the next 15 days', async () => {
    const nextDate = new Date('2023-05-02')
    renderCineBlock({ nextDate })
    const nextScreeningButton = await screen.findByText(NEXT_SCREENING_WORDING)

    await user.press(nextScreeningButton)

    expect(mockGoToDate).toHaveBeenCalledWith(nextDate)
  })

  it('should call onPressOfferCTA when NextScreeningButton is pressed and next screening is after 15 days', async () => {
    const currentDate = new Date()

    const nextDate = new Date(currentDate.setDate(currentDate.getDate() + 20))

    renderCineBlock({ nextDate })

    const nextScreeningButton = await screen.findByText(NEXT_SCREENING_WORDING)

    await user.press(nextScreeningButton)

    expect(mockOnPressOfferCTA).toHaveBeenCalledWith()
  })

  it('should not display Divider if withDivider is false', () => {
    renderCineBlock({ withDivider: false })

    expect(screen.queryByTestId('divider')).not.toBeOnTheScreen()
  })

  it('should display Divider with mobile style', async () => {
    renderCineBlock({ withDivider: true })

    expect(screen.getByTestId('divider')).toHaveStyle({ marginHorizontal: 24 })
  })

  it('should display Divider with desktop style', async () => {
    renderCineBlock({ withDivider: true }, true)

    expect(screen.getByTestId('divider')).toHaveStyle({ marginTop: 16 })
  })
})

const renderCineBlock = (props: Partial<CineBlockProps>, isDesktopViewport?: boolean) => {
  return render(<CineBlock {...props} offer={mockOffer} />, {
    wrapper: ({ children }) =>
      reactQueryProviderHOC(
        <ThemeProvider theme={{ ...theme, ...computedTheme, isDesktopViewport }}>
          {children}
        </ThemeProvider>
      ),
  })
}
