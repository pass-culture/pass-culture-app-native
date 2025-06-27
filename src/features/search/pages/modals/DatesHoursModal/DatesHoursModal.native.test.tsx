import mockdate from 'mockdate'
import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'
import { v4 as uuidv4 } from 'uuid'

import { initialSearchState } from 'features/search/context/reducer'
import { DATE_FILTER_OPTIONS, FilterBehaviour } from 'features/search/enums'
import {
  DATE_TYPES,
  DatesHoursModal,
  DatesHoursModalProps,
  RadioButtonDate,
} from 'features/search/pages/modals/DatesHoursModal/DatesHoursModal'
import { SearchState } from 'features/search/types'
import { formatToCompleteFrenchDate } from 'libs/parsers/formatDates'
import { act, fireEvent, render, screen, userEvent, waitFor } from 'tests/utils'

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

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()

jest.useFakeTimers()

describe('<DatesHoursModal/>', () => {
  beforeAll(() => {
    mockdate.set(TODAY)
  })

  it('should render modal correctly after animation and with enabled submit', async () => {
    renderDatesHoursModal()

    await waitFor(() => {
      expect(screen.getByLabelText('Rechercher')).toBeEnabled()
    })

    expect(screen).toMatchSnapshot()
  })

  describe('should show', () => {
    it("the calendar when picking 'Date précise'", async () => {
      mockSearchState = {
        ...searchState,
        date: { option: DATE_FILTER_OPTIONS.TODAY, selectedDate: TODAY.toISOString() },
      }
      renderDatesHoursModal()

      expect(screen.queryByText('Choisis une date')).not.toBeOnTheScreen()

      await user.press(screen.getByText('Date précise'))

      expect(screen.getByText('Choisis une date')).toBeOnTheScreen()
    })

    it("the correct date when picking 'Date précise'", async () => {
      mockSearchState = {
        ...searchState,
        date: { option: DATE_FILTER_OPTIONS.USER_PICK, selectedDate: TOMORROW.toISOString() },
      }
      renderDatesHoursModal()

      expect(await screen.findByText('Samedi 29 octobre 2022')).toBeOnTheScreen()
    })

    it('by default time range defined in search state', async () => {
      mockSearchState = {
        ...searchState,
        timeRange: [18, 22],
      }
      renderDatesHoursModal()

      expect(await screen.findByText(`18\u00a0h et 22\u00a0h`)).toBeOnTheScreen()
    })
  })

  it('should hide and show the CalendarPicker', async () => {
    mockSearchState = {
      ...searchState,
      date: { option: DATE_FILTER_OPTIONS.USER_PICK, selectedDate: TODAY.toISOString() },
    }
    renderDatesHoursModal()

    const radioButton = screen.getByTestId(
      `${RadioButtonDate.PRECISE_DATE} ${formatToCompleteFrenchDate({ date: TODAY })}`
    )

    await user.press(radioButton)

    expect(screen.getByText('Choisis une date')).toBeOnTheScreen()

    await user.press(radioButton)

    expect(screen.getByText('Choisis une date')).toBeOnTheScreen()
  })

  describe('should desactivate', () => {
    it('toggle date when pressing reset button', async () => {
      mockSearchState = {
        ...searchState,
      }
      renderDatesHoursModal()

      const toggleDate = screen.getByTestId('Interrupteur date')
      await user.press(toggleDate)

      expect(toggleDate.props.accessibilityState.checked).toEqual(true)

      const resetButton = screen.getByText('Réinitialiser')
      await user.press(resetButton)

      expect(toggleDate.props.accessibilityState.checked).toEqual(false)
    })

    it('toggle hour when pressing reset button', async () => {
      mockSearchState = {
        ...searchState,
      }
      renderDatesHoursModal()

      const toggleHour = screen.getByTestId('Interrupteur hour')
      await user.press(toggleHour)

      expect(toggleHour.props.accessibilityState.checked).toEqual(true)

      const resetButton = screen.getByText('Réinitialiser')
      await user.press(resetButton)

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

        const toggleDate = screen.getByTestId('Interrupteur date')
        await user.press(toggleDate)

        const radioButton = screen.getByTestId(option)
        await user.press(radioButton)

        expect(radioButton.props.accessibilityState).toEqual({ checked: true })

        const resetButton = await screen.findByText('Réinitialiser')
        await act(async () => {
          // userEvent.press not working correctly here
          // eslint-disable-next-line local-rules/no-fireEvent
          fireEvent.press(resetButton)
          // eslint-disable-next-line local-rules/no-fireEvent
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

        const toggleDate = screen.getByTestId('Interrupteur date')
        await user.press(toggleDate)

        const radioButton = screen.getByTestId(option)
        await user.press(radioButton)

        expect(radioButton.props.accessibilityState).toEqual({ checked: true })

        await act(async () => {
          // userEvent.press not working correctly here
          // eslint-disable-next-line local-rules/no-fireEvent
          fireEvent.press(toggleDate)
          // eslint-disable-next-line local-rules/no-fireEvent
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

      const toggleHour = screen.getByTestId('Interrupteur hour')
      await user.press(toggleHour)

      expect(toggleHour.props.accessibilityState.checked).toEqual(true)

      await act(async () => {
        const slider = screen.getByTestId('slider').children[0] as ReactTestInstance
        slider.props.onValuesChange([18, 23])
      })

      expect(screen.getByText(`18\u00a0h et 23\u00a0h`)).toBeOnTheScreen()

      const resetButton = screen.getByText('Réinitialiser')
      await user.press(resetButton)

      await user.press(toggleHour)

      expect(screen.getByText(`8\u00a0h et 22\u00a0h`)).toBeOnTheScreen()
    })

    it('time range selected when deactivating hour toggle', async () => {
      mockSearchState = {
        ...searchState,
      }
      renderDatesHoursModal()

      const toggleHour = screen.getByTestId('Interrupteur hour')
      await user.press(toggleHour)

      await act(async () => {
        const slider = screen.getByTestId('slider').children[0] as ReactTestInstance
        slider.props.onValuesChange([18, 23])
      })

      expect(screen.getByText(`18\u00a0h et 23\u00a0h`)).toBeOnTheScreen()

      await user.press(toggleHour)
      await user.press(toggleHour)

      expect(screen.getByText(`8\u00a0h et 22\u00a0h`)).toBeOnTheScreen()
    })
  })

  it('should close the modal when pressing previous button', async () => {
    renderDatesHoursModal()

    await screen.findByLabelText('Rechercher')

    const previousButton = screen.getByTestId('Fermer')
    await user.press(previousButton)

    expect(mockHideModal).toHaveBeenCalledTimes(1)
  })

  describe('should activate by default', () => {
    it('date toggle when date defined in search state', async () => {
      mockSearchState = {
        ...searchState,
        date: { selectedDate: TODAY.toISOString(), option: DATE_FILTER_OPTIONS.TODAY },
      }
      renderDatesHoursModal()

      const toggleDate = screen.getByTestId('Interrupteur date')

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

      const toggleHour = screen.getByTestId('Interrupteur date')

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
        expect(screen.getByText('Appliquer le filtre')).toBeOnTheScreen()
        expect(screen.getByText('Appliquer le filtre')).toBeEnabled()
      })
    })

    it('should update search state when pressing submit button', async () => {
      mockSearchState = {
        ...searchState,
      }
      renderDatesHoursModal({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })

      const toggleDate = screen.getByTestId('Interrupteur date')
      await act(async () => {
        // With userEvent, test too long to execute for the CI
        // eslint-disable-next-line local-rules/no-fireEvent
        fireEvent.press(toggleDate)
      })

      const radioButton = screen.getByText(RadioButtonDate.WEEK)
      await act(async () => {
        // eslint-disable-next-line local-rules/no-fireEvent
        fireEvent.press(radioButton)
      })

      const searchButton = screen.getByText('Appliquer le filtre')
      await act(async () => {
        // eslint-disable-next-line local-rules/no-fireEvent
        fireEvent.press(searchButton)
      })

      const expectedSearchParams: SearchState = {
        ...searchState,
        date: {
          option: DATE_FILTER_OPTIONS.CURRENT_WEEK,
          selectedDate: '2022-10-28T00:00:00.000Z',
        },
      }

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: expectedSearchParams,
      })
    })
  })

  describe('with "Recherche" button', () => {
    describe('should set search state view on search results', () => {
      it('with actual state without change when pressing button', async () => {
        mockSearchState = {
          ...searchState,
        }
        renderDatesHoursModal()

        const searchButton = await screen.findByLabelText('Rechercher')

        await user.press(searchButton)

        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'SET_STATE',
          payload: mockSearchState,
        })
      })

      it.each(DATE_TYPES)(
        'with %s date filter when toggle date activated and pressing button',
        async ({ label, type }) => {
          mockSearchState = {
            ...searchState,
          }
          renderDatesHoursModal()

          const toggleDate = screen.getByTestId('Interrupteur date')
          await act(async () => {
            // With userEvent, test too long to execute for the CI
            // eslint-disable-next-line local-rules/no-fireEvent
            fireEvent.press(toggleDate)
          })

          const radioButton = screen.getByTestId(label)
          await act(async () => {
            // eslint-disable-next-line local-rules/no-fireEvent
            fireEvent.press(radioButton)
          })

          const searchButton = screen.getByText('Rechercher')
          await act(async () => {
            // eslint-disable-next-line local-rules/no-fireEvent
            fireEvent.press(searchButton)
          })

          expect(mockDispatch).toHaveBeenCalledWith({
            type: 'SET_STATE',
            payload: {
              ...mockSearchState,
              date: { selectedDate: TODAY.toISOString(), option: type },
            },
          })
        }
      )

      it('with a time range filter when toggle hour activated and pressing button', async () => {
        mockSearchState = {
          ...searchState,
        }
        renderDatesHoursModal()

        const toggleHour = screen.getByTestId('Interrupteur hour')
        await act(async () => {
          // With userEvent, test too long to execute for the CI
          // eslint-disable-next-line local-rules/no-fireEvent
          fireEvent.press(toggleHour)
        })

        await act(async () => {
          const slider = screen.getByTestId('slider').children[0] as ReactTestInstance
          slider.props.onValuesChangeFinish([18, 23])
        })

        const searchButton = screen.getByText('Rechercher')
        await act(async () => {
          // eslint-disable-next-line local-rules/no-fireEvent
          fireEvent.press(searchButton)
        })

        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'SET_STATE',
          payload: {
            ...mockSearchState,
            timeRange: [18, 23],
          },
        })
      })

      it('without beginning & ending date when pressing button', async () => {
        mockSearchState = {
          ...searchState,
          beginningDatetime: TODAY.toISOString(),
          endingDatetime: TOMORROW.toISOString(),
        }
        renderDatesHoursModal()

        const searchButton = await screen.findByLabelText('Rechercher')
        await user.press(searchButton)

        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'SET_STATE',
          payload: {
            ...mockSearchState,
            beginningDatetime: UNDEFINED_DATE,
            endingDatetime: UNDEFINED_DATE,
          },
        })
      })
    })
  })

  describe('Modal header buttons', () => {
    it('should close the modal and general filter page when pressing close button when the modal is opening from general filter page', async () => {
      renderDatesHoursModal({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
        onClose: mockOnClose,
      })

      const closeButton = screen.getByTestId('Fermer')
      await user.press(closeButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should only close the modal when pressing close button when the modal is opening from search results', async () => {
      renderDatesHoursModal()

      const closeButton = screen.getByTestId('Fermer')
      await user.press(closeButton)

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
