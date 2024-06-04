import React, { FC } from 'react'
import styled from 'styled-components/native'

import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ScrollButtonForNotTouchDevice } from 'ui/components/buttons/ScrollButtonForNotTouchDevice'
import {
  scrollButtonStyles,
  ScrollButtonForNotTouchDeviceProps,
} from 'ui/components/buttons/scrollButtonForNotTouchDeviceUtils'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ArrowLeft } from 'ui/svg/icons/ArrowLeft'
import { ArrowRight } from 'ui/svg/icons/ArrowRight'
import { BicolorArrowLeft } from 'ui/svg/icons/BicolorArrowLeft'
import { BicolorArrowRight } from 'ui/svg/icons/BicolorArrowRight'
import { AccessibleBicolorIcon } from 'ui/svg/icons/types'

type Props = AccessibleBicolorIcon & {
  direction: 'left' | 'right'
  onPress: () => void
  top?: number
}

const RawPlaylistArrowButton: FC<Props> = ({ direction, top, onPress, ...props }) => {
  const enableAppV2CategoryBlock = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_CATEGORY_BLOCK)

  if (enableAppV2CategoryBlock) {
    return (
      <BorderedScrollButtonForNotTouchDevice
        horizontalAlign={direction}
        top={top}
        onPress={onPress}>
        {direction === 'left' ? <ArrowLeft {...props} /> : <ArrowRight {...props} />}
      </BorderedScrollButtonForNotTouchDevice>
    )
  }

  return (
    <ScrollButtonForNotTouchDevice horizontalAlign={direction} top={top} onPress={onPress}>
      {direction === 'left' ? <BicolorArrowLeft {...props} /> : <BicolorArrowRight {...props} />}
    </ScrollButtonForNotTouchDevice>
  )
}

export const ScrollButtonForNotTouchDevices =
  styled(TouchableOpacity)<ScrollButtonForNotTouchDeviceProps>(scrollButtonStyles)

export const BorderedScrollButtonForNotTouchDevice = styled(
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
