import React from 'react'

import { VenueResponse } from 'api/gen'
import { isValidFrenchPhoneNumber } from 'features/venue/components/ContactBlockNew/helpers'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { PhoneFilled } from 'ui/svg/icons/PhoneFilled'

export const ContactBlock: React.FC<{ venue: VenueResponse }> = ({ venue }) => {
  const { email, phoneNumber, website } = venue?.contact || {}
  const { showErrorSnackBar } = useSnackBarContext()

  const onOpenUrlError = () => {
    showErrorSnackBar({
      message: 'Une erreur est survenue',
    })
  }

  return (
    <React.Fragment>
      {!!email && (
        <ExternalTouchableLink
          externalNav={{ url: `mailto:${email}`, onError: onOpenUrlError }}
          as={StyledButtonTertiaryBlack}
          wording={email}
          icon={EmailFilled}
        />
      )}
      {!!(phoneNumber && isValidFrenchPhoneNumber(phoneNumber)) && (
        <ExternalTouchableLink
          externalNav={{ url: `tel:${phoneNumber}`, onError: onOpenUrlError }}
          as={StyledButtonTertiaryBlack}
          wording={phoneNumber}
          icon={PhoneFilled}
        />
      )}
      {!!website && (
        <ExternalTouchableLink
          externalNav={{ url: website, onError: onOpenUrlError }}
          as={StyledButtonTertiaryBlack}
          wording={website}
          icon={ExternalSiteFilled}
        />
      )}
    </React.Fragment>
  )
}

const StyledButtonTertiaryBlack = styledButton(ButtonTertiaryBlack)({
  justifyContent: 'flex-start',
})
