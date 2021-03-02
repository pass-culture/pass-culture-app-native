import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native'

type Props = NativeSyntheticEvent<NativeScrollEvent>['nativeEvent'] & { padding?: number }

export const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
  padding = 20,
}: Props) => layoutMeasurement.height + contentOffset.y >= contentSize.height - padding

export const isCloseToEndHorizontal = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
  padding = 0,
}: Props) => layoutMeasurement.width + contentOffset.x >= contentSize.width - padding
