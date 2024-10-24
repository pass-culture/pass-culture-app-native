import React, { useRef } from 'react'
import { useWindowDimensions } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { VenueTypeCodeKey } from 'api/gen'
import {
  getVideoPlayerDimensions,
  RATIO169,
} from 'features/home/components/helpers/getVideoPlayerDimensions'
import { FakeVideoPlayer } from 'features/venue/components/VideoSection/FakeVideoPlayer'
import { getFakeVideoBackground } from 'features/venue/helpers/getFakeVideoBackground'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type VideoSectionProps = {
  onPress: () => void
  venueType?: VenueTypeCodeKey | null
}

export const VideoSection = ({ venueType, onPress }: VideoSectionProps) => {
  const { isDesktopViewport } = useTheme()
  const { width: windowWidth } = useWindowDimensions()
  const { playerHeight, playerWidth } = getVideoPlayerDimensions(
    isDesktopViewport,
    windowWidth,
    RATIO169
  )

  const fakeVideoBackgroundSource = useRef(getFakeVideoBackground(venueType)).current

  return (
    <SectionWithDivider visible gap={6}>
      <Title />
      <FakeVideoPlayer
        imageSource={fakeVideoBackgroundSource}
        height={playerHeight}
        width={playerWidth}
        onPress={onPress}
      />
      <Spacer.Column numberOfSpaces={2} />
    </SectionWithDivider>
  )
}

const Title = styled(TypoDS.Title3).attrs({ ...getHeadingAttrs(2), children: 'Vidéo de ce lieu' })({
  marginLeft: getSpacing(6),
})
