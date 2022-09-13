import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { getSpacing, Spacer } from 'ui/theme'

export const SelectIDStatus: FunctionComponent = () => {
  return <PageWithHeader title={'Identification'} scrollChildren={<SelectIDStatusContent />} />
}

const SelectIDStatusContent: FunctionComponent = () => {
  return (
    <Container>
      <Spacer.Column numberOfSpaces={4} />
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
  alignItems: 'center',
  marginHorizontal: getSpacing(1),
  marginVertical: getSpacing(8),
})
