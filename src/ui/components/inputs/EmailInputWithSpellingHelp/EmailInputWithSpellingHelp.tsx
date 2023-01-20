import React, { ComponentProps } from 'react'

import { EmailInput } from 'ui/components/inputs/EmailInput/EmailInput'
import { useEmailSpellingHelp } from 'ui/components/inputs/EmailInputWithSpellingHelp/useEmailSpellingHelp'

import { SpellingHelp } from './SpellingHelp'

interface EmailInputWithSpellingHelpProps extends ComponentProps<typeof EmailInput> {
  onSpellingHelpPress?: () => void
}

export const EmailInputWithSpellingHelp = ({
  onEmailChange,
  onSpellingHelpPress,
  ...props
}: EmailInputWithSpellingHelpProps) => {
  const { suggestedEmail } = useEmailSpellingHelp({
    email: props.email,
  })

  return (
    <React.Fragment>
      <EmailInput {...props} onEmailChange={onEmailChange} />
      <SpellingHelp
        suggestedEmail={suggestedEmail}
        onEmailChange={onEmailChange}
        onSpellingHelpPress={onSpellingHelpPress}
      />
    </React.Fragment>
  )
}
