import React, { ReactNode } from 'react'
import styled from 'styled-components/native'

import { getSpacing, Spacer, Typo } from 'ui/theme'

export type Props = {
  title: string
  subtitle?: ReactNode | string
  content?: ReactNode
}

export function HeaderWithGreyContainer({ title, subtitle, content }: Props) {
  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <TitleContainer>
        <Typo.Title1 numberOfLines={2}>{title}</Typo.Title1>
      </TitleContainer>
      {!!subtitle && (
        <SubtitleContainer>
          {typeof subtitle === 'string' ? <Typo.Body>{subtitle}</Typo.Body> : subtitle}
        </SubtitleContainer>
      )}
      {!!content && <GreyContainer>{content}</GreyContainer>}
    </React.Fragment>
  )
}

const TitleContainer = styled.View(({ theme }) => ({
  marginTop: getSpacing(6),
  marginHorizontal: theme.contentPage.marginHorizontal,
  marginBottom: getSpacing(2),
}))

const SubtitleContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  marginBottom: getSpacing(5),
}))

const GreyContainer = styled.View(({ theme }) => ({
  padding: getSpacing(6),
  borderRadius: getSpacing(2),
  backgroundColor: theme.colors.greyLight,
  marginHorizontal: theme.contentPage.marginHorizontal,
  marginBottom: getSpacing(2),
}))
