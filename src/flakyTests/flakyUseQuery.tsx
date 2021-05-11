import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

import { useFlakyUseQueryMutation } from './useFlakyUseQuery'

export const FlakyUseQueryComponent: FunctionComponent = () => {
  const { mutate } = useFlakyUseQueryMutation()

  const confirmCancelBooking = () => {
    mutate()
  }

  return <ButtonPrimary title={t`Flaky test on press`} onPress={confirmCancelBooking} />
}
