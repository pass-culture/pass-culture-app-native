import React from 'react'

import { OfferResponse, SubcategoryIdEnum } from 'api/gen'
import { BookingState, initialBookingState, Step } from 'features/bookOffer/context/reducer'
import { mockDigitalOffer, mockOffer } from 'features/bookOffer/fixtures/offer'
import * as BookingOfferAPI from 'features/bookOffer/helpers/useBookingOffer'
import { useBookingStock } from 'features/bookOffer/helpers/useBookingStock'
import { IBookingContext } from 'features/bookOffer/types'
import { VenueListItem } from 'features/offer/components/VenueSelectionList/VenueSelectionList'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { offerStockResponseSnap } from 'features/offer/fixtures/offerStockResponse'
import * as UnderageUserAPI from 'features/profile/helpers/useIsUserUnderage'
import * as logOfferConversionAPI from 'libs/algolia/analytics/logOfferConversion'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, act } from 'tests/utils'
import * as useModalAPI from 'ui/components/modals/useModal'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { BookingDetails, BookingDetailsProps } from './BookingDetails'

const mockDismissModal = jest.fn()
const mockDispatch = jest.fn()

const mockInitialBookingState = initialBookingState

let mockBookingStock = {
  price: 2000,
  id: 148409,
  beginningDatetime: '2021-03-02T20:00:00',
} as ReturnType<typeof useBookingStock>

const mockOfferId = 1337
const mockUseBookingContext: jest.Mock<IBookingContext> = jest.fn()
mockUseBookingContext.mockReturnValue({
  bookingState: { quantity: 1, offerId: mockOfferId } as BookingState,
  dismissModal: mockDismissModal,
  dispatch: mockDispatch,
})
jest.mock('features/bookOffer/context/useBookingContext', () => ({
  useBookingContext: () => mockUseBookingContext(),
}))

jest.mock('features/bookOffer/helpers/useBookingStock', () => ({
  useBookingStock: jest.fn(() => mockBookingStock),
}))
jest.mock('features/bookOffer/helpers/useBookingOffer', () => ({
  useBookingOffer: jest.fn(),
}))
const mockUseBookingOffer = jest.spyOn(BookingOfferAPI, 'useBookingOffer')
mockUseBookingOffer.mockReturnValue({ ...mockOffer, isDuo: false })

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
  SNACK_BAR_TIME_OUT: 5000,
}))

const mockStocks = mockOffer.stocks
const mockDigitalStocks = mockDigitalOffer.stocks

jest.mock('features/profile/helpers/useIsUserUnderage')
const mockedUseIsUserUnderage = jest.spyOn(UnderageUserAPI, 'useIsUserUnderage')

const mockUseSubcategoriesMapping = jest.fn()
jest.mock('libs/subcategories', () => ({
  useSubcategoriesMapping: jest.fn(() => mockUseSubcategoriesMapping()),
}))
mockUseSubcategoriesMapping.mockReturnValue({
  EVENEMENT_PATRIMOINE: { isEvent: true },
})

const spyLogOfferConversion = jest.fn()
jest
  .spyOn(logOfferConversionAPI, 'useLogOfferConversion')
  .mockReturnValue({ logOfferConversion: spyLogOfferConversion })

const mockOnPressBookOffer = jest.fn()

const offerVenues = [
  {
    title: 'Envie de lire',
    address: '94200 Ivry-sur-Seine, 16 rue Gabriel Peri',
    distance: '500 m',
    offerId: 1,
    price: 1000,
  },
  {
    title: 'Le Livre Éclaire',
    address: '75013 Paris, 56 rue de Tolbiac',
    distance: '1,5 km',
    offerId: 2,
    price: 1000,
  },
  {
    title: 'Hachette Livre',
    address: '94200 Ivry-sur-Seine, Rue Charles du Colomb',
    distance: '2,4 km',
    offerId: 3,
    price: 1000,
  },
]
const mockHasNextPage = true
const mockFetchNextPage = jest.fn()
const mockData = {
  pages: [
    {
      nbHits: 0,
      hits: [],
      page: 0,
    },
  ],
}
let mockVenueList: VenueListItem[] = []
let mockNbVenueItems = 0
jest.mock('api/useSearchVenuesOffer/useSearchVenueOffers', () => ({
  useSearchVenueOffers: () => ({
    hasNextPage: mockHasNextPage,
    fetchNextPage: mockFetchNextPage,
    data: mockData,
    venueList: mockVenueList,
    nbVenueItems: mockNbVenueItems,
    isFetching: false,
  }),
}))

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

describe('<BookingDetails />', () => {
  beforeAll(() => {
    mockVenueList = []
    mockNbVenueItems = 0
  })

  afterEach(() => {
    mockVenueList = []
    mockNbVenueItems = 0
  })

  describe('with initial state', () => {
    beforeEach(() => {
      mockUseBookingContext.mockReturnValueOnce({
        bookingState: mockInitialBookingState,
        dismissModal: mockDismissModal,
        dispatch: mockDispatch,
      })
      mockServer.get<OfferResponse>(`/native/v1/offer/${mockOfferId}`, offerResponseSnap)
    })

    it('should initialize correctly state when offer isDigital', async () => {
      mockBookingStock = undefined

      renderBookingDetails({ stocks: mockDigitalStocks, onPressBookOffer: mockOnPressBookOffer })
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'SELECT_STOCK', payload: 148401 })
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'SELECT_QUANTITY', payload: 1 })
    })

    it('should initialize the state when offer isDigital only with first bookable stocks', async () => {
      mockBookingStock = undefined
      const mockStocks = [{ ...offerStockResponseSnap, isBookable: false, id: 123456 }]
      renderBookingDetails({ stocks: mockStocks, onPressBookOffer: mockOnPressBookOffer })
      expect(mockDispatch).not.toHaveBeenCalled()

      const mockOthersStocks = [
        { ...offerStockResponseSnap, isBookable: false, id: 123456 },
        { ...offerStockResponseSnap, isBookable: true, id: 1234567 },
        { ...offerStockResponseSnap, isBookable: true, id: 12345678 },
      ]
      renderBookingDetails({ stocks: mockOthersStocks, onPressBookOffer: mockOnPressBookOffer })
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'SELECT_STOCK', payload: 1234567 })
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'SELECT_QUANTITY', payload: 1 })
      expect(mockDispatch).not.toHaveBeenCalledWith({ type: 'SELECT_STOCK', payload: 12345678 })
    })

    it('should not display the Duo selector when the offer is not duo', () => {
      renderBookingDetails({ stocks: mockDigitalStocks, onPressBookOffer: mockOnPressBookOffer })

      expect(screen.queryByTestId('DuoChoiceSelector')).not.toBeOnTheScreen()
    })
  })

  describe('when user has selected options', () => {
    beforeEach(() => {
      mockUseBookingContext.mockReturnValueOnce({
        bookingState: { quantity: 1, offerId: mockOfferId } as BookingState,
        dismissModal: mockDismissModal,
        dispatch: mockDispatch,
      })
    })

    it('should render correctly when offer is an event', () => {
      mockBookingStock = {
        price: 2000,
        id: 148409,
        beginningDatetime: '2021-03-02T20:00:00',
      } as ReturnType<typeof useBookingStock>

      renderBookingDetails({ stocks: mockStocks, onPressBookOffer: mockOnPressBookOffer })
      expect(screen).toMatchSnapshot()
    })
    it('should render disable CTA when user is underage and stock is forbidden to underage', () => {
      mockBookingStock = {
        price: 2000,
        id: 148409,
        beginningDatetime: '2021-03-02T20:00:00',
        isForbiddenToUnderage: true,
      } as ReturnType<typeof useBookingStock>
      mockedUseIsUserUnderage.mockReturnValueOnce(true)
      renderBookingDetails({ stocks: mockStocks, onPressBookOffer: mockOnPressBookOffer })
      expect(screen).toMatchSnapshot()
    })

    it('should run validation booking when pressing "Confirmer la réservation" button', () => {
      renderBookingDetails({
        stocks: mockStocks,
        onPressBookOffer: mockOnPressBookOffer,
      })
      const ConfirmButton = screen.getByText('Confirmer la réservation')
      fireEvent.press(ConfirmButton)
      expect(mockOnPressBookOffer).toHaveBeenCalledTimes(1)
    })

    it('should not display the loading screen when booking validation is not in progress', () => {
      renderBookingDetails({
        stocks: mockStocks,
        onPressBookOffer: mockOnPressBookOffer,
      })

      expect(screen.queryByTestId('loadingScreen')).not.toBeOnTheScreen()
    })

    it('should display the loading screen when booking validation is in progress', () => {
      renderBookingDetails({
        stocks: mockStocks,
        isLoading: true,
        onPressBookOffer: mockOnPressBookOffer,
      })

      expect(screen.getByTestId('loadingScreen')).toBeOnTheScreen()
    })
  })

  it('should change step to confirmation when step is date and offer is not an event', () => {
    mockUseBookingContext.mockReturnValueOnce({
      bookingState: mockInitialBookingState,
      dismissModal: mockDismissModal,
      dispatch: mockDispatch,
    })
    mockUseBookingOffer.mockReturnValueOnce(mockDigitalOffer)
    renderBookingDetails({ stocks: mockDigitalStocks, onPressBookOffer: mockOnPressBookOffer })
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CHANGE_STEP', payload: Step.CONFIRMATION })
  })

  it('should not change step to confirmation when step is date and offer is an event', async () => {
    mockUseBookingContext.mockReturnValueOnce({
      bookingState: mockInitialBookingState,
      dismissModal: mockDismissModal,
      dispatch: mockDispatch,
    })
    mockUseBookingOffer.mockReturnValueOnce(mockOffer)
    renderBookingDetails({ stocks: mockStocks, onPressBookOffer: mockOnPressBookOffer })
    expect(mockDispatch).not.toHaveBeenCalledWith({
      type: 'CHANGE_STEP',
      payload: Step.CONFIRMATION,
    })
  })

  describe('duo selector', () => {
    beforeEach(() => {
      const duoBookingState: BookingState = {
        ...mockInitialBookingState,
        quantity: 2,
      }
      mockUseBookingContext.mockReturnValueOnce({
        bookingState: duoBookingState,
        dismissModal: mockDismissModal,
        dispatch: mockDispatch,
      })
      mockServer.get<OfferResponse>(`/native/v1/offer/${mockOfferId}`, offerResponseSnap)
    })

    it('should not display the Duo selector when the offer is duo but is an event', () => {
      mockUseBookingOffer.mockReturnValueOnce({ ...mockOffer, isDuo: true })

      mockUseSubcategoriesMapping.mockReturnValueOnce({
        EVENEMENT_PATRIMOINE: { isEvent: true },
      })

      renderBookingDetails({ stocks: mockDigitalStocks, onPressBookOffer: mockOnPressBookOffer })

      expect(screen.queryByTestId('DuoChoiceSelector')).not.toBeOnTheScreen()
    })

    it('should display the Duo selector when the offer is duo and not an event', async () => {
      mockUseBookingOffer.mockReturnValueOnce({ ...mockOffer, isDuo: true })

      mockUseSubcategoriesMapping.mockReturnValueOnce({
        EVENEMENT_PATRIMOINE: { isEvent: false },
      })

      renderBookingDetails({ stocks: mockDigitalStocks, onPressBookOffer: mockOnPressBookOffer })
      await act(async () => {})

      expect(await screen.findByTestId('DuoChoiceSelector')).toBeOnTheScreen()
    })
  })

  describe('When WIP_ENABLE_MULTIVENUE_OFFER feature flag deactivated', () => {
    beforeEach(() => {
      mockServer.getAPIV1<OfferResponse>(`/native/v1/offer/${mockOfferId}`, offerResponseSnap)
    })
    it('should display venue address in information section', async () => {
      mockUseBookingOffer.mockReturnValueOnce({ ...mockOffer, isDuo: true })

      mockUseSubcategoriesMapping.mockReturnValueOnce({
        EVENEMENT_PATRIMOINE: { isEvent: false },
      })

      renderBookingDetails({ stocks: mockStocks, onPressBookOffer: mockOnPressBookOffer })
      await act(async () => {})

      expect(await screen.findByTestId('address')).toBeOnTheScreen()
    })

    it('should not display venue section', async () => {
      mockUseBookingOffer.mockReturnValueOnce({
        ...mockOffer,
        isDuo: true,
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      })

      mockUseSubcategoriesMapping.mockReturnValueOnce({
        LIVRE_PAPIER: { isEvent: false },
      })

      renderBookingDetails({ stocks: mockStocks, onPressBookOffer: mockOnPressBookOffer })
      await act(async () => {})

      expect(screen.queryByText('Lieu de retrait')).not.toBeOnTheScreen()
    })

    it('should not display venue name in venue section', async () => {
      mockUseBookingOffer.mockReturnValueOnce({
        ...mockOffer,
        isDuo: true,
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      })

      mockUseSubcategoriesMapping.mockReturnValueOnce({
        LIVRE_PAPIER: { isEvent: false },
      })

      renderBookingDetails({ stocks: mockStocks, onPressBookOffer: mockOnPressBookOffer })
      await act(async () => {})

      expect(screen.queryByTestId('venueName')).not.toBeOnTheScreen()
    })

    it('should not display venue address in venue section', async () => {
      mockUseBookingOffer.mockReturnValueOnce({
        ...mockOffer,
        isDuo: true,
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      })

      mockUseSubcategoriesMapping.mockReturnValueOnce({
        LIVRE_PAPIER: { isEvent: false },
      })

      renderBookingDetails({ stocks: mockStocks, onPressBookOffer: mockOnPressBookOffer })
      await act(async () => {})

      expect(screen.queryByTestId('venueAddress')).not.toBeOnTheScreen()
    })

    it('should not display "Modifier" button when offer subcategory is "Livre papier" and EAN defined', async () => {
      mockUseBookingOffer.mockReturnValueOnce({
        ...mockOffer,
        isDuo: true,
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
        extraData: { ean: '12345678' },
      })

      mockUseSubcategoriesMapping.mockReturnValueOnce({
        LIVRE_PAPIER: { isEvent: false },
      })

      renderBookingDetails({ stocks: mockStocks, onPressBookOffer: mockOnPressBookOffer })
      await act(async () => {})

      expect(screen.queryByText('Modifier')).not.toBeOnTheScreen()
    })

    it('should not display "Modifier" button when offer subcategory is "Livre audio physique" and EAN defined', async () => {
      mockUseBookingOffer.mockReturnValueOnce({
        ...mockOffer,
        isDuo: true,
        subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
        extraData: { ean: '12345678' },
      })

      mockUseSubcategoriesMapping.mockReturnValueOnce({
        LIVRE_AUDIO_PHYSIQUE: { isEvent: false },
      })

      renderBookingDetails({ stocks: mockStocks, onPressBookOffer: mockOnPressBookOffer })
      await act(async () => {})

      expect(screen.queryByText('Modifier')).not.toBeOnTheScreen()
    })

    it('should not display "Modifier" button when offer subcategory is "Livre papier" and EAN not defined', async () => {
      mockUseBookingOffer.mockReturnValueOnce({
        ...mockOffer,
        isDuo: true,
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      })

      mockUseSubcategoriesMapping.mockReturnValueOnce({
        LIVRE_PAPIER: { isEvent: false },
      })

      renderBookingDetails({ stocks: mockStocks, onPressBookOffer: mockOnPressBookOffer })
      await act(async () => {})

      expect(screen.queryByText('Modifier')).not.toBeOnTheScreen()
    })

    it('should not display "Modifier" button when offer subcategory is "Livre audio physique" and EAN not defined', async () => {
      mockUseBookingOffer.mockReturnValueOnce({
        ...mockOffer,
        isDuo: true,
        subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
      })

      mockUseSubcategoriesMapping.mockReturnValueOnce({
        LIVRE_AUDIO_PHYSIQUE: { isEvent: false },
      })

      renderBookingDetails({ stocks: mockStocks, onPressBookOffer: mockOnPressBookOffer })
      await act(async () => {})

      expect(screen.queryByText('Modifier')).not.toBeOnTheScreen()
    })
  })

  describe('When WIP_ENABLE_MULTIVENUE_OFFER feature flag activated', () => {
    beforeEach(() => {
      jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValueOnce(true)
      mockServer.get<OfferResponse>(`/native/v1/offer/${mockOfferId}`, offerResponseSnap)
    })

    it('should not display venue address in information section', async () => {
      mockUseBookingOffer.mockReturnValueOnce({ ...mockOffer, isDuo: true })

      mockUseSubcategoriesMapping.mockReturnValueOnce({
        EVENEMENT_PATRIMOINE: { isEvent: false },
      })

      renderBookingDetails({ stocks: mockStocks, onPressBookOffer: mockOnPressBookOffer })
      await act(async () => {})

      expect(screen.queryByTestId('address')).not.toBeOnTheScreen()
    })

    it('should display venue section', async () => {
      mockUseBookingOffer.mockReturnValueOnce({
        ...mockOffer,
        isDuo: true,
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      })

      mockUseSubcategoriesMapping.mockReturnValueOnce({
        LIVRE_PAPIER: { isEvent: false },
      })

      renderBookingDetails({ stocks: mockStocks, onPressBookOffer: mockOnPressBookOffer })
      await act(async () => {})

      expect(await screen.findByText('Lieu de retrait')).toBeOnTheScreen()
    })

    it('should display venue name in venue section', async () => {
      mockUseBookingOffer.mockReturnValueOnce({
        ...mockOffer,
        isDuo: true,
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      })

      mockUseSubcategoriesMapping.mockReturnValueOnce({
        LIVRE_PAPIER: { isEvent: false },
      })

      renderBookingDetails({ stocks: mockStocks, onPressBookOffer: mockOnPressBookOffer })
      await act(async () => {})

      expect(await screen.findByTestId('venueName')).toBeOnTheScreen()
    })

    it('should display venue address in venue section', async () => {
      mockUseBookingOffer.mockReturnValueOnce({
        ...mockOffer,
        isDuo: true,
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      })

      mockUseSubcategoriesMapping.mockReturnValueOnce({
        LIVRE_PAPIER: { isEvent: false },
      })

      renderBookingDetails({ stocks: mockStocks, onPressBookOffer: mockOnPressBookOffer })
      await act(async () => {})

      expect(await screen.findByTestId('venueAddress')).toBeOnTheScreen()
    })

    it('should display "Modifier" button when offer subcategory is "Livre papier", EAN defined and that there are other venues offering the same offer', async () => {
      mockUseBookingOffer.mockReturnValueOnce({
        ...mockOffer,
        isDuo: true,
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
        extraData: { ean: '12345678' },
      })

      mockUseSubcategoriesMapping.mockReturnValueOnce({
        LIVRE_PAPIER: { isEvent: false },
      })
      mockNbVenueItems = 2
      mockVenueList = offerVenues

      renderBookingDetails({ stocks: mockStocks, onPressBookOffer: mockOnPressBookOffer })
      await act(async () => {})

      expect(await screen.findByText('Modifier')).toBeOnTheScreen()
    })

    it('should not display "Modifier" button when offer subcategory is "Livre papier", EAN defined and that there are not other venues offering the same offer', async () => {
      mockUseBookingOffer.mockReturnValueOnce({
        ...mockOffer,
        isDuo: true,
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
        extraData: { ean: '12345678' },
      })

      mockUseSubcategoriesMapping.mockReturnValueOnce({
        LIVRE_PAPIER: { isEvent: false },
      })
      mockNbVenueItems = 0
      mockVenueList = []

      renderBookingDetails({ stocks: mockStocks, onPressBookOffer: mockOnPressBookOffer })
      await act(async () => {})

      expect(screen.queryByText('Modifier')).not.toBeOnTheScreen()
    })

    it('should display "Modifier" button when offer subcategory is "Livre audio physique", EAN defined and that there are other venues offering the same offer', async () => {
      mockUseBookingOffer.mockReturnValueOnce({
        ...mockOffer,
        isDuo: true,
        subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
        extraData: { ean: '12345678' },
      })

      mockUseSubcategoriesMapping.mockReturnValueOnce({
        LIVRE_AUDIO_PHYSIQUE: { isEvent: false },
      })
      mockNbVenueItems = 2
      mockVenueList = offerVenues

      renderBookingDetails({ stocks: mockStocks, onPressBookOffer: mockOnPressBookOffer })
      await act(async () => {})

      expect(await screen.findByText('Modifier')).toBeOnTheScreen()
    })

    it('should not display "Modifier" button when offer subcategory is "Livre audio physique", EAN defined and that there are not other venues offering the same offer', async () => {
      mockUseBookingOffer.mockReturnValueOnce({
        ...mockOffer,
        isDuo: true,
        subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
        extraData: { ean: '12345678' },
      })

      mockUseSubcategoriesMapping.mockReturnValueOnce({
        LIVRE_AUDIO_PHYSIQUE: { isEvent: false },
      })
      mockNbVenueItems = 0
      mockVenueList = []

      renderBookingDetails({ stocks: mockStocks, onPressBookOffer: mockOnPressBookOffer })
      await act(async () => {})

      expect(screen.queryByText('Modifier')).not.toBeOnTheScreen()
    })

    it('should not display "Modifier" button when offer subcategory is "Livre papier" and EAN not defined', async () => {
      mockUseBookingOffer.mockReturnValueOnce({
        ...mockOffer,
        isDuo: true,
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      })

      mockUseSubcategoriesMapping.mockReturnValueOnce({
        LIVRE_PAPIER: { isEvent: false },
      })

      renderBookingDetails({ stocks: mockStocks, onPressBookOffer: mockOnPressBookOffer })
      await act(async () => {})

      expect(screen.queryByText('Modifier')).not.toBeOnTheScreen()
    })

    it('should not display "Modifier" button when offer subcategory is "Livre audio physique" and EAN not defined', async () => {
      mockUseBookingOffer.mockReturnValueOnce({
        ...mockOffer,
        isDuo: true,
        subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
      })

      mockUseSubcategoriesMapping.mockReturnValueOnce({
        LIVRE_AUDIO_PHYSIQUE: { isEvent: false },
      })

      renderBookingDetails({ stocks: mockStocks, onPressBookOffer: mockOnPressBookOffer })
      await act(async () => {})

      expect(screen.queryByText('Modifier')).not.toBeOnTheScreen()
    })

    it('should open venue selection modal when pressing "Modifier" button', async () => {
      const mockShowModal = jest.fn()
      jest.spyOn(useModalAPI, 'useModal').mockReturnValueOnce({
        visible: false,
        showModal: mockShowModal,
        hideModal: jest.fn(),
        toggleModal: jest.fn(),
      })
      mockUseBookingOffer.mockReturnValueOnce({
        ...mockOffer,
        isDuo: true,
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
        extraData: { ean: '12345678' },
      })

      mockUseSubcategoriesMapping.mockReturnValueOnce({
        LIVRE_PAPIER: { isEvent: false },
      })
      mockNbVenueItems = 2
      mockVenueList = offerVenues

      renderBookingDetails({ stocks: mockStocks, onPressBookOffer: mockOnPressBookOffer })

      await act(async () => {
        fireEvent.press(await screen.findByText('Modifier'))
      })

      expect(mockShowModal).toHaveBeenCalledTimes(1)
    })

    it('should update the booking offer when the user choose an other venue', async () => {
      const mockShowModal = jest.fn()
      jest.spyOn(useModalAPI, 'useModal').mockReturnValueOnce({
        visible: true,
        showModal: mockShowModal,
        hideModal: jest.fn(),
        toggleModal: jest.fn(),
      })
      mockUseBookingOffer.mockReturnValueOnce({
        ...mockOffer,
        isDuo: true,
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
        extraData: { ean: '12345678' },
      })

      mockUseSubcategoriesMapping.mockReturnValueOnce({
        LIVRE_PAPIER: { isEvent: false },
      })
      mockNbVenueItems = 2
      mockVenueList = offerVenues

      renderBookingDetails({ stocks: mockStocks, onPressBookOffer: mockOnPressBookOffer })

      await act(async () => {
        fireEvent.press(screen.getByText('Le Livre Éclaire'))
      })

      await act(async () => {
        fireEvent.press(screen.getByText('Choisir ce lieu'))
      })

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'CHANGE_OFFER', payload: 2 })
    })
  })
})

function renderBookingDetails({
  stocks,
  isLoading = false,
  onPressBookOffer,
}: BookingDetailsProps) {
  return render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <BookingDetails stocks={stocks} isLoading={isLoading} onPressBookOffer={onPressBookOffer} />
    )
  )
}
