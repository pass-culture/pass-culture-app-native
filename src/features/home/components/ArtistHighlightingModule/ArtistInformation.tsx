import React, { FunctionComponent } from 'react'
import { useNumberOfLine } from 'shared/accessibility/helpers/zoomHelpers'
import styled, { useTheme } from 'styled-components/native'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

type ArtistInformationProps = {
  name: string
  subtitle: string
  description: string
}

export const ArtistInformation: FunctionComponent<ArtistInformationProps> = ({
  name,
  subtitle,
  description,
}) => {
  const { isDesktopViewport } = useTheme()
  const numberOfLines = useNumberOfLine(2)

  const DescriptionText = isDesktopViewport ? DesktopDescriptionText : MobileDescriptionText

  return (
    <TextContent gap={1}>
      <TitleText {...setTextSemantic('h2')}>{name}</TitleText>
      <SubtitleText {...setTextSemantic('h3')} numberOfLines={numberOfLines}>{subtitle}</SubtitleText>
      <DescriptionText {...setTextSemantic('p')} numberOfLines={numberOfLines}>{description}</DescriptionText>
    </TextContent>
  )
}

const TextContent = styled(ViewGap)(({ theme }) => ({
  alignItems: theme.isDesktopViewport ? 'flex-start' : 'center',
  marginHorizontal: theme.isDesktopViewport ? undefined : theme.designSystem.size.spacing.m,
}))

const TitleText = styled(Typo.Title2)(({ theme }) => ({
  color: theme.designSystem.color.text.default,
}))

const SubtitleText = styled(Typo.BodyAccentS)(({ theme }) => ({
  color: theme.designSystem.color.text.default,
  textAlign: 'center',
}))

const MobileDescriptionText = styled(Typo.BodyXs)(({ theme }) => ({
  color: theme.designSystem.color.text.default,
  textAlign: 'center',
}))

const DesktopDescriptionText = styled(Typo.BodyS)(({ theme }) => ({
  color: theme.designSystem.color.text.default,
  textAlign: 'center',
}))
