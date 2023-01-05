import React, { ComponentProps } from 'react'

import { act, fireEvent, render } from 'tests/utils'
import { SUGGESTION_DELAY_IN_MS } from 'ui/components/inputs/EmailInputWithSpellingHelp/useEmailSpellingHelp'

import { EmailInputWithSpellingHelp } from './EmailInputWithSpellingHelp'

const props: ComponentProps<typeof EmailInputWithSpellingHelp> = {
  email: '',
  label: 'Adresse email',
  onEmailChange: jest.fn(),
}

jest.useFakeTimers()

describe('<EmailInputWithSpellingHelp />', () => {
  it('should not display suggestion for empty email', () => {
    const { queryByText } = render(<EmailInputWithSpellingHelp {...props} email="" />)

    const suggestionButton = queryByText('Appliquer la modification')
    expect(suggestionButton).toBeFalsy()
  })

  it('should display suggestion with a corrected email when the email is mystyped', async () => {
    const { queryByText, rerender } = render(<EmailInputWithSpellingHelp {...props} />)

    await act(async () => {
      rerender(<EmailInputWithSpellingHelp {...props} email="firstname.lastname@gmal.com" />)
    })

    await act(async () => {
      jest.advanceTimersByTime(SUGGESTION_DELAY_IN_MS)
    })

    const suggestionButton = queryByText('Veux-tu plutôt dire firstname.lastname@gmail.com')
    expect(suggestionButton).toBeTruthy()
  })

  it('should add suggestion to the input when user select the suggestion', async () => {
    const { getByText, rerender } = render(<EmailInputWithSpellingHelp {...props} />)

    await act(async () => {
      rerender(<EmailInputWithSpellingHelp {...props} email="firstname.lastname@gmal.com" />)
    })

    await act(async () => {
      jest.advanceTimersByTime(SUGGESTION_DELAY_IN_MS)
    })

    const suggestionButton = getByText('Appliquer la modification')
    fireEvent.press(suggestionButton)

    expect(props.onEmailChange).toHaveBeenNthCalledWith(1, 'firstname.lastname@gmail.com')
  })
})
