import mockdate from 'mockdate'
import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'
import { v4 as uuidv4 } from 'uuid'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialSearchState } from 'features/search/context/reducer'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { SectionTitle } from 'features/search/helpers/titles'
import { DatesHoursModal } from 'features/search/pages/modals/DatesHoursModal/DatesHoursModal'
import { SearchView } from 'features/search/types'
import { analytics } from 'libs/firebase/analytics'
import { act, fireEvent, render, superFlushWithAct } from 'tests/utils'

const searchId = uuidv4()
const searchState = { ...initialSearchState, searchId }
let mockSearchState = searchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
  }),
}))

const hideDatesHoursModal = jest.fn()

const TODAY = new Date(2022, 9, 28)
const TOMORROW = new Date(2022, 9, 29)
const UNDEFINED_DATE = undefined

describe('<DatesHoursModal/>', () => {
  beforeAll(() => {
    mockdate.set(TODAY)
  })

  it('should render modal correctly after animation and with enabled submit', async () => {
    jest.useFakeTimers()
    const renderAPI = renderDatesHoursModal({ hideDatesHoursModal })
    await superFlushWithAct()
    expect(renderAPI).toMatchSnapshot()
  })

  describe('should show', () => {
    it("the calendar when picking 'Date précise'", async () => {
      mockSearchState = {
        ...searchState,
        date: { option: DATE_FILTER_OPTIONS.TODAY, selectedDate: TODAY.toISOString() },
      }
      const { getByText, toJSON } = renderDatesHoursModal({ hideDatesHoursModal })

      let component = toJSON()
      if (Array.isArray(component)) {
        expect(component).not.toContain('CalendarPicker')
        expect(component).toContain('NoCalendar')
      }

      await act(async () => {
        fireEvent.press(getByText('Date précise'))
      })
      component = toJSON()
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
      const { getByText } = renderDatesHoursModal({ hideDatesHoursModal })
      await act(async () => {
        expect(getByText('Samedi 29 octobre 2022')).toBeTruthy()
      })
    })

    it('by default time range defined in search state', async () => {
      mockSearchState = {
        ...searchState,
        timeRange: [18, 22],
      }
      const { getByText } = renderDatesHoursModal({ hideDatesHoursModal })

      await act(async () => {
        expect(getByText(`18\u00a0h et 22\u00a0h`)).toBeTruthy()
      })
    })
  })

  it('should hide and show the CalendarPicker', async () => {
    mockSearchState = {
      ...searchState,
      date: { option: DATE_FILTER_OPTIONS.USER_PICK, selectedDate: TODAY.toISOString() },
    }
    const { getByTestId, toJSON } = renderDatesHoursModal({ hideDatesHoursModal })

    await act(async () => {
      fireEvent.press(getByTestId(DATE_FILTER_OPTIONS.USER_PICK))
    })

    const withCalendar = toJSON()
    if (Array.isArray(withCalendar)) {
      expect(withCalendar).toContain('CalendarPicker')
      expect(withCalendar).not.toContain('NoCalendar')
    }

    await act(async () => {
      fireEvent.press(getByTestId(DATE_FILTER_OPTIONS.USER_PICK))
    })

    const withoutCalendar = toJSON()
    if (Array.isArray(withoutCalendar)) {
      expect(withoutCalendar).toContain('CalendarPicker')
      expect(withoutCalendar).not.toContain('NoCalendar')
    }
  })

  describe('should navigate on search results', () => {
    it('with actual state without change when pressing search button', async () => {
      mockSearchState = {
        ...searchState,
        view: SearchView.Results,
      }
      const { getByText } = renderDatesHoursModal({ hideDatesHoursModal })

      await superFlushWithAct()

      const searchButton = getByText('Rechercher')
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

    it.each([
      [DATE_FILTER_OPTIONS.TODAY],
      [DATE_FILTER_OPTIONS.CURRENT_WEEK],
      [DATE_FILTER_OPTIONS.CURRENT_WEEK_END],
    ])(
      'with %s date filter when toggle date activated and pressing search button',
      async (option: DATE_FILTER_OPTIONS) => {
        mockSearchState = {
          ...searchState,
        }
        const { getByTestId, getByText } = renderDatesHoursModal({ hideDatesHoursModal })

        const toggleDate = getByTestId('Interrupteur-date')
        await act(async () => {
          fireEvent.press(toggleDate)
        })

        const radioButton = getByTestId(option)
        await act(async () => {
          fireEvent.press(radioButton)
        })

        const searchButton = getByText('Rechercher')
        await act(async () => {
          fireEvent.press(searchButton)
        })

        expect(navigate).toHaveBeenCalledWith('TabNavigator', {
          params: {
            ...mockSearchState,
            date: { selectedDate: TODAY.toISOString(), option },
            view: SearchView.Results,
          },
          screen: 'Search',
        })
      }
    )

    it('with a time range filter when toggle hour activated and pressing search button', async () => {
      mockSearchState = {
        ...searchState,
      }
      const { getByTestId, getByText } = renderDatesHoursModal({ hideDatesHoursModal })

      const toggleHour = getByTestId('Interrupteur-hour')
      await act(async () => {
        fireEvent.press(toggleHour)
      })

      await act(async () => {
        const slider = getByTestId('slider').children[0] as ReactTestInstance
        slider.props.onValuesChangeFinish([18, 23])
      })

      const searchButton = getByText('Rechercher')
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

    it('without beginning & ending date when pressing search button', async () => {
      mockSearchState = {
        ...searchState,
        beginningDatetime: TODAY.toISOString(),
        endingDatetime: TOMORROW.toISOString(),
      }
      const { getByText } = renderDatesHoursModal({ hideDatesHoursModal })

      await superFlushWithAct()

      const searchButton = getByText('Rechercher')
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

  describe('should log', () => {
    it('when pressing date toggle', async () => {
      mockSearchState = {
        ...searchState,
      }
      const { getByTestId } = renderDatesHoursModal({ hideDatesHoursModal })

      const toggleDate = getByTestId('Interrupteur-date')
      await act(async () => {
        fireEvent.press(toggleDate)
      })

      expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Date, searchId)
    })

    it('when pressing hour toggle', async () => {
      mockSearchState = {
        ...searchState,
      }
      const { getByTestId } = renderDatesHoursModal({ hideDatesHoursModal })

      const toggleHour = getByTestId('Interrupteur-hour')
      await act(async () => {
        fireEvent.press(toggleHour)
      })

      expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Hour, searchId)
    })

    it.each([
      [DATE_FILTER_OPTIONS.TODAY],
      [DATE_FILTER_OPTIONS.CURRENT_WEEK],
      [DATE_FILTER_OPTIONS.CURRENT_WEEK_END],
      [DATE_FILTER_OPTIONS.USER_PICK],
    ])('when pressing %s radio button', async (option: DATE_FILTER_OPTIONS) => {
      const { getByTestId } = renderDatesHoursModal({ hideDatesHoursModal })

      const toggleDate = getByTestId('Interrupteur-date')
      await act(async () => {
        fireEvent.press(toggleDate)
      })

      const radioButton = getByTestId(option)
      await act(async () => {
        fireEvent.press(radioButton)
      })

      expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.OfferDate, searchId)
    })

    it('when pressing slider time range button', async () => {
      const { getByTestId } = renderDatesHoursModal({ hideDatesHoursModal })

      const toggleHour = getByTestId('Interrupteur-hour')
      await act(async () => {
        fireEvent.press(toggleHour)
      })

      await act(async () => {
        const slider = getByTestId('slider').children[0] as ReactTestInstance
        slider.props.onValuesChangeFinish([18, 23])
      })

      expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.TimeSlot, searchId)
    })
  })

  describe('should desactivate', () => {
    it('toggle date when pressing reset button', async () => {
      mockSearchState = {
        ...searchState,
      }
      const { getByTestId, getByText } = renderDatesHoursModal({ hideDatesHoursModal })

      const toggleDate = getByTestId('Interrupteur-date')
      await act(async () => {
        fireEvent.press(toggleDate)
      })
      expect(toggleDate.props.accessibilityState.checked).toEqual(true)

      const resetButton = getByText('Réinitialiser')
      await act(async () => {
        fireEvent.press(resetButton)
      })
      expect(toggleDate.props.accessibilityState.checked).toEqual(false)
    })

    it('toggle hour when pressing reset button', async () => {
      mockSearchState = {
        ...searchState,
      }
      const { getByTestId, getByText } = renderDatesHoursModal({ hideDatesHoursModal })

      const toggleHour = getByTestId('Interrupteur-hour')
      await act(async () => {
        fireEvent.press(toggleHour)
      })
      expect(toggleHour.props.accessibilityState.checked).toEqual(true)

      const resetButton = getByText('Réinitialiser')
      await act(async () => {
        fireEvent.press(resetButton)
      })
      expect(toggleHour.props.accessibilityState.checked).toEqual(false)
    })
  })

  describe('should reset', () => {
    it.each([
      [DATE_FILTER_OPTIONS.CURRENT_WEEK],
      [DATE_FILTER_OPTIONS.CURRENT_WEEK_END],
      [DATE_FILTER_OPTIONS.USER_PICK],
    ])('%s radio button when pressing reset button', async (option: DATE_FILTER_OPTIONS) => {
      mockSearchState = {
        ...searchState,
      }
      const { getByTestId, getByText } = renderDatesHoursModal({ hideDatesHoursModal })

      const toggleDate = getByTestId('Interrupteur-date')
      await act(async () => {
        fireEvent.press(toggleDate)
      })

      const radioButton = getByTestId(option)
      await act(async () => {
        fireEvent.press(radioButton)
      })
      expect(radioButton.props.accessibilityState).toEqual({ checked: true })

      const resetButton = getByText('Réinitialiser')
      await act(async () => {
        fireEvent.press(resetButton)
        fireEvent.press(toggleDate)
      })

      expect(radioButton.props.accessibilityState).toEqual({ checked: false })
    })

    it.each([
      [DATE_FILTER_OPTIONS.CURRENT_WEEK],
      [DATE_FILTER_OPTIONS.CURRENT_WEEK_END],
      [DATE_FILTER_OPTIONS.USER_PICK],
    ])('%s radio button when desactivating date toggle', async (option: DATE_FILTER_OPTIONS) => {
      mockSearchState = {
        ...searchState,
      }
      const { getByTestId } = renderDatesHoursModal({ hideDatesHoursModal })

      const toggleDate = getByTestId('Interrupteur-date')
      await act(async () => {
        fireEvent.press(toggleDate)
      })

      const radioButton = getByTestId(option)
      await act(async () => {
        fireEvent.press(radioButton)
      })
      expect(radioButton.props.accessibilityState).toEqual({ checked: true })

      await act(async () => {
        fireEvent.press(toggleDate)
        fireEvent.press(toggleDate)
      })

      expect(radioButton.props.accessibilityState).toEqual({ checked: false })
    })

    it('time range selected when pressing reset button', async () => {
      mockSearchState = {
        ...searchState,
      }
      const { getByTestId, getByText } = renderDatesHoursModal({ hideDatesHoursModal })

      const toggleHour = getByTestId('Interrupteur-hour')
      await act(async () => {
        fireEvent.press(toggleHour)
      })
      expect(toggleHour.props.accessibilityState.checked).toEqual(true)

      await act(async () => {
        const slider = getByTestId('slider').children[0] as ReactTestInstance
        slider.props.onValuesChangeFinish([18, 23])
      })
      expect(getByText(`18\u00a0h et 23\u00a0h`)).toBeTruthy()

      const resetButton = getByText('Réinitialiser')
      await act(async () => {
        fireEvent.press(resetButton)
        fireEvent.press(toggleHour)
      })
      expect(getByText(`8\u00a0h et 22\u00a0h`)).toBeTruthy()
    })

    it('time range selected when desactivating hour toggle', async () => {
      mockSearchState = {
        ...searchState,
      }
      const { getByTestId, getByText } = renderDatesHoursModal({ hideDatesHoursModal })

      const toggleHour = getByTestId('Interrupteur-hour')
      await act(async () => {
        fireEvent.press(toggleHour)
      })

      await act(async () => {
        const slider = getByTestId('slider').children[0] as ReactTestInstance
        slider.props.onValuesChangeFinish([18, 23])
      })
      expect(getByText(`18\u00a0h et 23\u00a0h`)).toBeTruthy()

      await act(async () => {
        fireEvent.press(toggleHour)
        fireEvent.press(toggleHour)
      })
      expect(getByText(`8\u00a0h et 22\u00a0h`)).toBeTruthy()
    })
  })

  it('should close the modal when pressing previous button', async () => {
    const { getByTestId } = renderDatesHoursModal({ hideDatesHoursModal })

    await superFlushWithAct()

    const previousButton = getByTestId('backButton')
    fireEvent.press(previousButton)

    expect(hideDatesHoursModal).toHaveBeenCalledTimes(1)
  })

  describe('should activate by default', () => {
    it('date toggle when date defined in search state', async () => {
      mockSearchState = {
        ...searchState,
        date: { selectedDate: TODAY.toISOString(), option: DATE_FILTER_OPTIONS.TODAY },
      }
      const { getByTestId } = renderDatesHoursModal({ hideDatesHoursModal })

      const toggleDate = getByTestId('Interrupteur-date')

      await act(async () => {
        expect(toggleDate.props.accessibilityState.checked).toEqual(true)
      })
    })

    it('hour toggle when time range defined in search state', async () => {
      mockSearchState = {
        ...searchState,
        date: { selectedDate: TODAY.toISOString(), option: DATE_FILTER_OPTIONS.TODAY },
      }
      const { getByTestId } = renderDatesHoursModal({ hideDatesHoursModal })

      const toggleHour = getByTestId('Interrupteur-date')

      await act(async () => {
        expect(toggleHour.props.accessibilityState.checked).toEqual(true)
      })
    })
  })

  describe('should select by default', () => {
    it.each([
      [DATE_FILTER_OPTIONS.TODAY],
      [DATE_FILTER_OPTIONS.CURRENT_WEEK],
      [DATE_FILTER_OPTIONS.CURRENT_WEEK_END],
      [DATE_FILTER_OPTIONS.USER_PICK],
    ])('%s radio button when date defined in search state', async (option: DATE_FILTER_OPTIONS) => {
      mockSearchState = {
        ...searchState,
        date: { selectedDate: TODAY.toISOString(), option },
      }
      const { getByTestId } = renderDatesHoursModal({ hideDatesHoursModal })

      const radioButton = getByTestId(option)
      await act(async () => {
        expect(radioButton.props.accessibilityState).toEqual({ checked: true })
      })
    })
  })
})

type Props = {
  hideDatesHoursModal: () => void
}

function renderDatesHoursModal({ hideDatesHoursModal }: Props) {
  return render(
    <DatesHoursModal
      title="Dates & heures"
      accessibilityLabel="Ne pas filtrer sur les dates et heures puis retourner aux résultats"
      isVisible
      hideModal={hideDatesHoursModal}
    />
  )
}
