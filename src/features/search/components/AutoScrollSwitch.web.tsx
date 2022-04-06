import React from 'react'
import styled from 'styled-components'

import { SectionWithSwitch } from 'features/profile/components/SectionWithSwitch'
import { getSpacing } from 'ui/theme'

export const AutoScrollSwitch = ({
  title,
  active,
  toggle,
}: {
  title: string
  active: boolean
  toggle: () => void
}) => (
  <Container>
    <SectionWithSwitch title={title} active={active} toggle={toggle} />
  </Container>
)

const Container = styled.div({
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  marginLeft: getSpacing(6),
  marginRight: getSpacing(6),
  '&:focus-within': {
    width: 'auto',
    height: 'auto',
  },
})
