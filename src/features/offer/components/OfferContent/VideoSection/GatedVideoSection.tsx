import React, { ReactElement } from 'react'
import { styled, useTheme } from 'styled-components/native'

import { PlayerPreview } from 'features/home/components/modules/video/PlayerPreview/PlayerPreview'
import { Duration } from 'features/offer/types'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Parameters } from 'ui/svg/icons/Parameters'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  height: number
  thumbnail?: ReactElement
  title?: string
  duration?: Duration
  width?: number
}

export const GatedVideoSection = ({ height, thumbnail, title, duration, width }: Props) => {
  const { designSystem, isDesktopViewport } = useTheme()

  return (
    <Container gap={4} width={width}>
      <Typo.Title3 {...getHeadingAttrs(3)}>Vidéo</Typo.Title3>
      <PlayerPreview
        thumbnail={thumbnail}
        title={title}
        duration={duration}
        height={height}
        width={width}
      />
      <Typo.BodyAccentS>
        En visionnant cette vidéo, tu t’engages à accepter les cookies liés à Youtube.
      </Typo.BodyAccentS>
      <ButtonContainer gap={2} isHorizontal={isDesktopViewport}>
        <ButtonSecondary
          wording="Voir la vidéo"
          color={designSystem.color.text.default}
          mediumWidth={isDesktopViewport}
        />
        <ButtonTertiaryBlack
          wording="Gérer mes cookies"
          mediumWidth={isDesktopViewport}
          icon={Parameters}
        />
      </ButtonContainer>
    </Container>
  )
}

const Container = styled(ViewGap)<{ width?: number }>(({ theme, width }) => ({
  marginTop: theme.designSystem.size.spacing.l,
  width,
}))

const ButtonContainer = styled(ViewGap)<{ isHorizontal?: boolean }>(({ isHorizontal }) => ({
  flexDirection: isHorizontal ? 'row' : 'column',
}))
