import React from 'react'

import { VenueContact, VenueResponse } from 'api/gen'
import { isValidFrenchPhoneNumber } from 'features/venue/components/ContactBlock/isValidFrenchPhoneNumber'
import { analytics } from 'libs/analytics/provider'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
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
          as={Button}
          wording={email}
          icon={EmailFilled}
          variant="tertiary"
          color="neutral"
        />
      ) : null}
      {phoneNumber && isValidFrenchPhoneNumber(phoneNumber) ? (
        <ExternalTouchableLink
          externalNav={{ url: `tel:${phoneNumber}`, onError: onOpenUrlError }}
          onBeforeNavigate={() => logAnalytics('phoneNumber')}
          as={Button}
          wording={phoneNumber}
          icon={PhoneFilled}
          variant="tertiary"
          color="neutral"
        />
      ) : null}
      {website ? (
        <ExternalTouchableLink
          externalNav={{ url: website, onError: onOpenUrlError }}
          onBeforeNavigate={() => logAnalytics('website')}
          as={Button}
          wording={website}
          icon={ExternalSiteFilled}
          variant="tertiary"
          color="neutral"
        />
      ) : null}
    </React.Fragment>
  )
}
