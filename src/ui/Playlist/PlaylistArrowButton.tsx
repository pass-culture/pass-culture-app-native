import React, { FC } from 'react'
import styled from 'styled-components/native'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import {
  scrollButtonStyles,
  ScrollButtonForNotTouchDeviceProps,
} from 'ui/Playlist/playlistArrowButtonUtils'
import { ArrowLeft } from 'ui/svg/icons/ArrowLeft'
import { ArrowRight } from 'ui/svg/icons/ArrowRight'
import { AccessibleIcon } from 'ui/svg/icons/types'

type Props = AccessibleIcon & {
  direction: 'left' | 'right'
  onPress: () => void
  top?: number
}

const RawPlaylistArrowButton: FC<Props> = ({ direction, top, onPress, ...props }) => {
  return (
    <BorderedScrollButtonForNotTouchDevice horizontalAlign={direction} top={top} onPress={onPress}>
      {direction === 'left' ? <ArrowLeft {...props} /> : <ArrowRight {...props} />}
    </BorderedScrollButtonForNotTouchDevice>
  )
}

const BorderedScrollButtonForNotTouchDevice = styled(
  TouchableOpacity
)<ScrollButtonForNotTouchDeviceProps>((props) => ({
  // @ts-ignore this should work since styled(TouchableOpacity)(scrollButtonStyles) works
  ...scrollButtonStyles(props),
  borderWidth: 1,
  borderColor: props.theme.colors.greySemiDark,
}))

export const PlaylistArrowButton = styled(RawPlaylistArrowButton).attrs(({ theme, size }) => ({
  size: size ?? theme.icons.sizes.small,
}))({})
