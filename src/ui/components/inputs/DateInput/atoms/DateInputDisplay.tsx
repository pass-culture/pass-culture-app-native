import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { formatToFrenchDate } from 'libs/parsers/formatDates'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { ContainerWithMaxWidth } from 'ui/components/inputs/ContainerWithMaxWidth'
import { InputContainer } from 'ui/components/inputs/InputContainer'
import { LabelContainer } from 'ui/components/inputs/LabelContainer'
import { Typo } from 'ui/theme'

interface Props {
  date: Date
  isError?: boolean
}

export function DateInputDisplay({ date, isError }: Props) {
  const dateInputID = uuidv4()
  const label = 'Date de naissance'
  return (
    <ContainerWithMaxWidth gap={2}>
      <LabelContainer>
        <InputLabel htmlFor={dateInputID}>{label}</InputLabel>
      </LabelContainer>
      <InputContainer isError={isError}>
        <Typo.Body nativeID={dateInputID}>{formatToFrenchDate(date)}</Typo.Body>
      </InputContainer>
    </ContainerWithMaxWidth>
  )
}
