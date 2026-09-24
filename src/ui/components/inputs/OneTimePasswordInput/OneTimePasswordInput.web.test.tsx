import React from 'react'

import { render, screen, userEvent } from 'tests/utils/web'

import { OneTimePasswordInput } from './OneTimePasswordInput'

const user = userEvent.setup()

const defaultProps = {
  label: 'Saisis le code de vérification',
  code: ['', '', '', '', '', ''],
  onCodeChange: jest.fn(),
}

describe('OneTimePasswordInput - web', () => {
  beforeEach(() => jest.clearAllMocks())

  it('should clear the current value when backspace is pressed on a filled input', async () => {
    const onCodeChange = jest.fn()

    render(
      <OneTimePasswordInput
        {...defaultProps}
        code={['1', '2', '', '', '', '']}
        onCodeChange={onCodeChange}
      />
    )

    const secondInput = screen.getByLabelText('Saisis le code de vérification - caractère 2 sur 6')

    await user.click(secondInput)
    await user.keyboard('{Backspace}')

    expect(onCodeChange).toHaveBeenCalledWith(['1', '', '', '', '', ''])
  })

  it('should clear the previous input when backspace is pressed on an empty input', async () => {
    const onCodeChange = jest.fn()

    render(
      <OneTimePasswordInput
        {...defaultProps}
        code={['1', '2', '', '', '', '']}
        onCodeChange={onCodeChange}
      />
    )

    const thirdInput = screen.getByLabelText('Saisis le code de vérification - caractère 3 sur 6')

    await user.click(thirdInput)
    await user.keyboard('{Backspace}')

    expect(onCodeChange).toHaveBeenCalledWith(['1', '', '', '', '', ''])
  })

  it('should not change the code when backspace is pressed on the first empty input', async () => {
    const onCodeChange = jest.fn()

    render(<OneTimePasswordInput {...defaultProps} onCodeChange={onCodeChange} />)

    const firstInput = screen.getByLabelText('Saisis le code de vérification - caractère 1 sur 6')

    await user.click(firstInput)
    await user.keyboard('{Backspace}')

    expect(onCodeChange).not.toHaveBeenCalled()
  })
})
