import mockdate from 'mockdate'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialSearchState } from 'features/search/context/reducer/reducer'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { SearchView } from 'features/search/types'
import { act, fireEvent, render, superFlushWithAct } from 'tests/utils/web'

import { DatesHoursModal } from './DatesHoursModal'

const mockSearchState = initialSearchState
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
  }),
}))

const hideDatesHoursModal = jest.fn()

const TODAY = new Date(2022, 9, 28)
const TOMORROW = new Date(2022, 9, 29)

describe('DatesHoursModal component', () => {
  beforeAll(() => {
    mockdate.set(TODAY)
  })

  describe('modal header', () => {
    it('should have header when viewport width is mobile', async () => {
      const isDesktopViewport = false
      const renderAPI = renderDatesHoursModal({ hideDatesHoursModal }, isDesktopViewport)

      const header = renderAPI.queryByTestId('pageHeader')

      await act(async () => {
        expect(header).toBeTruthy()
      })
    })

    it('should not have header when viewport width is desktop', async () => {
      const isDesktopViewport = true
      const renderAPI = renderDatesHoursModal(
        {
          hideDatesHoursModal,
        },
        isDesktopViewport
      )

      const header = renderAPI.queryByTestId('pageHeader')
      await act(async () => {
        expect(header).toBeFalsy()
      })
    })
  })

  it('should close the modal when clicking close button', async () => {
    const isDesktopViewport = true
    const { getByTestId } = renderDatesHoursModal(
      {
        hideDatesHoursModal,
      },
      isDesktopViewport
    )

    await superFlushWithAct()

    const closeButton = getByTestId(
      'Ne pas filtrer sur les dates et heures puis retourner aux résultats'
    )
    fireEvent.click(closeButton)

    expect(hideDatesHoursModal).toHaveBeenCalled()
  })

  it('should navigate on search results with a picked date filter when toggle date activated and pressing search button', async () => {
    const { getByTestId, getByText, getByRole } = renderDatesHoursModal({
      hideDatesHoursModal,
    })

    const toggleDate = getByTestId('Interrupteur-date')
    await act(async () => {
      fireEvent.click(toggleDate)
    })

    const radioButton = getByTestId(DATE_FILTER_OPTIONS.USER_PICK)
    await act(async () => {
      fireEvent.click(radioButton)
    })

    const datePick = getByRole('button', { name: 'Samedi 29 Octobre 2022' })
    await act(async () => {
      fireEvent.click(datePick)
    })

    const validDateButton = getByText('Valider la date')
    await act(async () => {
      fireEvent.click(validDateButton)
    })

    const searchButton = getByText('Rechercher')
    await act(async () => {
      fireEvent.click(searchButton)
    })

    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      params: {
        ...mockSearchState,
        date: { selectedDate: TOMORROW.toISOString(), option: DATE_FILTER_OPTIONS.USER_PICK },
        view: SearchView.Results,
      },
      screen: 'Search',
    })
  })
})

type Props = {
  hideDatesHoursModal: () => void
}

function renderDatesHoursModal({ hideDatesHoursModal }: Props, isDesktopViewport?: boolean) {
  return render(
    <DatesHoursModal
      title="Dates & heures"
      accessibilityLabel="Ne pas filtrer sur les dates et heures puis retourner aux résultats"
      isVisible
      hideModal={hideDatesHoursModal}
    />,
    { theme: { isDesktopViewport } }
  )
}
