import React from 'react'

import { render, screen, userEvent } from 'tests/utils'

import { OneTimePasswordInput } from './OneTimePasswordInput'

const user = userEvent.setup()

const defaultProps = {
  label: 'Saisis le code de vérification',
  code: ['', '', '', '', '', ''],
  onCodeChange: jest.fn(),
}

describe('OneTimePasswordInput', () => {
  beforeEach(() => jest.clearAllMocks())

  it('should render the expected number of inputs', () => {
    render(<OneTimePasswordInput {...defaultProps} />)

    expect(screen.getAllByLabelText(/Saisis le code de vérification - caractère/)).toHaveLength(6)
  })

  it('should render the custom number of inputs', () => {
    render(<OneTimePasswordInput {...defaultProps} numberOfInputs={4} code={['', '', '', '']} />)

    expect(screen.getAllByLabelText(/Saisis le code de vérification - caractère/)).toHaveLength(4)
  })

  it('should display the expected format according to the number of inputs', () => {
    const { rerender } = render(<OneTimePasswordInput {...defaultProps} />)

    expect(screen.getByText('Format : 538299', { includeHiddenElements: true })).toBeOnTheScreen()

    rerender(<OneTimePasswordInput {...defaultProps} numberOfInputs={4} code={['', '', '', '']} />)

    expect(screen.getByText('Format : 5382', { includeHiddenElements: true })).toBeOnTheScreen()

    rerender(
      <OneTimePasswordInput
        {...defaultProps}
        numberOfInputs={8}
        code={['', '', '', '', '', '', '', '']}
      />
    )

    expect(screen.getByText('Format : 53829953', { includeHiddenElements: true })).toBeOnTheScreen()
  })

  it('should call onCodeChange when a character is entered', async () => {
    const onCodeChange = jest.fn()
    render(<OneTimePasswordInput {...defaultProps} onCodeChange={onCodeChange} />)

    const firstInput = screen.getByLabelText('Saisis le code de vérification - caractère 1 sur 6')
    await user.type(firstInput, '1')

    expect(onCodeChange).toHaveBeenCalledWith(['1', '', '', '', '', ''])
  })

  it('should transform letters to uppercase', async () => {
    const onCodeChange = jest.fn()
    render(<OneTimePasswordInput {...defaultProps} onCodeChange={onCodeChange} />)

    const firstInput = screen.getByLabelText('Saisis le code de vérification - caractère 1 sur 6')
    await user.type(firstInput, 'a')

    expect(onCodeChange).toHaveBeenCalledWith(['A', '', '', '', '', ''])
  })

  it('should transform pasted letters to uppercase', async () => {
    const onCodeChange = jest.fn()
    render(<OneTimePasswordInput {...defaultProps} onCodeChange={onCodeChange} />)

    const firstInput = screen.getByLabelText('Saisis le code de vérification - caractère 1 sur 6')
    await user.paste(firstInput, 'aBc123')

    expect(onCodeChange).toHaveBeenCalledWith(['A', 'B', 'C', '1', '2', '3'])
  })

  it('should only keep the expected number of characters when pasting', async () => {
    const onCodeChange = jest.fn()
    render(<OneTimePasswordInput {...defaultProps} onCodeChange={onCodeChange} />)

    const firstInput = screen.getByLabelText('Saisis le code de vérification - caractère 1 sur 6')
    await user.paste(firstInput, '123456789')

    expect(onCodeChange).toHaveBeenCalledWith(['1', '2', '3', '4', '5', '6'])
  })

  it('should update the character at the focused index', async () => {
    const onCodeChange = jest.fn()
    render(
      <OneTimePasswordInput
        {...defaultProps}
        code={['1', '', '', '', '', '']}
        onCodeChange={onCodeChange}
      />
    )

    const secondInput = screen.getByLabelText('Saisis le code de vérification - caractère 2 sur 6')
    await user.type(secondInput, '2')

    expect(onCodeChange).toHaveBeenCalledWith(['1', '2', '', '', '', ''])
  })

  it('should display an error when the code contains invalid characters', () => {
    render(<OneTimePasswordInput {...defaultProps} code={['1', 'A', '3', '4', '5', '6']} />)

    expect(
      screen.getByText('Le code saisi est invalide.', { includeHiddenElements: true })
    ).toBeOnTheScreen()
  })

  it('should display the custom error message', () => {
    render(<OneTimePasswordInput {...defaultProps} errorMessage="Erreur customisée" />)

    expect(screen.getByText('Erreur customisée', { includeHiddenElements: true })).toBeOnTheScreen()
  })

  it('should display the required indicator when explicitly requested', () => {
    render(<OneTimePasswordInput {...defaultProps} requiredIndicator="explicit" />)

    expect(screen.getByText('Obligatoire', { includeHiddenElements: true })).toBeOnTheScreen()
  })

  it('should display the required symbol when requested', () => {
    render(<OneTimePasswordInput {...defaultProps} requiredIndicator="symbol" />)

    expect(
      screen.getByText('Saisis le code de vérification *', { includeHiddenElements: true })
    ).toBeOnTheScreen()
  })

  it('should expose an accessible label for each input', () => {
    render(<OneTimePasswordInput {...defaultProps} />)

    expect(
      screen.getByLabelText('Saisis le code de vérification - caractère 1 sur 6')
    ).toBeOnTheScreen()

    expect(
      screen.getByLabelText('Saisis le code de vérification - caractère 6 sur 6')
    ).toBeOnTheScreen()
  })
})
