// TODO(antoinewg): remmove dependency
import Color from 'color'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { render } from 'tests/utils/web'
import { ColorsEnum } from 'ui/theme'

import { DateInput, DateInputRef } from './DateInput'

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
      <DateInput initialDay="25" initialMonth="10" initialYear="1991" />
    )

    const hiddenInput = getByTestId('Entrée pour la date de naissance')
    expect(hiddenInput).toBeTruthy()
  })

  it('should render hiddenInput with correct initialDate input value', () => {
    const { getByTestId } = render(
      <DateInput initialDay="25" initialMonth="10" initialYear="1991" />
    )

    const hiddenInput = getByTestId('Entrée pour la date de naissance')
    expect(hiddenInput).toBeTruthy()
    expect(hiddenInput.getAttribute('value')).toBe('25101991')
  })

  it('should render hiddenInput with empty initialDate input value', () => {
    const { getByTestId } = render(<DateInput />)

    const hiddenInput = getByTestId('Entrée pour la date de naissance')
    expect(hiddenInput).toBeTruthy()
    expect(hiddenInput.getAttribute('value')).toBe('')
  })

  it('should render date part labels', () => {
    const { getByTestId } = render(<DateInput />)

    const dayLabel = getByTestId('Entrée pour le jour de la date de naissance')
    const monthLabel = getByTestId('Entrée pour le mois de la date de naissance')
    const yearLabel = getByTestId("Entrée pour l'année jour de la date de naissance")

    expect(dayLabel).toBeTruthy()
    expect(monthLabel).toBeTruthy()
    expect(yearLabel).toBeTruthy()
    expect(dayLabel.textContent?.trim?.()).toBe('JJ')
    expect(monthLabel.textContent?.trim?.()).toBe('MM')
    expect(yearLabel.textContent?.trim?.()).toBe('AAAA')
  })

  it('should render date part labels with existing date', () => {
    const { getByTestId } = render(
      <DateInput initialDay="25" initialMonth="10" initialYear="1991" />
    )

    const dayLabel = getByTestId('Entrée pour le jour de la date de naissance')
    const monthLabel = getByTestId('Entrée pour le mois de la date de naissance')
    const yearLabel = getByTestId("Entrée pour l'année jour de la date de naissance")

    expect(dayLabel).toBeTruthy()
    expect(monthLabel).toBeTruthy()
    expect(yearLabel).toBeTruthy()
    expect(dayLabel.textContent?.trim?.()).toBe('25')
    expect(monthLabel.textContent?.trim?.()).toBe('10')
    expect(yearLabel.textContent?.trim?.()).toBe('1991')
  })

  it('should be valid with correct date', async () => {
    const { getByTestId } = render(
      <DateInput initialDay="25" initialMonth="10" initialYear="1991" />
    )

    const hiddenInput = getByTestId('Entrée pour la date de naissance')
    expect(hiddenInput).toBeTruthy()

    const dayLabel = getByTestId('Entrée pour le jour de la date de naissance')
    const monthLabel = getByTestId('Entrée pour le mois de la date de naissance')
    const yearLabel = getByTestId("Entrée pour l'année jour de la date de naissance")

    const dayBar = dayLabel.querySelector<HTMLDivElement>(
      `div[data-testid="date-input-validation-bar"]`
    )
    const monthBar = monthLabel.querySelector<HTMLDivElement>(
      `div[data-testid="date-input-validation-bar"]`
    )
    const yearBar = yearLabel.querySelector<HTMLDivElement>(
      `div[data-testid="date-input-validation-bar"]`
    )

    expect(dayBar).toBeTruthy()
    expect(monthBar).toBeTruthy()
    expect(yearBar).toBeTruthy()

    await waitForExpect(() => {
      expect(Color(dayBar?.style?.backgroundColor).hex().toUpperCase()).toBe(
        ColorsEnum.GREEN_VALID.toUpperCase()
      )
      expect(Color(monthBar?.style?.backgroundColor).hex().toUpperCase()).toBe(
        ColorsEnum.GREEN_VALID.toUpperCase()
      )
      expect(Color(yearBar?.style?.backgroundColor).hex().toUpperCase()).toBe(
        ColorsEnum.GREEN_VALID.toUpperCase()
      )
    })
  })

  it('should be invalid with incorrect date', async () => {
    const { getByTestId } = render(
      <DateInput initialDay="45" initialMonth="13" initialYear="9000" />
    )

    const hiddenInput = getByTestId('Entrée pour la date de naissance')
    expect(hiddenInput).toBeTruthy()

    const dayLabel = getByTestId('Entrée pour le jour de la date de naissance')
    const monthLabel = getByTestId('Entrée pour le mois de la date de naissance')

    const dayBar = dayLabel.querySelector<HTMLDivElement>(
      `div[data-testid="date-input-validation-bar"]`
    )
    const monthBar = monthLabel.querySelector<HTMLDivElement>(
      `div[data-testid="date-input-validation-bar"]`
    )

    expect(dayBar).toBeTruthy()
    expect(monthBar).toBeTruthy()

    await waitForExpect(() => {
      expect(Color(dayBar?.style?.backgroundColor).hex().toUpperCase()).toBe(
        ColorsEnum.ERROR.toUpperCase()
      )
      expect(Color(monthBar?.style?.backgroundColor).hex().toUpperCase()).toBe(
        ColorsEnum.ERROR.toUpperCase()
      )
    })
  })

  it('should be gray with empty date', async () => {
    const { getByTestId } = render(<DateInput />)

    const hiddenInput = getByTestId('Entrée pour la date de naissance')
    expect(hiddenInput).toBeTruthy()

    const dayLabel = getByTestId('Entrée pour le jour de la date de naissance')
    const monthLabel = getByTestId('Entrée pour le mois de la date de naissance')
    const yearLabel = getByTestId("Entrée pour l'année jour de la date de naissance")

    const dayBar = dayLabel.querySelector<HTMLDivElement>(
      `div[data-testid="date-input-validation-bar"]`
    )
    const monthBar = monthLabel.querySelector<HTMLDivElement>(
      `div[data-testid="date-input-validation-bar"]`
    )
    const yearBar = yearLabel.querySelector<HTMLDivElement>(
      `div[data-testid="date-input-validation-bar"]`
    )

    expect(dayBar).toBeTruthy()
    expect(monthBar).toBeTruthy()
    expect(yearBar).toBeTruthy()

    await waitForExpect(() => {
      expect(Color(dayBar?.style?.backgroundColor).hex().toUpperCase()).toBe(
        ColorsEnum.GREY_MEDIUM.toUpperCase()
      )
      expect(Color(monthBar?.style?.backgroundColor).hex().toUpperCase()).toBe(
        ColorsEnum.GREY_MEDIUM.toUpperCase()
      )
      expect(Color(yearBar?.style?.backgroundColor).hex().toUpperCase()).toBe(
        ColorsEnum.GREY_MEDIUM.toUpperCase()
      )
    })
  })

  it('should use day focus correctly', async () => {
    const { getByTestId } = render(
      <DateInput initialDay="25" initialMonth="10" initialYear="1991" />
    )

    const hiddenInput = getByTestId('Entrée pour la date de naissance')
    expect(hiddenInput).toBeTruthy()

    const dayLabel = getByTestId('Entrée pour le jour de la date de naissance')
    const monthLabel = getByTestId('Entrée pour le mois de la date de naissance')
    const yearLabel = getByTestId("Entrée pour l'année jour de la date de naissance")

    dayLabel?.click?.()

    await waitForExpect(() => {
      expect(hiddenInput.getAttribute('value')).toBe('')
      expect(dayLabel.textContent).toBe('JJ')
      expect(monthLabel.textContent).toBe('MM')
      expect(yearLabel.textContent).toBe('AAAA')
    })
  })

  it('should use month focus correctly', async () => {
    const { getByTestId } = render(
      <DateInput initialDay="25" initialMonth="10" initialYear="1991" />
    )

    const hiddenInput = getByTestId('Entrée pour la date de naissance')
    expect(hiddenInput).toBeTruthy()

    const dayLabel = getByTestId('Entrée pour le jour de la date de naissance')
    const monthLabel = getByTestId('Entrée pour le mois de la date de naissance')
    const yearLabel = getByTestId("Entrée pour l'année jour de la date de naissance")

    monthLabel?.click?.()

    await waitForExpect(() => {
      expect(hiddenInput.getAttribute('value')).toBe('25')
      expect(dayLabel.textContent).toBe('25')
      expect(monthLabel.textContent).toBe('MM')
      expect(yearLabel.textContent).toBe('AAAA')
    })
  })

  it('should use year focus correctly', async () => {
    const { getByTestId } = render(
      <DateInput initialDay="25" initialMonth="10" initialYear="1991" />
    )

    const hiddenInput = getByTestId('Entrée pour la date de naissance')
    expect(hiddenInput).toBeTruthy()

    const dayLabel = getByTestId('Entrée pour le jour de la date de naissance')
    const monthLabel = getByTestId('Entrée pour le mois de la date de naissance')
    const yearLabel = getByTestId("Entrée pour l'année jour de la date de naissance")

    yearLabel?.click?.()

    await waitForExpect(() => {
      expect(hiddenInput.getAttribute('value')).toBe('2510')
      expect(dayLabel.textContent).toBe('25')
      expect(monthLabel.textContent).toBe('10')
      expect(yearLabel.textContent).toBe('AAAA')
    })
  })

  it('should call onChangeValue with correct date', () => {
    const onChangeValue = jest.fn()
    const { getByTestId } = render(
      <DateInput
        initialDay="25"
        initialMonth="10"
        initialYear="1991"
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
        initialDay="25"
        initialMonth="13"
        initialYear="1991"
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
        initialDay="25"
        initialMonth="13"
        initialYear="1991"
        onChangeValue={onChangeValue}
      />
    )

    const hiddenInput = getByTestId('Entrée pour la date de naissance')
    expect(hiddenInput).toBeTruthy()

    const monthLabel = getByTestId('Entrée pour le mois de la date de naissance')

    monthLabel?.click?.()
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
