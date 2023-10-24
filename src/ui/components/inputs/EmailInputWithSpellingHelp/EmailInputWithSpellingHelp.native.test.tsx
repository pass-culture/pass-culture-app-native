import React, { ComponentProps } from 'react'

import { act, fireEvent, render, screen } from 'tests/utils'
import { SUGGESTION_DELAY_IN_MS } from 'ui/components/inputs/EmailInputWithSpellingHelp/useEmailSpellingHelp'

import { EmailInputWithSpellingHelp } from './EmailInputWithSpellingHelp'

const mockOnSpellingHelpPress = jest.fn()
const props: ComponentProps<typeof EmailInputWithSpellingHelp> = {
  email: '',
  label: 'Adresse email',
  onEmailChange: jest.fn(),
  onSpellingHelpPress: mockOnSpellingHelpPress,
}

jest.useFakeTimers({ legacyFakeTimers: true })

describe('<EmailInputWithSpellingHelp />', () => {
  it('should not display suggestion for empty email', () => {
    render(<EmailInputWithSpellingHelp {...props} email="" />)

    const suggestionButton = screen.queryByText('Appliquer la modification')

    expect(suggestionButton).not.toBeOnTheScreen()
  })

  it('should display suggestion with a corrected email when the email is mystyped', async () => {
    const { rerender } = render(<EmailInputWithSpellingHelp {...props} />)

    await act(async () => {
      rerender(<EmailInputWithSpellingHelp {...props} email="firstname.lastname@gmal.com" />)
    })

    await act(async () => {
      jest.advanceTimersByTime(SUGGESTION_DELAY_IN_MS)
    })

    const suggestionButton = screen.queryByText(
      'Veux-tu plutôt dire firstname.lastname@gmail.com ?'
    )

    expect(suggestionButton).toBeOnTheScreen()
  })

  it('should add suggestion to the input when user select the suggestion', async () => {
    const { rerender } = render(<EmailInputWithSpellingHelp {...props} />)

    await act(async () => {
      rerender(<EmailInputWithSpellingHelp {...props} email="firstname.lastname@gmal.com" />)
    })

    await act(async () => {
      jest.advanceTimersByTime(SUGGESTION_DELAY_IN_MS)
    })

    const suggestionButton = screen.getByText('Appliquer la modification')
    fireEvent.press(suggestionButton)

    expect(props.onEmailChange).toHaveBeenNthCalledWith(1, 'firstname.lastname@gmail.com')
  })

  it('should call onSpellingHelpPress when user select the suggestion', async () => {
    const { rerender } = render(<EmailInputWithSpellingHelp {...props} />)

    await act(async () => {
      rerender(<EmailInputWithSpellingHelp {...props} email="firstname.lastname@gmal.com" />)
    })

    await act(async () => {
      jest.advanceTimersByTime(SUGGESTION_DELAY_IN_MS)
    })

    const suggestionButton = screen.getByText('Appliquer la modification')
    fireEvent.press(suggestionButton)

    expect(mockOnSpellingHelpPress).toHaveBeenCalledTimes(1)
  })
})
