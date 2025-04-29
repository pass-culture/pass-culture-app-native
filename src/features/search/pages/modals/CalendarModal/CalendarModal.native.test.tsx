import mockdate from 'mockdate'
import React from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import { ISearchContext } from 'features/search/context/SearchWrapper'
import { FilterBehaviour } from 'features/search/enums'
import {
  CalendarModal,
  CalendarModalProps,
} from 'features/search/pages/modals/CalendarModal/CalendarModal'
import { act, render, screen, userEvent } from 'tests/utils'

const mockDispatch = jest.fn()

const initialMockUseSearch = {
  searchState: initialSearchState,
  dispatch: mockDispatch,
}
const mockUseSearch: jest.Mock<Partial<ISearchContext>> = jest.fn(() => initialMockUseSearch)
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => mockUseSearch(),
}))

const TODAY = new Date(2025, 3, 28)

const mockHideModal = jest.fn()
const mockOnClose = jest.fn()

const user = userEvent.setup()

jest.useFakeTimers()

describe('CalendarModal', () => {
  beforeEach(() => {
    mockUseSearch.mockReturnValueOnce(initialMockUseSearch)
  })

  beforeAll(() => {
    mockdate.set(TODAY)
  })

  it('should display modal with title', async () => {
    renderCalendarModal()

    await act(() => {
      expect(screen.getByText('Dates')).toBeOnTheScreen()
    })
  })

  it('should close the modal when pressing close button', async () => {
    renderCalendarModal()

    await user.press(screen.getByLabelText('Fermer'))

    expect(mockOnClose).toHaveBeenCalledWith()
  })

  it('should hide the modal when pressing close button', async () => {
    renderCalendarModal()

    await user.press(screen.getByLabelText('Fermer'))

    expect(mockHideModal).toHaveBeenCalledWith()
  })

  it('should reset dates when pressing reset button and execute search after', async () => {
    mockUseSearch.mockReturnValueOnce({
      ...initialMockUseSearch,
      searchState: {
        ...initialSearchState,
        beginningDatetime: '2025-05-01',
        endingDatetime: '2025-05-05',
      },
    })

    renderCalendarModal()

    await user.press(screen.getByText('Réinitialiser'))

    await user.press(screen.getByText('Rechercher'))

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'SET_STATE',
        payload: expect.objectContaining({
          beginningDatetime: undefined,
          endingDatetime: undefined,
        }),
      })
    )
  })

  it('should execute search with selected dates and close the modal when pressing search button', async () => {
    renderCalendarModal()

    await user.press(screen.getByLabelText(' Saturday 14 June 2025 '))
    await user.press(screen.getByLabelText(' Tuesday 17 June 2025 '))

    await user.press(screen.getByText('Rechercher'))

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'SET_STATE',
        payload: expect.objectContaining({
          beginningDatetime: '2025-06-14T00:00:00.000Z',
          endingDatetime: '2025-06-17T00:00:00.000Z',
        }),
      })
    )
    expect(mockHideModal).toHaveBeenCalledWith()
  })
})

function renderCalendarModal({
  filterBehaviour = FilterBehaviour.SEARCH,
}: Partial<CalendarModalProps> = {}) {
  return render(
    <CalendarModal
      title="Dates"
      accessibilityLabel="Ne pas filtrer sur les dates"
      isVisible
      hideModal={mockHideModal}
      filterBehaviour={filterBehaviour}
      onClose={mockOnClose}
    />
  )
}
