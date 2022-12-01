import userEvent from '@testing-library/user-event'
import React from 'react'

import { act, render } from 'tests/utils/web'

import { Checkbox } from './Checkbox'

describe('<Checkbox />', () => {
  it('should render an accessible checkbox', () => {
    const { getByRole } = render(
      <Checkbox label="I agree to disagree" isChecked={false} onPress={jest.fn()} />
    )

    const checkbox = getByRole('checkbox')

    expect(checkbox).toBeTruthy()
  })

  it('is linked to his label', () => {
    const label = 'I agree to disagree'
    const { getByLabelText, getByRole } = render(
      <Checkbox label={label} isChecked={false} onPress={jest.fn()} />
    )

    expect(getByLabelText(label)).toEqual(getByRole('checkbox'))
  })

  it('can be checked with checkbox', async () => {
    const label = 'I agree to disagree'
    const onPressMock = jest.fn()
    const { getByLabelText } = render(
      <Checkbox label={label} isChecked={false} onPress={onPressMock} />
    )

    await act(async () => {
      await userEvent.click(getByLabelText(label))
    })

    expect(onPressMock).toHaveBeenCalledTimes(1)
  })

  it('can be checked with label', async () => {
    const label = 'I agree to disagree'
    const onPressMock = jest.fn()
    const { getByText } = render(<Checkbox label={label} isChecked={false} onPress={onPressMock} />)

    await act(async () => {
      await userEvent.click(getByText(label))
    })

    expect(onPressMock).toHaveBeenCalledTimes(1)
  })

  it("doesn't change the checked state when taping space and doesn't having the focus", async () => {
    const label = 'I agree to disagree'
    const onPressMock = jest.fn()
    render(<Checkbox label={label} isChecked={false} onPress={onPressMock} />)

    await userEvent.keyboard('[Space]')

    expect(onPressMock).not.toHaveBeenCalled()
  })

  it('pressing space key should check the box when it has focus', async () => {
    const label = 'I agree to disagree'
    const onPressMock = jest.fn()
    render(<Checkbox label={label} isChecked={false} onPress={onPressMock} />)

    await userEvent.tab()
    await userEvent.keyboard('[Space]')

    expect(onPressMock).toHaveBeenCalledTimes(1)
  })

  it('have aria-checked attribute when checkbox is checked', async () => {
    const { getByRole } = render(
      <Checkbox label="I agree to disagree" isChecked onPress={jest.fn()} />
    )

    const checkbox = getByRole('checkbox')

    expect(checkbox.getAttribute('aria-checked')).toBe('true')
  })

  it('have aria-checked attribute when checkbox is unchecked', async () => {
    const { getByRole } = render(
      <Checkbox label="I agree to disagree" isChecked={false} onPress={jest.fn()} />
    )

    const checkbox = getByRole('checkbox')

    expect(checkbox.getAttribute('aria-checked')).toBe('false')
  })
})
