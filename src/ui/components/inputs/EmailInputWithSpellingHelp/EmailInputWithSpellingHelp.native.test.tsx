import React, { ComponentProps } from 'react'

import { act, render } from 'tests/utils'
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
    const { queryByRole } = render(<EmailInputWithSpellingHelp {...props} email="" />)

    const button = queryByRole('button')
    expect(button).toBeNull()
  })

  it('should display suggestion with a corrected email when the email is mystyped', async () => {
    const { getByRole, rerender } = render(<EmailInputWithSpellingHelp {...props} />)

    await act(async () => {
      rerender(<EmailInputWithSpellingHelp {...props} email="firstname.lastname@gmal.com" />)
    })

    await act(async () => {
      jest.advanceTimersByTime(SUGGESTION_DELAY_IN_MS)
    })

    const button = getByRole('button')
    expect(button).toHaveTextContent('firstname.lastname@gmail.com')
  })
})
