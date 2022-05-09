import { t } from '@lingui/macro'
import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { formatToFrenchDate } from 'libs/parsers'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { ContainerWithMaxWidth } from 'ui/components/inputs/ContainerWithMaxWidth'
import { InputContainer } from 'ui/components/inputs/InputContainer'
import { LabelContainer } from 'ui/components/inputs/LabelContainer'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  date: Date
  isError?: boolean
}

export function DateInputDisplay({ date, isError }: Props) {
  const dateInputID = uuidv4()
  return (
    <ContainerWithMaxWidth>
      <LabelContainer>
        <InputLabel htmlFor={dateInputID}>{t`Date de naissance`}</InputLabel>
      </LabelContainer>
      <Spacer.Column numberOfSpaces={2} />
      <InputContainer isError={isError}>
        <Typo.Body nativeID={dateInputID}>{formatToFrenchDate(date)}</Typo.Body>
      </InputContainer>
    </ContainerWithMaxWidth>
  )
}
