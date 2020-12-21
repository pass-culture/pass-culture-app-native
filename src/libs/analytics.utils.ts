import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native'

export const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}: NativeSyntheticEvent<NativeScrollEvent>['nativeEvent']) => {
  const paddingToBottom = 20
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom
}
