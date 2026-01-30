import React from 'react'

import { VenueContact, VenueResponse } from 'api/gen'
import { isValidFrenchPhoneNumber } from 'features/venue/components/ContactBlock/isValidFrenchPhoneNumber'
import { analytics } from 'libs/analytics/provider'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { PhoneFilled } from 'ui/svg/icons/PhoneFilled'

export const ContactBlock: React.FC<{ venue: Omit<VenueResponse, 'isVirtual'> }> = ({ venue }) => {
  const { email, phoneNumber, website } = venue.contact || {}
  const { showErrorSnackBar } = useSnackBarContext()

  const onOpenUrlError = () => {
    showErrorSnackBar({
      message: 'Une erreur est survenue.',
    })
  }

  if (
    !venue.contact ||
    (!venue.contact.email && !venue.contact.phoneNumber && !venue.contact.website)
  )
    return null

  const logAnalytics = (type: keyof VenueContact) => {
    void analytics.logVenueContact({ type, venueId: venue.id })
  }

  return (
    <React.Fragment>
      {email ? (
        <ExternalTouchableLink
          externalNav={{ url: `mailto:${email}`, onError: onOpenUrlError }}
          onBeforeNavigate={() => logAnalytics('email')}
          as={StyledButtonTertiaryBlack}
          wording={email}
          icon={EmailFilled}
        />
      ) : null}
      {phoneNumber && isValidFrenchPhoneNumber(phoneNumber) ? (
        <ExternalTouchableLink
          externalNav={{ url: `tel:${phoneNumber}`, onError: onOpenUrlError }}
          onBeforeNavigate={() => logAnalytics('phoneNumber')}
          as={StyledButtonTertiaryBlack}
          wording={phoneNumber}
          icon={PhoneFilled}
        />
      ) : null}
      {website ? (
        <ExternalTouchableLink
          externalNav={{ url: website, onError: onOpenUrlError }}
          onBeforeNavigate={() => logAnalytics('website')}
          as={StyledButtonTertiaryBlack}
          wording={website}
          icon={ExternalSiteFilled}
        />
      ) : null}
    </React.Fragment>
  )
}

const StyledButtonTertiaryBlack = styledButton(ButtonTertiaryBlack)({
  justifyContent: 'flex-start',
})
