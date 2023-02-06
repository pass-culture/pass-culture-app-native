import React from 'react'
import { useForm, ErrorOption } from 'react-hook-form'

import { EmailInputController } from 'shared/forms/controllers/EmailInputController'
import { act, fireEvent, render, screen } from 'tests/utils'
import { SUGGESTION_DELAY_IN_MS } from 'ui/components/inputs/EmailInputWithSpellingHelp/useEmailSpellingHelp'

type EmailForm = {
  email: string
}

jest.useFakeTimers()

describe('<EmailInputController />', () => {
  it('should show error when form input is invalid', () => {
    renderEmailInputController({
      error: { type: 'custom', message: 'Email has an incorrect format' },
    })

    expect(screen.getByText('Email has an incorrect format')).toBeTruthy()
  })

  it('should not show error when form input is invalid', () => {
    renderEmailInputController({})

    expect(screen.queryByText('error')).toBeFalsy()
  })

  it('should not show spelling help when not asked', async () => {
    renderEmailInputController({})

    const input = screen.getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(input, 'firstname.lastname@gmal.com')

    await act(async () => {
      jest.advanceTimersByTime(SUGGESTION_DELAY_IN_MS)
    })

    expect(screen.queryByText('Veux-tu plutôt dire firstname.lastname@gmail.com ?')).toBeFalsy()
  })

  it('should show spelling help when asked', async () => {
    renderEmailInputController({ withSpellingHelp: true })

    const input = screen.getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(input, 'firstname.lastname@gmal.com')

    await act(async () => {
      jest.advanceTimersByTime(SUGGESTION_DELAY_IN_MS)
    })
    expect(screen.getByText('Veux-tu plutôt dire firstname.lastname@gmail.com ?')).toBeTruthy()
  })

  it('should perform action on spelling help press when given', async () => {
    const mockOnSpellingHelpPress = jest.fn()
    renderEmailInputController({
      withSpellingHelp: true,
      onSpellingHelpPress: mockOnSpellingHelpPress,
    })

    const input = screen.getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(input, 'firstname.lastname@gmal.com')

    await screen.findByText('Veux-tu plutôt dire firstname.lastname@gmail.com ?')

    const suggestionButton = screen.getByText('Appliquer la modification')
    fireEvent.press(suggestionButton)
    expect(mockOnSpellingHelpPress).toHaveBeenCalledTimes(1)
  })
})

const renderEmailInputController = ({
  withSpellingHelp,
  error,
  onSpellingHelpPress,
}: {
  withSpellingHelp?: boolean
  error?: ErrorOption
  onSpellingHelpPress?: () => void
}) => {
  const EmailForm = () => {
    const { control, setError } = useForm<EmailForm>({
      defaultValues: { email: '' },
    })

    if (error) setError('email', error)
    return (
      <EmailInputController
        control={control}
        name="email"
        label="ton adresse email"
        withSpellingHelp={withSpellingHelp}
        onSpellingHelpPress={onSpellingHelpPress}
      />
    )
  }
  render(<EmailForm />)
}
