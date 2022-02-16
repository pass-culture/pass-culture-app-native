import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { IdentityCheckMethod } from 'api/gen'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { openUrl } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { useUbbleETAMessage } from 'libs/firestore/ubbleETAMessage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { AppModal } from 'ui/components/modals/AppModal'
import { OrSeparator } from 'ui/components/OrSeparator'
import { Close } from 'ui/svg/icons/Close'
import { EditPen } from 'ui/svg/icons/EditPen'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Typo, Spacer } from 'ui/theme'
import { A } from 'ui/web/link/A'

interface FastEduconnectConnectionRequestModalProps {
  visible: boolean
  hideModal: () => void
}

export const FastEduconnectConnectionRequestModal: React.FC<
  FastEduconnectConnectionRequestModalProps
> = ({ visible, hideModal }) => {
  const { dispatch } = useIdentityCheckContext()
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: ubbleETAMessage } = useUbbleETAMessage()

  const onModalRightIconPress = () => {
    analytics.logQuitAuthenticationMethodSelection()
    hideModal()
  }

  const onPressEduConnect = () => {
    analytics.logChooseEduConnectMethod()
    hideModal()
    dispatch({ type: 'SET_METHOD', payload: IdentityCheckMethod.educonnect })
    navigate('IdentityCheckEduConnect')
  }

  const onPressManualIdentification = () => {
    analytics.logChooseUbbleMethod()
    hideModal()
    dispatch({ type: 'SET_METHOD', payload: IdentityCheckMethod.ubble })
    navigate('IdentityCheckStart')
  }

  return (
    <AppModal
      title={t`Identifie-toi en 2 minutes`}
      visible={visible}
      leftIconAccessibilityLabel={undefined}
      leftIcon={undefined}
      onLeftIconPress={undefined}
      rightIconAccessibilityLabel={t`Fermer la modale de propositions d'identifications avec ÉduConnect ou Démarches Simplifiées`}
      rightIcon={Close}
      onRightIconPress={onModalRightIconPress}>
      <MainContent>
        {t`Tu peux vérifier ton identité en moins de 2 minutes en utilisant ton compte ÉduConnect. Si tu n'as pas d'identifiants ÉduConnect rapproche toi de ton établissement. `}
      </MainContent>

      <A href={env.FAQ_LINK_EDUCONNECT_URL}>
        <ButtonQuaternaryBlack
          onPress={() => openUrl(env.FAQ_LINK_EDUCONNECT_URL)}
          icon={InfoPlain}
          wording={t`C’est quoi ÉduConnect\u00a0?`}
        />
      </A>

      <Spacer.Column numberOfSpaces={4} />

      <ButtonPrimary wording={t`Identification avec ÉduConnect`} onPress={onPressEduConnect} />

      <OrSeparator />

      <ButtonTertiaryBlack
        icon={EditPen}
        wording={t`Identification manuelle`}
        onPress={onPressManualIdentification}
      />
      <DurationInfoText>{ubbleETAMessage}</DurationInfoText>
    </AppModal>
  )
}

const MainContent = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.greyDark,
}))

const DurationInfoText = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.greyDark,
}))
