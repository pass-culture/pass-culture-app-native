import userEvent from '@testing-library/user-event'
import React from 'react'

import { act, render, screen } from 'tests/utils/web'

import { Checkbox } from './Checkbox'

describe('<Checkbox />', () => {
  it('should render an accessible checkbox', () => {
    render(<Checkbox label="I agree to disagree" isChecked={false} onPress={jest.fn()} />)

    const checkbox = screen.getByRole('checkbox')

    expect(checkbox).toBeTruthy()
  })

  it('is linked to his label', () => {
    const label = 'I agree to disagree'
    render(<Checkbox label={label} isChecked={false} onPress={jest.fn()} />)

    expect(screen.getByLabelText(label)).toEqual(screen.getByRole('checkbox'))
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

    expect(onPressMock).toHaveBeenCalledWith(true)
  })

  it('can be checked with label', async () => {
    const label = 'I agree to disagree'
    const onPressMock = jest.fn()
    const { getByText } = render(<Checkbox label={label} isChecked={false} onPress={onPressMock} />)

    await act(async () => {
      await userEvent.click(getByText(label))
    })

    expect(onPressMock).toHaveBeenCalledWith(true)
  })

  describe('toggle his state', () => {
    it('check the box when is unchecked', async () => {
      const onPressMock = jest.fn()
      render(<Checkbox label={'I agree to disagree'} isChecked={false} onPress={onPressMock} />)

      await act(async () => {
        await userEvent.click(screen.getByRole('checkbox'))
      })

      expect(onPressMock).toHaveBeenCalledWith(true)
    })

    it('uncheck the box when is checked', async () => {
      const onPressMock = jest.fn()
      render(<Checkbox label={'I agree to disagree'} isChecked onPress={onPressMock} />)

      await act(async () => {
        await userEvent.click(screen.getByRole('checkbox'))
      })

      expect(onPressMock).toHaveBeenCalledWith(false)
    })
  })

  describe('when pressing space', () => {
    it("doesn't change the checked state when doesn't having the focus", async () => {
      const onPressMock = jest.fn()
      render(<Checkbox label={'I agree to disagree'} isChecked={false} onPress={onPressMock} />)

      await userEvent.keyboard('[Space]')

      expect(onPressMock).not.toHaveBeenCalled()
    })

    describe('when it has focus', () => {
      it('check the box when is unchecked', async () => {
        const onPressMock = jest.fn()
        render(<Checkbox label={'I agree to disagree'} isChecked={false} onPress={onPressMock} />)

        await userEvent.tab()
        await userEvent.keyboard('[Space]')

        expect(onPressMock).toHaveBeenCalledWith(true)
      })

      it('uncheck the box and is checked', async () => {
        const onPressMock = jest.fn()
        render(<Checkbox label={'I agree to disagree'} isChecked onPress={onPressMock} />)

        await userEvent.tab()
        await userEvent.keyboard('[Space]')

        expect(onPressMock).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('have aria-checked attribute', () => {
    it('checked when checkbox is checked', async () => {
      render(<Checkbox label="I agree to disagree" isChecked onPress={jest.fn()} />)

      const checkbox = screen.getByRole('checkbox')

      expect(checkbox.getAttribute('aria-checked')).toBe('true')
    })

    it('not checked when checkbox is unchecked', async () => {
      render(<Checkbox label="I agree to disagree" isChecked={false} onPress={jest.fn()} />)

      const checkbox = screen.getByRole('checkbox')

      expect(checkbox.getAttribute('aria-checked')).toBe('false')
    })
  })
})
