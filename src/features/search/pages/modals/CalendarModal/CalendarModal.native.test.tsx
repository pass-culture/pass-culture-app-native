import { addMonths } from 'date-fns'
import React from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import { ISearchContext } from 'features/search/context/SearchWrapper'
import { FilterBehaviour } from 'features/search/enums'
import {
  CalendarModal,
  CalendarModalProps,
} from 'features/search/pages/modals/CalendarModal/CalendarModal'
import { capitalizeFirstLetter } from 'libs/parsers/capitalizeFirstLetter'
import { act, render, screen, userEvent } from 'tests/utils'

const mockDispatch = jest.fn()

const TODAY = new Date(2025, 3, 28)

const initialMockUseSearch = {
  searchState: initialSearchState,
  dispatch: mockDispatch,
}
const mockUseSearch: jest.Mock<Partial<ISearchContext>> = jest.fn(() => initialMockUseSearch)
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => mockUseSearch(),
}))

const nextMonth = addMonths(TODAY, 1)
const nextMonthName = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(nextMonth)

const mockHideModal = jest.fn()
const mockOnClose = jest.fn()

const user = userEvent.setup()

describe('CalendarModal', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(TODAY)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('In initial state', () => {
    beforeEach(() => {
      mockUseSearch.mockReturnValueOnce(initialMockUseSearch)
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

    it('should execute search with selected dates and close the modal when pressing search button', async () => {
      renderCalendarModal()

      const firstDateButton = screen.getByLabelText(/ 1 Juin 2025/)
      const lastDateButton = screen.getByLabelText(/ 10 Juin 2025/)

      await user.press(firstDateButton)
      await user.press(lastDateButton)

      await user.press(screen.getByLabelText('Rechercher'))

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'SET_STATE',
          payload: expect.objectContaining({
            beginningDatetime: '2025-06-01T00:00:00.000Z',
            endingDatetime: '2025-06-10T00:00:00.000Z',
          }),
        })
      )

      expect(mockHideModal).toHaveBeenCalledWith()
    })

    describe('should execute search with filter when pressing filter and search button', () => {
      it('With today filter', async () => {
        renderCalendarModal()

        await user.press(screen.getByText('Aujourd’hui'))

        await user.press(screen.getByText('Rechercher'))

        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'SET_STATE',
            payload: expect.objectContaining({
              calendarFilterId: 'today',
            }),
          })
        )
      })

      it('With this week filter', async () => {
        renderCalendarModal()

        await user.press(screen.getByText('Cette semaine'))

        await user.press(screen.getByText('Rechercher'))

        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'SET_STATE',
            payload: expect.objectContaining({
              calendarFilterId: 'thisWeek',
            }),
          })
        )
      })

      it('With this weekend filter', async () => {
        renderCalendarModal()

        await user.press(screen.getByText('Ce week-end'))

        await user.press(screen.getByText('Rechercher'))

        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'SET_STATE',
            payload: expect.objectContaining({
              calendarFilterId: 'thisWeekend',
            }),
          })
        )
      })

      it('With this month filter', async () => {
        renderCalendarModal()

        await user.press(screen.getByText('Ce mois-ci'))

        await user.press(screen.getByText('Rechercher'))

        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'SET_STATE',
            payload: expect.objectContaining({
              calendarFilterId: 'thisMonth',
            }),
          })
        )
      })

      it('With this next month filter', async () => {
        renderCalendarModal()

        await user.press(screen.getByText(capitalizeFirstLetter(nextMonthName)))

        await user.press(screen.getByText('Rechercher'))

        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'SET_STATE',
            payload: expect.objectContaining({
              calendarFilterId: 'nextMonth',
            }),
          })
        )
      })
    })
  })

  it('should reset search when pressing reset button', async () => {
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

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_STATE',
      payload: expect.objectContaining({
        beginningDatetime: undefined,
        endingDatetime: undefined,
      }),
    })
  })

  it('should display filter button as applied when filter applied', async () => {
    mockUseSearch.mockReturnValueOnce({
      ...initialMockUseSearch,
      searchState: {
        ...initialSearchState,
        beginningDatetime: '2025-04-28',
        calendarFilterId: 'today',
      },
    })

    renderCalendarModal()

    const filterButton = await screen.findByTestId('Aujourd’hui\u00a0: Filtre sélectionné')

    expect(filterButton).toHaveStyle({
      borderWidth: 2,
      backgroundColor: '#F1F1F4',
    })
  })

  it('should reset search when pressing applied filter and execute the search', async () => {
    mockUseSearch.mockReturnValueOnce({
      ...initialMockUseSearch,
      searchState: {
        ...initialSearchState,
        beginningDatetime: '2025-04-28',
        calendarFilterId: 'today',
      },
    })

    renderCalendarModal()

    await screen.findByTestId('Aujourd’hui\u00a0: Filtre sélectionné')

    await user.press(screen.getByText('Aujourd’hui'))

    await user.press(screen.getByText('Rechercher'))

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'SET_STATE',
        payload: expect.objectContaining({
          calendarFilterId: undefined,
        }),
      })
    )
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
