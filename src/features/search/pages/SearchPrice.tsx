import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { PageHeader } from 'ui/components/headers/PageHeader'

export const SearchPrice: FunctionComponent = () => {
  const titleID = uuidv4()

  return (
    <Container>
      <PageHeader titleID={titleID} title="Prix" background="primary" withGoBackButton />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))
