import React from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

import FilterSwitch from 'ui/components/FilterSwitch'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const AutoScrollSwitch = ({
  title,
  active,
  toggle,
}: {
  title: string
  active: boolean
  toggle: () => void
}) => {
  const checkboxID = uuidv4()

  return (
    <Container>
      <FlexContainer>
        <FilterSwitch active={active} toggle={toggle} checkboxID={checkboxID} />
        <Spacer.Row numberOfSpaces={5} />
        <InputLabel htmlFor={checkboxID}>
          <Typo.ButtonText>{title}</Typo.ButtonText>
        </InputLabel>
        <Spacer.Column numberOfSpaces={2} />
      </FlexContainer>
    </Container>
  )
}

const Container = styled.div({
  overflow: 'hidden',
  marginLeft: getSpacing(6),
  marginRight: getSpacing(6),
  width: '1px',
  height: '1px',
  '&:focus-within': {
    width: 'auto',
    height: 'auto',
  },
})

const FlexContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: getSpacing(3),
})
