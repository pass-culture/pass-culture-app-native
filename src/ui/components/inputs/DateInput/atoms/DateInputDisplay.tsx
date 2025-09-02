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
  errorMessage?: string
}

export function DateInputDisplay({ date, errorMessage }: Props) {
  const dateInputID = uuidv4()
  const label = 'Date de naissance'
  const formatDate = formatToFrenchDate(date)

  const computedAccessibilityLabel = [formatDate, errorMessage].filter(Boolean).join(' - ')

  return (
    <ContainerWithMaxWidth gap={2}>
      <LabelContainer>
        <InputLabel htmlFor={dateInputID}>{label}</InputLabel>
      </LabelContainer>
      <InputContainer isError={!!errorMessage}>
        <Typo.Body nativeID={dateInputID} accessibilityLabel={computedAccessibilityLabel}>
          {formatDate}
        </Typo.Body>
      </InputContainer>
    </ContainerWithMaxWidth>
  )
}
