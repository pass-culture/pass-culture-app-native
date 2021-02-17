import React from 'react'
import styled from 'styled-components/native'

import { ProfileHeaderWithNavigation } from '../components/ProfileHeaderWithNavigation'

export function TemporaryProfilePage() {
  return (
    <Container>
      <ProfileHeaderWithNavigation title={'Page temporaire'} />
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
  flexDirection: 'column',
})
