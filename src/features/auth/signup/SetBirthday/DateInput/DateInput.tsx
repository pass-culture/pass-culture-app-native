import { t } from '@lingui/macro'
import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { formatToFrenchDate } from 'libs/parsers'
import { InputLabel } from 'ui/components/InputLabel'
import { InputContainer } from 'ui/components/inputs/InputContainer'
import { LabelContainer } from 'ui/components/inputs/LabelContainer'
import { StyledInputContainer } from 'ui/components/inputs/StyledInputContainer'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  date: Date
}

export function DateInput({ date }: Props) {
  const dateInputID = uuidv4()
  return (
    <InputContainer>
      <LabelContainer>
        <InputLabel htmlFor={dateInputID}>{t`Date de naissance`}</InputLabel>
      </LabelContainer>
      <Spacer.Column numberOfSpaces={2} />
      <StyledInputContainer>
        <Typo.Body nativeID={dateInputID}>{formatToFrenchDate(date)}</Typo.Body>
      </StyledInputContainer>
    </InputContainer>
  )
}
