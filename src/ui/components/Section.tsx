import React, { PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { Separator } from './Separator'

type SectionProps = PropsWithChildren<{
  title?: string
}>

export function Section(props: SectionProps) {
  return (
    <Container>
      {props.title ? <CaptionNeutralInfo>{props.title}</CaptionNeutralInfo> : null}
      <Spacer.Column numberOfSpaces={2} />
      <Separator.Horizontal />
      {props.children}
    </Container>
  )
}

const Container = styled.View({
  paddingTop: getSpacing(2),
})

const CaptionNeutralInfo = styled(Typo.BodyAccentXs).attrs(getHeadingAttrs(2))(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
