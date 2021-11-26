import React from 'react'

import { useAppSettings } from 'features/auth/settings'
import { AddressWithAutoCompletion } from 'features/identityCheck/components/AddressWithAutoCompletion'
import { AddressWithoutAutoCompletion } from 'features/identityCheck/components/AddressWithoutAutoCompletion'

export const SetAddress =() => {
  const { data: settings } = useAppSettings()
  if (settings?.idCheckAddressAutocompletion) {
    return <AddressWithAutoCompletion />
  }
  return <AddressWithoutAutoCompletion />
}
