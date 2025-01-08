import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { formatToFrenchDate } from 'libs/parsers/formatDates'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { ContainerWithMaxWidth } from 'ui/components/inputs/ContainerWithMaxWidth'
import { InputContainer } from 'ui/components/inputs/InputContainer'
import { LabelContainer } from 'ui/components/inputs/LabelContainer'
import { Spacer, TypoDS } from 'ui/theme'

interface Props {
  date: Date
  isError?: boolean
}

export function DateInputDisplay({ date, isError }: Props) {
  const dateInputID = uuidv4()
  const label = 'Date de naissance'
  return (
    <ContainerWithMaxWidth>
      <LabelContainer>
        <InputLabel htmlFor={dateInputID}>{label}</InputLabel>
      </LabelContainer>
      <Spacer.Column numberOfSpaces={2} />
      <InputContainer isError={isError}>
        <TypoDS.Body nativeID={dateInputID}>{formatToFrenchDate(date)}</TypoDS.Body>
      </InputContainer>
    </ContainerWithMaxWidth>
  )
}
