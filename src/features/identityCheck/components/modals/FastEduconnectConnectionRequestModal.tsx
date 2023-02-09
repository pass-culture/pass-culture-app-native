import React from 'react'
import styled from 'styled-components/native'

import { IdentityCheckMethod } from 'api/gen'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { amplitude } from 'libs/amplitude'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { useUbbleETAMessage } from 'libs/firebase/firestore/ubbleETAMessage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { AppModal } from 'ui/components/modals/AppModal'
import { OrSeparator } from 'ui/components/OrSeparator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Close } from 'ui/svg/icons/Close'
import { EditPen } from 'ui/svg/icons/EditPen'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Spacer, Typo } from 'ui/theme'

interface FastEduconnectConnectionRequestModalProps {
  visible: boolean
  hideModal: () => void
}

export const FastEduconnectConnectionRequestModal: React.FC<
  FastEduconnectConnectionRequestModalProps
> = ({ visible, hideModal }) => {
  const { dispatch } = useSubscriptionContext()
  const { data: ubbleETAMessage } = useUbbleETAMessage()

  const onModalRightIconPress = () => {
    analytics.logQuitAuthenticationMethodSelection()
    hideModal()
  }

  const onPressEduConnect = () => {
    analytics.logChooseEduConnectMethod()
    amplitude.logEvent('choose_method_educonnect')
    hideModal()
    dispatch({ type: 'SET_METHOD', payload: IdentityCheckMethod.educonnect })
  }

  const onPressManualIdentification = () => {
    analytics.logChooseUbbleMethod()
    amplitude.logEvent('choose_method_ubble')

    hideModal()
    dispatch({ type: 'SET_METHOD', payload: IdentityCheckMethod.ubble })
  }

  return (
    <AppModal
      title="Identifie-toi en 2 minutes"
      visible={visible}
      rightIconAccessibilityLabel="Fermer la modale de propositions d'identifications avec ÉduConnect ou Démarches Simplifiées"
      rightIcon={Close}
      onRightIconPress={onModalRightIconPress}>
      <StyledBody>
        Tu peux vérifier ton identité en moins de 2 minutes en utilisant ton compte ÉduConnect. Si
        tu n’as pas d’identifiants ÉduConnect rapproche toi de ton établissement.
      </StyledBody>

      <ExternalTouchableLink
        as={ButtonQuaternaryBlack}
        externalNav={{ url: env.FAQ_LINK_EDUCONNECT_URL }}
        icon={InfoPlain}
        wording="C’est quoi ÉduConnect&nbsp;?"
      />

      <Spacer.Column numberOfSpaces={4} />

      <InternalTouchableLink
        as={ButtonPrimary}
        wording="Identification avec ÉduConnect"
        navigateTo={{ screen: 'IdentityCheckEduConnect' }}
        onBeforeNavigate={onPressEduConnect}
      />

      <OrSeparator />

      <InternalTouchableLink
        as={ButtonTertiaryBlack}
        icon={EditPen}
        wording="Identification manuelle"
        navigateTo={{ screen: 'SelectIDOrigin' }}
        onBeforeNavigate={onPressManualIdentification}
      />
      <DurationInfoText>{ubbleETAMessage}</DurationInfoText>
    </AppModal>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.greyDark,
}))

const DurationInfoText = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.greyDark,
}))
