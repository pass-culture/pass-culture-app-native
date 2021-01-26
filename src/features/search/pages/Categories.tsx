import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { Spacer, Typo } from 'ui/theme'

export const Categories: React.FC = () => {
  return (
    <React.Fragment>
      <React.Fragment>
        <Container>
          <Spacer.TopScreen />
          <Spacer.Column numberOfSpaces={16} />

          <Typo.Body>Catégories</Typo.Body>

          <Spacer.Column numberOfSpaces={30} />
        </Container>
      </React.Fragment>

      <PageHeader title={_(t`Catégories`)} />
    </React.Fragment>
  )
}

const Container = styled.ScrollView({ flex: 1 })
