import React from 'react'
import styled from 'styled-components/native'

import { IdentityCheckMethod } from 'api/gen'
import { useAppSettings } from 'features/auth/settings'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { useUbbleETAMessage } from 'libs/firebase/firestore/ubbleETAMessage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { AppModal } from 'ui/components/modals/AppModal'
import { OrSeparator } from 'ui/components/OrSeparator'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
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
  const { dispatch } = useIdentityCheckContext()
  const { data: ubbleETAMessage } = useUbbleETAMessage()
  const { data: settings } = useAppSettings()

  const onModalRightIconPress = () => {
    analytics.logQuitAuthenticationMethodSelection()
    hideModal()
  }

  const onPressEduConnect = () => {
    analytics.logChooseEduConnectMethod()
    hideModal()
    dispatch({ type: 'SET_METHOD', payload: IdentityCheckMethod.educonnect })
  }

  const onPressManualIdentification = () => {
    analytics.logChooseUbbleMethod()
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

      <TouchableLink
        as={ButtonQuaternaryBlack}
        externalNav={{ url: env.FAQ_LINK_EDUCONNECT_URL }}
        icon={InfoPlain}
        wording="C’est quoi ÉduConnect&nbsp;?"
      />

      <Spacer.Column numberOfSpaces={4} />

      <TouchableLink
        as={ButtonPrimary}
        wording="Identification avec ÉduConnect"
        navigateTo={{ screen: 'IdentityCheckEduConnect' }}
        onBeforeNavigate={onPressEduConnect}
      />

      <OrSeparator />

      <TouchableLink
        as={ButtonTertiaryBlack}
        icon={EditPen}
        wording="Identification manuelle"
        navigateTo={
          settings?.enableNewIdentificationFlow
            ? { screen: 'SelectIDOrigin' }
            : { screen: 'IdentityCheckStart' }
        }
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
