import mockdate from 'mockdate'
import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'
import { v4 as uuidv4 } from 'uuid'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialSearchState } from 'features/search/context/reducer'
import { DATE_FILTER_OPTIONS, FilterBehaviour } from 'features/search/enums'
import {
  DatesHoursModal,
  DatesHoursModalProps,
  DATE_TYPES,
  RadioButtonDate,
} from 'features/search/pages/modals/DatesHoursModal/DatesHoursModal'
import { SearchState, SearchView } from 'features/search/types'
import { analytics } from 'libs/firebase/analytics'
import { formatToCompleteFrenchDate } from 'libs/parsers'
import { act, fireEvent, render, screen, superFlushWithAct, waitFor } from 'tests/utils'

const searchId = uuidv4()
const searchState = { ...initialSearchState, searchId }
let mockSearchState = searchState
const mockDispatch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

const mockHideModal = jest.fn()
const mockOnClose = jest.fn()

const TODAY = new Date(2022, 9, 28)
const TOMORROW = new Date(2022, 9, 29)
const UNDEFINED_DATE = undefined

describe('<DatesHoursModal/>', () => {
  beforeAll(() => {
    mockdate.set(TODAY)
  })

  it('should render modal correctly after animation and with enabled submit', async () => {
    jest.useFakeTimers('legacy')
    const renderAPI = renderDatesHoursModal()
    await superFlushWithAct()
    expect(renderAPI).toMatchSnapshot()
  })

  describe('should show', () => {
    it("the calendar when picking 'Date précise'", async () => {
      mockSearchState = {
        ...searchState,
        date: { option: DATE_FILTER_OPTIONS.TODAY, selectedDate: TODAY.toISOString() },
      }
      renderDatesHoursModal()

      let component = screen.toJSON()
      if (Array.isArray(component)) {
        expect(component).not.toContain('CalendarPicker')
        expect(component).toContain('NoCalendar')
      }

      await act(async () => {
        fireEvent.press(screen.getByText('Date précise'))
      })
      component = screen.toJSON()
      if (Array.isArray(component)) {
        expect(component).toContain('CalendarPicker')
        expect(component).not.toContain('NoCalendar')
      }
    })

    it("the correct date when picking 'Date précise'", async () => {
      mockSearchState = {
        ...searchState,
        date: { option: DATE_FILTER_OPTIONS.USER_PICK, selectedDate: TOMORROW.toISOString() },
      }
      renderDatesHoursModal()
      await act(async () => {
        expect(screen.getByText('Samedi 29 octobre 2022')).toBeTruthy()
      })
    })

    it('by default time range defined in search state', async () => {
      mockSearchState = {
        ...searchState,
        timeRange: [18, 22],
      }
      renderDatesHoursModal()

      await act(async () => {
        expect(screen.getByText(`18\u00a0h et 22\u00a0h`)).toBeTruthy()
      })
    })
  })

  it('should hide and show the CalendarPicker', async () => {
    mockSearchState = {
      ...searchState,
      date: { option: DATE_FILTER_OPTIONS.USER_PICK, selectedDate: TODAY.toISOString() },
    }
    renderDatesHoursModal()

    const radioButton = screen.getByTestId(
      `${RadioButtonDate.PRECISE_DATE} ${formatToCompleteFrenchDate(TODAY)}`
    )

    await act(async () => {
      fireEvent.press(radioButton)
    })

    const withCalendar = screen.toJSON()
    if (Array.isArray(withCalendar)) {
      expect(withCalendar).toContain('CalendarPicker')
      expect(withCalendar).not.toContain('NoCalendar')
    }

    await act(async () => {
      fireEvent.press(radioButton)
    })

    const withoutCalendar = screen.toJSON()
    if (Array.isArray(withoutCalendar)) {
      expect(withoutCalendar).toContain('CalendarPicker')
      expect(withoutCalendar).not.toContain('NoCalendar')
    }
  })

  describe('should desactivate', () => {
    it('toggle date when pressing reset button', async () => {
      mockSearchState = {
        ...searchState,
      }
      renderDatesHoursModal()

      const toggleDate = screen.getByTestId('Interrupteur-date')
      await act(async () => {
        fireEvent.press(toggleDate)
      })
      expect(toggleDate.props.accessibilityState.checked).toEqual(true)

      const resetButton = screen.getByText('Réinitialiser')
      await act(async () => {
        fireEvent.press(resetButton)
      })
      expect(toggleDate.props.accessibilityState.checked).toEqual(false)
    })

    it('toggle hour when pressing reset button', async () => {
      mockSearchState = {
        ...searchState,
      }
      renderDatesHoursModal()

      const toggleHour = screen.getByTestId('Interrupteur-hour')
      await act(async () => {
        fireEvent.press(toggleHour)
      })
      expect(toggleHour.props.accessibilityState.checked).toEqual(true)

      const resetButton = screen.getByText('Réinitialiser')
      await act(async () => {
        fireEvent.press(resetButton)
      })
      expect(toggleHour.props.accessibilityState.checked).toEqual(false)
    })
  })

  describe('should reset', () => {
    it.each([[RadioButtonDate.WEEK], [RadioButtonDate.WEEK_END], [RadioButtonDate.PRECISE_DATE]])(
      '%s radio button when pressing reset button',
      async (option: RadioButtonDate) => {
        mockSearchState = {
          ...searchState,
        }
        renderDatesHoursModal()

        const toggleDate = screen.getByTestId('Interrupteur-date')
        await act(async () => {
          fireEvent.press(toggleDate)
        })

        const radioButton = screen.getByTestId(option)
        await act(async () => {
          fireEvent.press(radioButton)
        })
        expect(radioButton.props.accessibilityState).toEqual({ checked: true })

        const resetButton = screen.getByText('Réinitialiser')
        await act(async () => {
          fireEvent.press(resetButton)
          fireEvent.press(toggleDate)
        })

        expect(radioButton.props.accessibilityState).toEqual({ checked: false })
      }
    )

    it.each([[RadioButtonDate.WEEK], [RadioButtonDate.WEEK_END], [RadioButtonDate.PRECISE_DATE]])(
      '%s radio button when desactivating date toggle',
      async (option: RadioButtonDate) => {
        mockSearchState = {
          ...searchState,
        }
        renderDatesHoursModal()

        const toggleDate = screen.getByTestId('Interrupteur-date')
        await act(async () => {
          fireEvent.press(toggleDate)
        })

        const radioButton = screen.getByTestId(option)
        await act(async () => {
          fireEvent.press(radioButton)
        })
        expect(radioButton.props.accessibilityState).toEqual({ checked: true })

        await act(async () => {
          fireEvent.press(toggleDate)
          fireEvent.press(toggleDate)
        })

        expect(radioButton.props.accessibilityState).toEqual({ checked: false })
      }
    )

    it('time range selected when pressing reset button', async () => {
      mockSearchState = {
        ...searchState,
      }
      renderDatesHoursModal()

      const toggleHour = screen.getByTestId('Interrupteur-hour')
      await act(async () => {
        fireEvent.press(toggleHour)
      })
      expect(toggleHour.props.accessibilityState.checked).toEqual(true)

      await act(async () => {
        const slider = screen.getByTestId('slider').children[0] as ReactTestInstance
        slider.props.onValuesChangeFinish([18, 23])
      })
      expect(screen.getByText(`18\u00a0h et 23\u00a0h`)).toBeTruthy()

      const resetButton = screen.getByText('Réinitialiser')
      await act(async () => {
        fireEvent.press(resetButton)
        fireEvent.press(toggleHour)
      })
      expect(screen.getByText(`8\u00a0h et 22\u00a0h`)).toBeTruthy()
    })

    it('time range selected when desactivating hour toggle', async () => {
      mockSearchState = {
        ...searchState,
      }
      renderDatesHoursModal()

      const toggleHour = screen.getByTestId('Interrupteur-hour')
      await act(async () => {
        fireEvent.press(toggleHour)
      })

      await act(async () => {
        const slider = screen.getByTestId('slider').children[0] as ReactTestInstance
        slider.props.onValuesChangeFinish([18, 23])
      })
      expect(screen.getByText(`18\u00a0h et 23\u00a0h`)).toBeTruthy()

      await act(async () => {
        fireEvent.press(toggleHour)
        fireEvent.press(toggleHour)
      })
      expect(screen.getByText(`8\u00a0h et 22\u00a0h`)).toBeTruthy()
    })
  })

  it('should close the modal when pressing previous button', async () => {
    renderDatesHoursModal()

    await superFlushWithAct()

    const previousButton = screen.getByTestId('Fermer')
    fireEvent.press(previousButton)

    expect(mockHideModal).toHaveBeenCalledTimes(1)
  })

  describe('should activate by default', () => {
    it('date toggle when date defined in search state', async () => {
      mockSearchState = {
        ...searchState,
        date: { selectedDate: TODAY.toISOString(), option: DATE_FILTER_OPTIONS.TODAY },
      }
      renderDatesHoursModal()

      const toggleDate = screen.getByTestId('Interrupteur-date')

      await act(async () => {
        expect(toggleDate.props.accessibilityState.checked).toEqual(true)
      })
    })

    it('hour toggle when time range defined in search state', async () => {
      mockSearchState = {
        ...searchState,
        date: { selectedDate: TODAY.toISOString(), option: DATE_FILTER_OPTIONS.TODAY },
      }
      renderDatesHoursModal()

      const toggleHour = screen.getByTestId('Interrupteur-date')

      await act(async () => {
        expect(toggleHour.props.accessibilityState.checked).toEqual(true)
      })
    })
  })

  describe('should select by default', () => {
    it.each(DATE_TYPES)(
      '%s radio button when date defined in search state',
      async ({ label, type }) => {
        mockSearchState = {
          ...searchState,
          date: { selectedDate: TODAY.toISOString(), option: type },
        }
        renderDatesHoursModal()

        const radioButton = screen.getByTestId(label, { exact: false })
        await act(async () => {
          expect(radioButton.props.accessibilityState).toEqual({ checked: true })
        })
      }
    )
  })

  describe('with "Appliquer le filtre" button', () => {
    it('should display alternative button title', async () => {
      renderDatesHoursModal({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })

      await waitFor(() => {
        expect(screen.getByText('Appliquer le filtre')).toBeTruthy()
      })
    })

    it('should update search state when pressing submit button', async () => {
      mockSearchState = {
        ...searchState,
      }
      renderDatesHoursModal({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })

      const toggleDate = screen.getByTestId('Interrupteur-date')
      await act(async () => {
        fireEvent.press(toggleDate)
      })

      const radioButton = screen.getByText(RadioButtonDate.WEEK)
      await act(async () => {
        fireEvent.press(radioButton)
      })

      const searchButton = screen.getByText('Appliquer le filtre')
      await act(async () => {
        fireEvent.press(searchButton)
      })

      const expectedSearchParams: SearchState = {
        ...searchState,
        date: {
          option: DATE_FILTER_OPTIONS.CURRENT_WEEK,
          selectedDate: '2022-10-28T00:00:00.000Z',
        },
        view: SearchView.Results,
      }

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: expectedSearchParams,
      })
    })

    it('should not log PerformSearch when pressing button', async () => {
      mockSearchState = {
        ...searchState,
        view: SearchView.Results,
      }
      renderDatesHoursModal({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })

      await superFlushWithAct()

      const searchButton = screen.getByText('Appliquer le filtre')
      await act(async () => {
        fireEvent.press(searchButton)
      })

      expect(analytics.logPerformSearch).toHaveBeenCalledTimes(0)
    })
  })

  describe('with "Recherche" button', () => {
    describe('should navigate on search results', () => {
      it('with actual state without change when pressing button', async () => {
        mockSearchState = {
          ...searchState,
          view: SearchView.Results,
        }
        renderDatesHoursModal()

        await superFlushWithAct()

        const searchButton = screen.getByText('Rechercher')
        await act(async () => {
          fireEvent.press(searchButton)
        })

        expect(navigate).toHaveBeenCalledWith('TabNavigator', {
          params: {
            ...mockSearchState,
            view: SearchView.Results,
          },
          screen: 'Search',
        })
      })

      it.each(DATE_TYPES)(
        'with %s date filter when toggle date activated and pressing button',
        async ({ label, type }) => {
          mockSearchState = {
            ...searchState,
          }
          renderDatesHoursModal()

          const toggleDate = screen.getByTestId('Interrupteur-date')
          await act(async () => {
            fireEvent.press(toggleDate)
          })

          const radioButton = screen.getByTestId(label)
          await act(async () => {
            fireEvent.press(radioButton)
          })

          const searchButton = screen.getByText('Rechercher')
          await act(async () => {
            fireEvent.press(searchButton)
          })

          expect(navigate).toHaveBeenCalledWith('TabNavigator', {
            params: {
              ...mockSearchState,
              date: { selectedDate: TODAY.toISOString(), option: type },
              view: SearchView.Results,
            },
            screen: 'Search',
          })
        }
      )

      it('with a time range filter when toggle hour activated and pressing button', async () => {
        mockSearchState = {
          ...searchState,
        }
        renderDatesHoursModal()

        const toggleHour = screen.getByTestId('Interrupteur-hour')
        await act(async () => {
          fireEvent.press(toggleHour)
        })

        await act(async () => {
          const slider = screen.getByTestId('slider').children[0] as ReactTestInstance
          slider.props.onValuesChangeFinish([18, 23])
        })

        const searchButton = screen.getByText('Rechercher')
        await act(async () => {
          fireEvent.press(searchButton)
        })

        expect(navigate).toHaveBeenCalledWith('TabNavigator', {
          params: {
            ...mockSearchState,
            timeRange: [18, 23],
            view: SearchView.Results,
          },
          screen: 'Search',
        })
      })

      it('without beginning & ending date when pressing button', async () => {
        mockSearchState = {
          ...searchState,
          beginningDatetime: TODAY.toISOString(),
          endingDatetime: TOMORROW.toISOString(),
        }
        renderDatesHoursModal()

        await superFlushWithAct()

        const searchButton = screen.getByText('Rechercher')
        await act(async () => {
          fireEvent.press(searchButton)
        })

        expect(navigate).toHaveBeenCalledWith('TabNavigator', {
          params: {
            ...mockSearchState,
            beginningDatetime: UNDEFINED_DATE,
            endingDatetime: UNDEFINED_DATE,
            view: SearchView.Results,
          },
          screen: 'Search',
        })
      })
    })

    it('should log PerformSearch when pressing button', async () => {
      mockSearchState = {
        ...searchState,
        view: SearchView.Results,
      }
      renderDatesHoursModal()

      await superFlushWithAct()

      const searchButton = screen.getByText('Rechercher')
      await act(async () => {
        fireEvent.press(searchButton)
      })

      expect(analytics.logPerformSearch).toHaveBeenCalledWith(mockSearchState)
    })
  })

  describe('Modal header buttons', () => {
    it('should display back button on header when the modal is opening from general filter page', async () => {
      renderDatesHoursModal({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })

      await waitFor(() => {
        expect(screen.getByTestId('Revenir en arrière')).toBeTruthy()
      })
    })

    it('should close the modal and general filter page when pressing close button when the modal is opening from general filter page', async () => {
      renderDatesHoursModal({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
        onClose: mockOnClose,
      })

      await superFlushWithAct()

      const closeButton = screen.getByTestId('Fermer')
      fireEvent.press(closeButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should only close the modal when pressing close button when the modal is opening from search results', async () => {
      renderDatesHoursModal()

      await superFlushWithAct()

      const closeButton = screen.getByTestId('Fermer')
      fireEvent.press(closeButton)

      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })
})

function renderDatesHoursModal({
  filterBehaviour = FilterBehaviour.SEARCH,
  onClose,
}: Partial<DatesHoursModalProps> = {}) {
  return render(
    <DatesHoursModal
      title="Dates & heures"
      accessibilityLabel="Ne pas filtrer sur les dates et heures puis retourner aux résultats"
      isVisible
      hideModal={mockHideModal}
      filterBehaviour={filterBehaviour}
      onClose={onClose}
    />
  )
}
