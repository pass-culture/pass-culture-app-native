import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { OfferType } from 'features/search/enums'
import { OfferTypeModal } from 'features/search/pages/OfferTypeModal'
import { initialSearchState } from 'features/search/pages/reducer'
import { OFFER_TYPES } from 'features/search/sections/OfferType'
import { OfferTypes, SearchView } from 'features/search/types'
import { fireEvent, render, act } from 'tests/utils'

const mockSearchState = initialSearchState

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
  }),
}))

const hideOfferTypeModal = jest.fn()

describe('OfferTypeModal component', () => {
  afterEach(jest.clearAllMocks)

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
      const radioButton = renderAPI.getByTestId('Tous les types')
      const digitalRadioButton = renderAPI.getByTestId('Numérique')
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
  })

  describe('toggle offerIsDuo', () => {
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

      expect(hideOfferTypeModal).toHaveBeenCalled()
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
      'should navigate to search results with digital offer',
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

      expect(hideOfferTypeModal).toHaveBeenCalled()
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
