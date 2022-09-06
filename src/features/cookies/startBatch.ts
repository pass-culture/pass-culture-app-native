import { Batch } from 'libs/react-native-batch'

export const startBatch = (enabled: boolean) => {
  enabled ? Batch.optIn() : Batch.optOut()
}
