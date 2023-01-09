import React, { ComponentProps } from 'react'

import { EmailInput } from 'ui/components/inputs/EmailInput/EmailInput'
import { useEmailSpellingHelp } from 'ui/components/inputs/EmailInputWithSpellingHelp/useEmailSpellingHelp'
import { Spacer } from 'ui/theme'

import { SpellingHelp } from './SpellingHelp'

export const EmailInputWithSpellingHelp = ({
  onEmailChange,
  ...props
}: ComponentProps<typeof EmailInput>) => {
  const { suggestedEmail } = useEmailSpellingHelp({
    email: props.email,
  })

  return (
    <React.Fragment>
      <EmailInput {...props} onEmailChange={onEmailChange} />
      {!!suggestedEmail && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={2} />
          <SpellingHelp suggestedEmail={suggestedEmail} onEmailChange={onEmailChange} />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}
