import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import FilterSwitch from 'ui/components/FilterSwitch'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { Typo } from 'ui/theme'

type Props = {
  isActive: boolean
  toggle: () => void
  label: string
  testID?: string
}

export const FilterSwitchWithLabel: FunctionComponent<Props> = ({
  isActive,
  toggle,
  label,
  testID,
}) => {
  const checkboxID = uuidv4()
  const labelID = uuidv4()
  const describedByID = uuidv4()

  return (
    <Container>
      <InputLabel htmlFor={checkboxID}>
        <Typo.ButtonText>{label}</Typo.ButtonText>
      </InputLabel>
      <FilterSwitch
        checkboxID={checkboxID}
        active={isActive}
        toggle={toggle}
        accessibilityLabelledBy={labelID}
        accessibilityDescribedBy={describedByID}
        testID={testID}
      />
    </Container>
  )
}

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
})
