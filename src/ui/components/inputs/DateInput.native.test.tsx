import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'
import waitForExpect from 'wait-for-expect'

import { fireEvent, render } from 'tests/utils'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

import { DateInput, DateInputLabelText, DateInputRef } from './DateInput'

const findStyledByTestId = (instance: ReactTestInstance, testID: string) => {
  return instance.find(
    (instance) => instance?.props?.testID === testID && !!instance?.props?.style?.length
  )
}
describe('DateInput Component', () => {
  it('should render ref and give access to clearFocuses function', () => {
    // given
    const myRef = React.createRef<DateInputRef>()
    render(<DateInput ref={myRef} />)

    expect(myRef.current).toBeTruthy()
    expect(myRef.current && myRef.current.clearFocuses).toBeTruthy()
  })

  it('should render hiddenInput', () => {
    const { getByTestId } = render(
      <DateInput initialDay={'25'} initialMonth={'10'} initialYear={'1991'} />
    )

    const hiddenInput = getByTestId('Entrée pour la date de naissance')
    expect(hiddenInput).toBeTruthy()
  })

  it('should render hiddenInput with correct initialDate input value', () => {
    const { getByTestId } = render(
      <DateInput initialDay={'25'} initialMonth={'10'} initialYear={'1991'} />
    )

    const hiddenInput = getByTestId('Entrée pour la date de naissance')
    expect(hiddenInput).toBeTruthy()
    expect(hiddenInput.props.value).toBe('25101991')
  })

  it('should render hiddenInput with empty initialDate input value', () => {
    const { getByTestId } = render(<DateInput />)

    const hiddenInput = getByTestId('Entrée pour la date de naissance')
    expect(hiddenInput).toBeTruthy()
    expect(hiddenInput.props.value).toBe('')
  })

  it('should render date part labels', () => {
    const { getByTestId } = render(<DateInput />)

    const dayEntry = getByTestId('Entrée pour le jour de la date de naissance')
    const monthEntry = getByTestId('Entrée pour le mois de la date de naissance')
    const yearEntry = getByTestId("Entrée pour l'année jour de la date de naissance")

    expect(dayEntry).toBeTruthy()
    expect(monthEntry).toBeTruthy()
    expect(yearEntry).toBeTruthy()

    const dayEntryLabel = dayEntry.findByType(DateInputLabelText)
    const monthEntryLabel = monthEntry.findByType(DateInputLabelText)
    const yearEntryLabel = yearEntry.findByType(DateInputLabelText)

    expect(dayEntryLabel).toBeTruthy()
    expect(monthEntryLabel).toBeTruthy()
    expect(yearEntryLabel).toBeTruthy()

    expect(dayEntryLabel.props.children).toBe('JJ')
    expect(monthEntryLabel.props.children).toBe('MM')
    expect(yearEntryLabel.props.children).toBe('AAAA')
  })

  it('should render date part labels with existing date', () => {
    const { getByTestId } = render(
      <DateInput initialDay={'25'} initialMonth={'10'} initialYear={'1991'} />
    )

    const dayEntry = getByTestId('Entrée pour le jour de la date de naissance')
    const monthEntry = getByTestId('Entrée pour le mois de la date de naissance')
    const yearEntry = getByTestId("Entrée pour l'année jour de la date de naissance")

    expect(dayEntry).toBeTruthy()
    expect(monthEntry).toBeTruthy()
    expect(yearEntry).toBeTruthy()

    const dayEntryLabel = dayEntry.findByType(DateInputLabelText)
    const monthEntryLabel = monthEntry.findByType(DateInputLabelText)
    const yearEntryLabel = yearEntry.findByType(DateInputLabelText)

    expect(dayEntryLabel).toBeTruthy()
    expect(monthEntryLabel).toBeTruthy()
    expect(yearEntryLabel).toBeTruthy()

    expect(dayEntryLabel.props.children).toBe('25')
    expect(monthEntryLabel.props.children).toBe('10')
    expect(yearEntryLabel.props.children).toBe('1991')
  })

  it('should be valid with correct date', async () => {
    const { getByTestId } = render(
      <DateInput initialDay={'25'} initialMonth={'10'} initialYear={'1991'} />
    )

    const dayEntry = getByTestId('Entrée pour le jour de la date de naissance')
    const monthEntry = getByTestId('Entrée pour le mois de la date de naissance')
    const yearEntry = getByTestId("Entrée pour l'année jour de la date de naissance")

    expect(dayEntry).toBeTruthy()
    expect(monthEntry).toBeTruthy()
    expect(yearEntry).toBeTruthy()

    const styledDayEntryBar = findStyledByTestId(dayEntry, 'date-input-validation-bar')
    const styledMonthEntryBar = findStyledByTestId(dayEntry, 'date-input-validation-bar')
    const styledYearEntryBar = findStyledByTestId(dayEntry, 'date-input-validation-bar')

    expect(styledDayEntryBar).toBeTruthy()
    expect(styledMonthEntryBar).toBeTruthy()
    expect(styledYearEntryBar).toBeTruthy()

    expect(styledDayEntryBar.props.style[0].backgroundColor).toEqual(ColorsEnum.GREEN_VALID)
    expect(styledMonthEntryBar.props.style[0].backgroundColor).toEqual(ColorsEnum.GREEN_VALID)
    expect(styledYearEntryBar.props.style[0].backgroundColor).toEqual(ColorsEnum.GREEN_VALID)
  })

  it('should be invalid with incorrect date', () => {
    const { getByTestId } = render(
      <DateInput initialDay={'45'} initialMonth={'13'} initialYear={'9000'} />
    )

    const dayEntry = getByTestId('Entrée pour le jour de la date de naissance')
    const monthEntry = getByTestId('Entrée pour le mois de la date de naissance')

    expect(dayEntry).toBeTruthy()
    expect(monthEntry).toBeTruthy()

    const styledDayEntryBar = findStyledByTestId(dayEntry, 'date-input-validation-bar')
    const styledMonthEntryBar = findStyledByTestId(dayEntry, 'date-input-validation-bar')

    expect(styledDayEntryBar).toBeTruthy()
    expect(styledMonthEntryBar).toBeTruthy()

    expect(styledDayEntryBar.props.style[0].backgroundColor).toEqual(ColorsEnum.ERROR)
    expect(styledMonthEntryBar.props.style[0].backgroundColor).toEqual(ColorsEnum.ERROR)
  })

  it('should be gray with empty date', async () => {
    const { getByTestId } = render(<DateInput />)

    const dayEntry = getByTestId('Entrée pour le jour de la date de naissance')
    const monthEntry = getByTestId('Entrée pour le mois de la date de naissance')
    const yearEntry = getByTestId("Entrée pour l'année jour de la date de naissance")

    expect(dayEntry).toBeTruthy()
    expect(monthEntry).toBeTruthy()
    expect(yearEntry).toBeTruthy()

    const styledDayEntryBar = findStyledByTestId(dayEntry, 'date-input-validation-bar')
    const styledMonthEntryBar = findStyledByTestId(dayEntry, 'date-input-validation-bar')
    const styledYearEntryBar = findStyledByTestId(dayEntry, 'date-input-validation-bar')

    expect(styledDayEntryBar).toBeTruthy()
    expect(styledMonthEntryBar).toBeTruthy()
    expect(styledYearEntryBar).toBeTruthy()

    expect(styledDayEntryBar.props.style[0].backgroundColor).toEqual(ColorsEnum.GREY_MEDIUM)
    expect(styledMonthEntryBar.props.style[0].backgroundColor).toEqual(ColorsEnum.GREY_MEDIUM)
    expect(styledYearEntryBar.props.style[0].backgroundColor).toEqual(ColorsEnum.GREY_MEDIUM)
  })

  it('should use day focus correctly', async () => {
    const { getByTestId } = render(
      <DateInput initialDay={'25'} initialMonth={'10'} initialYear={'1991'} />
    )

    const hiddenInput = getByTestId('Entrée pour la date de naissance')
    expect(hiddenInput).toBeTruthy()

    const dayLabel = getByTestId('Entrée pour le jour de la date de naissance')
    const monthLabel = getByTestId('Entrée pour le mois de la date de naissance')
    const yearLabel = getByTestId("Entrée pour l'année jour de la date de naissance")

    expect(dayLabel).toBeTruthy()
    expect(monthLabel).toBeTruthy()
    expect(yearLabel).toBeTruthy()
    await fireEvent.press(dayLabel)

    const dayLabelText = findStyledByTestId(dayLabel, 'date-input-label-text')
    const monthLabelText = findStyledByTestId(monthLabel, 'date-input-label-text')
    const yearLabelText = findStyledByTestId(yearLabel, 'date-input-label-text')

    expect(dayLabelText).toBeTruthy()
    expect(monthLabelText).toBeTruthy()
    expect(yearLabelText).toBeTruthy()

    await waitForExpect(() => {
      expect(hiddenInput.props.value).toBe('')
      expect((dayLabelText.children[0] as ReactTestInstance).children[0]).toBe('JJ')
      expect((monthLabelText.children[0] as ReactTestInstance).children[0]).toBe('MM')
      expect((yearLabelText.children[0] as ReactTestInstance).children[0]).toBe('AAAA')
    })
  })

  it('should use month focus correctly', async () => {
    const { getByTestId } = render(
      <DateInput initialDay={'25'} initialMonth={'10'} initialYear={'1991'} />
    )

    const hiddenInput = getByTestId('Entrée pour la date de naissance')
    expect(hiddenInput).toBeTruthy()

    const dayLabel = getByTestId('Entrée pour le jour de la date de naissance')
    const monthLabel = getByTestId('Entrée pour le mois de la date de naissance')
    const yearLabel = getByTestId("Entrée pour l'année jour de la date de naissance")

    expect(dayLabel).toBeTruthy()
    expect(monthLabel).toBeTruthy()
    expect(yearLabel).toBeTruthy()

    fireEvent.press(monthLabel)

    const dayLabelText = findStyledByTestId(dayLabel, 'date-input-label-text')
    const monthLabelText = findStyledByTestId(monthLabel, 'date-input-label-text')
    const yearLabelText = findStyledByTestId(yearLabel, 'date-input-label-text')

    expect(dayLabelText).toBeTruthy()
    expect(monthLabelText).toBeTruthy()
    expect(yearLabelText).toBeTruthy()

    await waitForExpect(() => {
      expect(hiddenInput.props.value).toBe('25')
      expect((dayLabelText.children[0] as ReactTestInstance).children[0]).toBe('25')
      expect((monthLabelText.children[0] as ReactTestInstance).children[0]).toBe('MM')
      expect((yearLabelText.children[0] as ReactTestInstance).children[0]).toBe('AAAA')
    })
  })

  it('should use year focus correctly', async () => {
    const { getByTestId } = render(
      <DateInput initialDay={'25'} initialMonth={'10'} initialYear={'1991'} />
    )

    const hiddenInput = getByTestId('Entrée pour la date de naissance')
    expect(hiddenInput).toBeTruthy()

    const dayLabel = getByTestId('Entrée pour le jour de la date de naissance')
    const monthLabel = getByTestId('Entrée pour le mois de la date de naissance')
    const yearLabel = getByTestId("Entrée pour l'année jour de la date de naissance")

    expect(dayLabel).toBeTruthy()
    expect(monthLabel).toBeTruthy()
    expect(yearLabel).toBeTruthy()
    await fireEvent.press(yearLabel)

    const dayLabelText = findStyledByTestId(dayLabel, 'date-input-label-text')
    const monthLabelText = findStyledByTestId(monthLabel, 'date-input-label-text')
    const yearLabelText = findStyledByTestId(yearLabel, 'date-input-label-text')

    expect(dayLabelText).toBeTruthy()
    expect(monthLabelText).toBeTruthy()
    expect(yearLabelText).toBeTruthy()

    await waitForExpect(() => {
      expect(hiddenInput.props.value).toBe('2510')
      expect((dayLabelText.children[0] as ReactTestInstance).children[0]).toBe('25')
      expect((monthLabelText.children[0] as ReactTestInstance).children[0]).toBe('10')
      expect((yearLabelText.children[0] as ReactTestInstance).children[0]).toBe('AAAA')
    })
  })

  it('should call onChangeValue with correct date', () => {
    const onChangeValue = jest.fn()
    const { getByTestId } = render(
      <DateInput
        initialDay={'25'}
        initialMonth={'10'}
        initialYear={'1991'}
        onChangeValue={onChangeValue}
      />
    )

    const hiddenInput = getByTestId('Entrée pour la date de naissance')
    expect(hiddenInput).toBeTruthy()

    expect(onChangeValue).toHaveBeenCalledWith(new Date('1991-10-25'), {
      isComplete: true,
      isValid: true,
      isDateAboveMin: true,
      isDateBelowMax: true,
    })
  })

  it('should call onChangeValue with incorrect date', () => {
    const onChangeValue = jest.fn()
    const { getByTestId } = render(
      <DateInput
        initialDay={'25'}
        initialMonth={'13'}
        initialYear={'1991'}
        onChangeValue={onChangeValue}
      />
    )

    const hiddenInput = getByTestId('Entrée pour la date de naissance')
    expect(hiddenInput).toBeTruthy()

    expect(onChangeValue).toHaveBeenCalledWith(null, {
      isComplete: false,
      isValid: false,
      isDateAboveMin: true,
      isDateBelowMax: true,
    })
  })

  it('should call onChangeValue with incomplete date', async () => {
    const onChangeValue = jest.fn()
    const { getByTestId } = render(
      <DateInput
        initialDay={'25'}
        initialMonth={'13'}
        initialYear={'1991'}
        onChangeValue={onChangeValue}
      />
    )

    const hiddenInput = getByTestId('Entrée pour la date de naissance')
    expect(hiddenInput).toBeTruthy()

    const monthLabel = getByTestId('Entrée pour le mois de la date de naissance')
    fireEvent.press(monthLabel)
    await waitForExpect(() => {
      expect(onChangeValue).toHaveBeenCalledWith(null, {
        isComplete: false,
        isValid: false,
        isDateAboveMin: true,
        isDateBelowMax: true,
      })
    })
  })
})
