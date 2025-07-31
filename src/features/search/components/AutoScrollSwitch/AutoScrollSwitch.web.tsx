import React from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

import FilterSwitch from 'ui/components/FilterSwitch'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { Spacer, Typo } from 'ui/theme'

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
  const labelID = uuidv4()

  return (
    <Container>
      <FlexContainer>
        <FilterSwitch
          active={active}
          toggle={toggle}
          checkboxID={checkboxID}
          accessibilityLabelledBy={labelID}
        />
        <Spacer.Row numberOfSpaces={5} />
        <InputLabel id={labelID} htmlFor={checkboxID}>
          <Typo.BodyAccent>{title}</Typo.BodyAccent>
        </InputLabel>
        <Spacer.Column numberOfSpaces={2} />
      </FlexContainer>
    </Container>
  )
}

const Container = styled.div(({ theme }) => ({
  overflow: 'hidden',
  marginLeft: theme.designSystem.size.spacing.xl,
  marginRight: theme.designSystem.size.spacing.xl,
  width: '1px',
  height: '1px',
  '&:focus-within': {
    width: 'auto',
    height: 'auto',
  },
}))

const FlexContainer = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: theme.designSystem.size.spacing.m,
}))
