import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
// eslint-disable-next-line no-restricted-imports
import FastImage, { Source } from 'react-native-fast-image'
import styled from 'styled-components/native'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Play } from 'ui/svg/icons/Play'
import { getSpacing } from 'ui/theme'

type FakeVideoPlayerProps = {
  imageSource: number | Source
  width: number
  height: number
  onPress: () => void
}

export const FakeVideoPlayer: FunctionComponent<FakeVideoPlayerProps> = ({
  imageSource,
  width,
  height,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} delayPressIn={70} accessibilityLabel="Faux lecteur vidéo">
      <Container height={height} width={width}>
        <PlayIconWrapper shouldRasterizeIOS>
          <PlayIcon />
        </PlayIconWrapper>
        <BackgroundImage source={imageSource} resizeMode="cover" />
      </Container>
    </TouchableOpacity>
  )
}

const Container = styled.View<Pick<FakeVideoPlayerProps, 'height' | 'width'>>(
  ({ theme, width, height }) => ({
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.black,
  })
)

const PlayIconWrapper = styled(View)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2,
})

const BackgroundImage = styled(FastImage)({
  width: '100%',
  height: '100%',
  opacity: 0.4,
})

const PlayIcon = styled(Play).attrs(({ theme }) => ({
  size: getSpacing(24),
  color: theme.colors.brownLight,
}))``
