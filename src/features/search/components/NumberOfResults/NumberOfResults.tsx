import React from 'react'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { plural } from 'libs/plural'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  nbHits: number
}

export const NumberOfResults: React.FC<Props> = ({ nbHits }) => {
  const numberOfResults = plural(nbHits, {
    one: '# résultat',
    other: '# résultats',
  })

  if (!nbHits) return <React.Fragment></React.Fragment>

  return (
    <Container accessibilityRole={AccessibilityRole.STATUS}>
      <Body {...getHeadingAttrs(2)}>{numberOfResults}</Body>
    </Container>
  )
}

const Container = styled.View({
  marginTop: getSpacing(1),
  marginHorizontal: getSpacing(6),
  marginBottom: getSpacing(4),
})

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
