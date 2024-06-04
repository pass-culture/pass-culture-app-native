import React, { FC } from 'react'
import styled from 'styled-components/native'

import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ScrollButtonForNotTouchDevice } from 'ui/components/buttons/ScrollButtonForNotTouchDevice'
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
      <ScrollButtonForNotTouchDevice horizontalAlign={direction} top={top} onPress={onPress}>
        {direction === 'left' ? <ArrowLeft {...props} /> : <ArrowRight {...props} />}
      </ScrollButtonForNotTouchDevice>
    )
  }

  return (
    <ScrollButtonForNotTouchDevice horizontalAlign={direction} top={top} onPress={onPress}>
      {direction === 'left' ? <BicolorArrowLeft {...props} /> : <BicolorArrowRight {...props} />}
    </ScrollButtonForNotTouchDevice>
  )
}

export const PlaylistArrowButton = styled(RawPlaylistArrowButton).attrs(({ theme, size }) => ({
  size: size ?? theme.icons.sizes.small,
}))({})
