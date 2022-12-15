import emailSpellChecker from '@zootools/email-spell-checker'
import { MailSuggestion } from '@zootools/email-spell-checker/dist/lib/types'
import debounce from 'lodash/debounce'
import React, { useEffect, useRef, useState } from 'react'

import { EmailInput } from 'ui/components/inputs/EmailInput/EmailInput'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Typo } from 'ui/theme'

const SpellingHelp = ({
  suggestedEmail,
  onEmailChange,
}: {
  suggestedEmail: MailSuggestion
  onEmailChange: (email: string) => void
}) => {
  const replaceEmail = () => {
    onEmailChange(suggestedEmail.full)
  }

  return (
    <Touchable onPress={replaceEmail}>
      <Typo.Caption>
        {suggestedEmail.address}@<Typo.ButtonText>{suggestedEmail.domain}</Typo.ButtonText>
      </Typo.Caption>
    </Touchable>
  )
}

export const EmailInputWithSpellingHelp: typeof EmailInput = (props) => {
  const [suggestedEmail, setSuggestedEmail] = useState<MailSuggestion | undefined>(
    emailSpellChecker.run({
      email: props.email,
    })
  )
  const onEmailChange = (email: string) => {
    props.onEmailChange(email)
    setSuggestedEmail(undefined)
  }
  const debouncedSetSuggestedEmail = useRef(
    debounce((email) => {
      setSuggestedEmail(
        emailSpellChecker.run({
          email,
        })
      )
    }, 600)
  ).current

  useEffect(() => {
    debouncedSetSuggestedEmail(props.email)
  }, [debouncedSetSuggestedEmail, props.email])

  return (
    <React.Fragment>
      <EmailInput {...props} />
      {!!suggestedEmail && (
        <SpellingHelp suggestedEmail={suggestedEmail} onEmailChange={onEmailChange} />
      )}
    </React.Fragment>
  )
}
