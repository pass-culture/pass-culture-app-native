import React, { ReactElement } from 'react'
import { styled, useTheme } from 'styled-components/native'

import { PlayerPreview } from 'features/home/components/modules/video/PlayerPreview/PlayerPreview'
import { Duration } from 'features/offer/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { Parameters } from 'ui/svg/icons/Parameters'
import { Typo } from 'ui/theme'

type Props = {
  height: number
  onManageCookiesPress: VoidFunction
  onVideoConsentPress: VoidFunction
  thumbnail?: ReactElement
  title?: string
  duration?: Duration
  width?: number
}

export const GatedVideoSection = ({
  height,
  thumbnail,
  title,
  duration,
  width,
  onManageCookiesPress,
  onVideoConsentPress,
}: Props) => {
  const { isDesktopViewport } = useTheme()

  return (
    <Container gap={4} width={width}>
      <Typo.Title3>Vidéo</Typo.Title3>
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
        <Button
          wording="Voir la vidéo"
          onPress={onVideoConsentPress}
          variant="secondary"
          color="neutral"
          fullWidth
        />
        <Button
          wording="Gérer mes cookies"
          variant="tertiary"
          color="neutral"
          icon={Parameters}
          onPress={onManageCookiesPress}
          fullWidth
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
