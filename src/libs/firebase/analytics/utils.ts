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

// We don't send integers to firebase because they will be cast into int_value, float_value,
// or double_value in BigQuery depending on its value. To facilitate the work of the team,
// we just cast it to string.
export const prepareLogEventParams = (params: Record<string, unknown>) =>
  Object.keys(params).reduce((acc: Record<string, unknown>, key) => {
    acc[key] = typeof params[key] === 'number' ? (params[key] as number).toString() : params[key]
    return acc
  }, {})
