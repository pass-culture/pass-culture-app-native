// eslint-disable-next-line no-restricted-imports
import FastImage from '@d11/react-native-fast-image'
import React, { FunctionComponent, memo } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { ActionCardBase } from 'ui/components/ActionCardBase'

type EditorialCardInfo = {
  imageURL: string
  url?: string | null
  date?: string
  title?: string
  subtitle?: string
  callToAction?: string
}

type Props = {
  height: number
  width: number
  isFocus: boolean
  editorialCardInfo: EditorialCardInfo
  accessibilityLabel: string
  onFocus: () => void
  onBlur: () => void
  onPress: () => void
  style?: StyleProp<ViewStyle>
}

const EditorialCardComponent: FunctionComponent<Props> = ({
  height,
  width,
  isFocus,
  editorialCardInfo,
  accessibilityLabel,
  onFocus,
  onBlur,
  onPress,
  style,
}) => {
  const { imageURL, url, date, title, subtitle, callToAction } = editorialCardInfo

  return (
    <ActionCardBase
      height={height}
      width={width}
      isFocus={isFocus}
      url={url}
      date={date}
      title={title}
      subtitle={subtitle}
      callToAction={callToAction}
      accessibilityLabel={accessibilityLabel}
      visual={<CoverImage source={{ uri: imageURL }} resizeMode="cover" />}
      desktopLayout="split"
      onFocus={onFocus}
      onBlur={onBlur}
      onPress={onPress}
      style={style}
    />
  )
}

export const EditorialCard = memo(EditorialCardComponent)

const CoverImage = styled(FastImage)({
  width: '100%',
  height: '100%',
  position: 'absolute',
})
