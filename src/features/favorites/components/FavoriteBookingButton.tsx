import React, { FunctionComponent } from 'react'

import { GetBookingButtonProperties } from 'features/favorites/helpers/getBookingButtonProperties'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'

export const FavoriteBookingButton: FunctionComponent<{
  buttonProperties: GetBookingButtonProperties
  onOpenModal: () => void
}> = ({ buttonProperties, onOpenModal }) => {
  const { wording, externalNav, disabled, accessibilityLabel, onPress } = buttonProperties
  if (!wording) return null

  if (externalNav) {
    return (
      <ExternalTouchableLink
        externalNav={externalNav}
        wording={wording}
        accessibilityLabel={accessibilityLabel}
        as={Button}
        icon={ExternalSite}
      />
    )
  }

  const onPressBookingButton = () => {
    onPress?.()
    onOpenModal()
  }

  return <Button wording={wording} disabled={disabled} onPress={onPressBookingButton} />
}
