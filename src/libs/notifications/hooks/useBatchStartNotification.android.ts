import { Batch } from '@bam.tech/react-native-batch'
import { useEffect } from 'react'

export const useBatchStartNotification = (): void => {
  useEffect(() => {
    Batch.start()
  }, [])
}
