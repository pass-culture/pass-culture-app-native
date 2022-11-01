import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { BackButton } from 'ui/components/headers/BackButton'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export interface ThematicHomeHeaderProps {
  headerTitle: string
  headerSubtitle?: string
}
export const ThematicHomeHeader: FunctionComponent<ThematicHomeHeaderProps> = ({
  headerTitle,
  headerSubtitle,
}) => {
  return (
    <Container>
      <Spacer.TopScreen />
      <BackButton />
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Title1 numberOfLines={1}>{headerTitle}</Typo.Title1>
      {headerSubtitle ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.Body numberOfLines={1}>{headerSubtitle}</Typo.Body>
        </React.Fragment>
      ) : null}
    </Container>
  )
}

const Container = styled.View({
  paddingHorizontal: getSpacing(6),
  paddingTop: getSpacing(6),
  paddingBottom: getSpacing(2),
})
