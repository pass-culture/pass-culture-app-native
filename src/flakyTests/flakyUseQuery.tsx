import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import { Text } from 'react-native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

import { useFlakyUseQueryMutation } from './useFlakyUseQuery'

export const FlakyUseQueryComponent: FunctionComponent = () => {
  const { mutate, toto } = useFlakyUseQueryMutation()

  const confirmCancelBooking = () => {
    mutate()
  }

  return (
    <React.Fragment>
      <ButtonPrimary title={t`Flaky test on press`} onPress={confirmCancelBooking} />
      <Text>{toto}</Text>
    </React.Fragment>
  )
}
