import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { PageHeader } from 'ui/components/headers/PageHeader'

export function ChangeEmail() {
  return (
    <Container>
      <PageHeader title={t`Modifier mon e-mail`} />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))
