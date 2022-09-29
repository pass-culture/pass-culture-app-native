import React from 'react'

import { OfferType } from 'features/search/enums'
import { OfferTypeModal } from 'features/search/pages/OfferTypeModal'
import { initialSearchState } from 'features/search/pages/reducer'
import { OFFER_TYPES } from 'features/search/sections/OfferType'
import { fireEvent, render } from 'tests/utils'

const mockSearchState = initialSearchState

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
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
    // it('when pressing the search button', async () => {
    //   const { getByText } = renderOfferTypeModal({
    //     hideOfferTypeModal,
    //     offerTypeModalVisible: true,
    //   })
    //
    //   const button = getByText('Rechercher')
    //
    //   await act(async () => {
    //     fireEvent.press(button)
    //   })
    //
    //   expect(hideOfferTypeModal).toHaveBeenCalled()
    // })

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
