import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate } from '__mocks__/@react-navigation/native'
import { useAuthContext } from 'features/auth/AuthContext'
import { OFFER_TYPES } from 'features/search/components/sections/OfferType/OfferType'
import { initialSearchState } from 'features/search/context/reducer'
import { OfferType } from 'features/search/enums'
import { SectionTitle } from 'features/search/helpers/titles'
import { OfferTypeModal } from 'features/search/pages/modals/OfferTypeModal/OfferTypeModal'
import { OfferTypes, SearchView } from 'features/search/types'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, act } from 'tests/utils'

const searchId = uuidv4()
const searchState = { ...initialSearchState, searchId }
const mockSearchState = searchState

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
  }),
}))

jest.mock('features/auth/AuthContext')
const mockUser = { ...beneficiaryUser, domainsCredit: { all: { initial: 8000, remaining: 7000 } } }
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

mockUseAuthContext.mockReturnValue({
  isLoggedIn: true,
  setIsLoggedIn: jest.fn(),
  user: mockUser,
  refetchUser: jest.fn(),
  isUserLoading: false,
})

const hideOfferTypeModal = jest.fn()

describe('<OfferTypeModal/>', () => {
  describe('modal header', () => {
    it('should have header when viewport width is mobile', () => {
      const isDesktopViewport = false
      const renderAPI = renderOfferTypeModal(
        {
          hideOfferTypeModal,
          offerTypeModalVisible: true,
        },
        isDesktopViewport
      )

      const header = renderAPI.queryByTestId('pageHeader')
      expect(header).toBeTruthy()
    })

    it('should not have header when viewport width is desktop', () => {
      const isDesktopViewport = true
      const renderAPI = renderOfferTypeModal(
        {
          hideOfferTypeModal,
          offerTypeModalVisible: true,
        },
        isDesktopViewport
      )

      const header = renderAPI.queryByTestId('pageHeader')
      expect(header).toBeFalsy()
    })
  })

  describe('select offerType', () => {
    it(`should have default and activate/deactivate 'Tous les types' on press`, () => {
      const renderAPI = renderOfferTypeModal({
        hideOfferTypeModal,
        offerTypeModalVisible: true,
      })
      const radioButton = renderAPI.getByTestId(OfferType.ALL_TYPE)
      const digitalRadioButton = renderAPI.getByTestId(OfferType.DIGITAL)
      expect(radioButton.props.accessibilityState).toEqual({ checked: true })

      fireEvent.press(digitalRadioButton)

      expect(radioButton.props.accessibilityState).toEqual({ checked: false })

      fireEvent.press(radioButton)

      expect(radioButton.props.accessibilityState).toEqual({ checked: true })
    })

    it.each(
      OFFER_TYPES.filter((item) => item.label !== OfferType.ALL_TYPE).map(({ label }) => label)
    )(`should activate %s on press`, (label) => {
      const renderAPI = renderOfferTypeModal({
        hideOfferTypeModal,
        offerTypeModalVisible: true,
      })

      const radioButton = renderAPI.getByTestId(label)
      expect(radioButton.props.accessibilityState).toEqual({ checked: false })

      fireEvent.press(radioButton)

      expect(radioButton.props.accessibilityState).toEqual({ checked: true })
    })

    it.each(
      OFFER_TYPES.filter((item) => item.label !== OfferType.ALL_TYPE).map(({ label }) => label)
    )(`should log offer type selected on press`, (label) => {
      const renderAPI = renderOfferTypeModal({
        hideOfferTypeModal,
        offerTypeModalVisible: true,
      })

      const radioButton = renderAPI.getByTestId(label)
      fireEvent.press(radioButton)

      expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.OfferType, searchId)
    })
  })

  describe('when user is not logged in', () => {
    beforeEach(() => {
      mockUseAuthContext.mockReturnValueOnce({
        isLoggedIn: false,
        setIsLoggedIn: jest.fn(),
        user: undefined,
        refetchUser: jest.fn(),
        isUserLoading: false,
      })
    })

    it('should not display duo offer toggle', () => {
      const { queryByTestId } = renderOfferTypeModal({
        hideOfferTypeModal,
        offerTypeModalVisible: true,
      })

      const toggle = queryByTestId('Interrupteur-limitDuoOfferSearch')

      expect(toggle).toBeFalsy()
    })
  })

  describe('when user is not a beneficiary', () => {
    beforeEach(() => {
      mockUseAuthContext.mockReturnValueOnce({
        isLoggedIn: false,
        setIsLoggedIn: jest.fn(),
        user: nonBeneficiaryUser,
        refetchUser: jest.fn(),
        isUserLoading: false,
      })
    })

    it('should not display duo offer toggle', () => {
      const { queryByTestId } = renderOfferTypeModal({
        hideOfferTypeModal,
        offerTypeModalVisible: true,
      })

      const toggle = queryByTestId('Interrupteur-limitDuoOfferSearch')

      expect(toggle).toBeFalsy()
    })
  })

  describe('when user is logged in and benificiary with no credit', () => {
    beforeEach(() => {
      mockUseAuthContext.mockReturnValueOnce({
        isLoggedIn: false,
        setIsLoggedIn: jest.fn(),
        user: { ...beneficiaryUser, domainsCredit: { all: { initial: 8000, remaining: 0 } } },
        refetchUser: jest.fn(),
        isUserLoading: false,
      })
    })

    it('should not display duo offer toggle', () => {
      const { queryByTestId } = renderOfferTypeModal({
        hideOfferTypeModal,
        offerTypeModalVisible: true,
      })

      const toggle = queryByTestId('Interrupteur-limitDuoOfferSearch')

      expect(toggle).toBeFalsy()
    })
  })

  describe('when user is logged in and beneficiary with credit', () => {
    beforeEach(() => {
      mockUseAuthContext.mockReturnValueOnce({
        isLoggedIn: false,
        setIsLoggedIn: jest.fn(),
        user: beneficiaryUser,
        refetchUser: jest.fn(),
        isUserLoading: false,
      })
    })

    it('should display toggle offerIsDuo if all type select', () => {
      const renderAPI = renderOfferTypeModal({
        hideOfferTypeModal,
        offerTypeModalVisible: true,
      })

      const radioButton = renderAPI.getByTestId(OfferType.ALL_TYPE)

      fireEvent.press(radioButton)

      const toggle = renderAPI.getByTestId('Interrupteur-limitDuoOfferSearch')

      expect(toggle).toBeTruthy()
    })

    it.each(
      OFFER_TYPES.filter(
        (item) => item.label !== OfferType.ALL_TYPE && item.label !== OfferType.EVENT
      ).map(({ label }) => label)
    )(`should not display toggle offerIsDuo when %s on press`, async (label) => {
      const renderAPI = renderOfferTypeModal({
        hideOfferTypeModal,
        offerTypeModalVisible: true,
      })

      const radioButton = renderAPI.getByTestId(label)

      await act(async () => {
        fireEvent.press(radioButton)
      })

      expect(radioButton.props.accessibilityState).toEqual({ checked: true })

      const toggle = renderAPI.queryByTestId('Interrupteur-limitDuoOfferSearch')

      expect(toggle).toBeFalsy()
    })

    it.each(
      OFFER_TYPES.filter(
        (item) => item.label == OfferType.ALL_TYPE || item.label == OfferType.EVENT
      ).map(({ label }) => label)
    )(`should display toggle offerIsDuo when %s on press`, (label) => {
      const renderAPI = renderOfferTypeModal({
        hideOfferTypeModal,
        offerTypeModalVisible: true,
      })

      const radioButton = renderAPI.getByTestId(label)

      fireEvent.press(radioButton)

      expect(radioButton.props.accessibilityState).toEqual({ checked: true })

      const toggle = renderAPI.queryByTestId('Interrupteur-limitDuoOfferSearch')

      expect(toggle).toBeTruthy()
    })

    it('should toggle offerIsDuo', () => {
      const renderAPI = renderOfferTypeModal({
        hideOfferTypeModal,
        offerTypeModalVisible: true,
      })

      const toggle = renderAPI.getByTestId('Interrupteur-limitDuoOfferSearch')

      expect(toggle.props.accessibilityState).toEqual({
        disabled: false,
        checked: false,
      })

      fireEvent.press(toggle)

      expect(toggle.props.accessibilityState).toEqual({
        disabled: false,
        checked: true,
      })
    })

    it('should log only duo offer search when pressing the toggle', () => {
      const renderAPI = renderOfferTypeModal({
        hideOfferTypeModal,
        offerTypeModalVisible: true,
      })

      const toggle = renderAPI.getByTestId('Interrupteur-limitDuoOfferSearch')

      fireEvent.press(toggle)

      expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Duo, searchId)
    })
  })

  describe('click reset button', () => {
    it('should disable duo offer when click on reset button', async () => {
      const renderAPI = renderOfferTypeModal({
        hideOfferTypeModal,
        offerTypeModalVisible: true,
      })

      const toggle = renderAPI.getByTestId('Interrupteur-limitDuoOfferSearch')

      fireEvent.press(toggle)

      const resetButton = renderAPI.getByText('Réinitialiser')

      await act(async () => {
        fireEvent.press(resetButton)
      })

      expect(toggle.props.accessibilityState).toEqual({
        disabled: false,
        checked: false,
      })
    })

    it('should be all type offer when click on reset button', async () => {
      const renderAPI = renderOfferTypeModal({
        hideOfferTypeModal,
        offerTypeModalVisible: true,
      })

      const radioButton = renderAPI.getByTestId(OfferType.ALL_TYPE)
      const digitalRadioButton = renderAPI.getByTestId(OfferType.DIGITAL)

      fireEvent.press(digitalRadioButton)

      expect(radioButton.props.accessibilityState).toEqual({ checked: false })

      const resetButton = renderAPI.getByText('Réinitialiser')

      await act(async () => {
        fireEvent.press(resetButton)
      })

      expect(radioButton.props.accessibilityState).toEqual({ checked: true })
    })
  })

  describe('should close the modal ', () => {
    it('should close modal on submit', async () => {
      const { getByText } = renderOfferTypeModal({
        hideOfferTypeModal,
        offerTypeModalVisible: true,
      })
      const button = getByText('Rechercher')

      await act(async () => {
        fireEvent.press(button)
      })

      expect(hideOfferTypeModal).toHaveBeenCalledTimes(1)
    })

    it('should navigate to Search results when selecting DUO offer and submit form', async () => {
      const { getByText, getByTestId } = renderOfferTypeModal({
        hideOfferTypeModal,
        offerTypeModalVisible: true,
      })
      const toggle = getByTestId('Interrupteur-limitDuoOfferSearch')
      const button = getByText('Rechercher')

      fireEvent.press(toggle)

      await act(async () => {
        fireEvent.press(button)
      })

      expect(navigate).toHaveBeenCalledWith('TabNavigator', {
        params: {
          ...mockSearchState,
          view: SearchView.Results,
          offerIsDuo: true,
        },
        screen: 'Search',
      })
    })

    it('should use default filters when submitting without change', async () => {
      const { getByText } = renderOfferTypeModal({
        hideOfferTypeModal,
        offerTypeModalVisible: true,
      })

      const button = getByText('Rechercher')

      await act(async () => {
        fireEvent.press(button)
      })

      expect(navigate).toHaveBeenCalledWith('TabNavigator', {
        params: {
          ...mockSearchState,
          view: SearchView.Results,
          offerIsDuo: false,
        },
        screen: 'Search',
      })
    })

    it.each`
      offerType      | label
      ${undefined}   | ${OfferType.ALL_TYPE}
      ${'isDigital'} | ${OfferType.DIGITAL}
      ${'isEvent'}   | ${OfferType.EVENT}
      ${'isThing'}   | ${OfferType.THING}
    `(
      'should use offerType=$offerType and navigate to search results when pressing "$label"',
      async ({ offerType, label }: { offerType?: OfferTypes; label: OfferType }) => {
        const { getByText, getByTestId } = renderOfferTypeModal({
          hideOfferTypeModal,
          offerTypeModalVisible: true,
        })
        const radio = getByTestId(label)

        fireEvent.press(radio)

        const button = getByText('Rechercher')

        await act(async () => {
          fireEvent.press(button)
        })

        expect(navigate).toHaveBeenCalledWith('TabNavigator', {
          params: {
            ...mockSearchState,
            view: SearchView.Results,
            offerTypes: {
              ...mockSearchState.offerTypes,
              ...(offerType !== undefined
                ? {
                    [offerType]: true,
                  }
                : {}),
            },
          },
          screen: 'Search',
        })
      }
    )

    it('when pressing previous button', () => {
      const { getByTestId } = renderOfferTypeModal({
        hideOfferTypeModal,
        offerTypeModalVisible: true,
      })

      const previousButton = getByTestId('backButton')
      fireEvent.press(previousButton)

      expect(hideOfferTypeModal).toHaveBeenCalledTimes(1)
    })
  })
})

type Props = {
  offerTypeModalVisible: boolean
  hideOfferTypeModal: () => void
}

function renderOfferTypeModal(
  { offerTypeModalVisible, hideOfferTypeModal }: Props,
  isDesktopViewport?: boolean
) {
  return render(
    <OfferTypeModal
      title="Type d'offre"
      accessibilityLabel="Ne pas filtrer sur les type d'offre et retourner aux résultats"
      isVisible={offerTypeModalVisible}
      hideModal={hideOfferTypeModal}
    />,
    { theme: { isDesktopViewport } }
  )
}
