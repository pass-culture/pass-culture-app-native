import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { IdentityCheckMethod } from 'api/gen'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { openUrl } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { AppModal } from 'ui/components/modals/AppModal'
import { OrSeparator } from 'ui/components/OrSeparator'
import { CloseDeprecated as Close } from 'ui/svg/icons/Close_deprecated'
import { EditPen } from 'ui/svg/icons/EditPen'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Typo, getSpacing } from 'ui/theme'

interface FastEduconnectConnectionRequestModalProps {
  visible: boolean
  hideModal: () => void
}

export const FastEduconnectConnectionRequestModal: React.FC<
  FastEduconnectConnectionRequestModalProps
> = ({ visible, hideModal }) => {
  const { colors } = useTheme()
  const { dispatch } = useIdentityCheckContext()
  const { navigate } = useNavigation<UseNavigationType>()

  return (
    <AppModal
      title={t`Identifie-toi en 2 minutes`}
      visible={visible}
      leftIconAccessibilityLabel={undefined}
      leftIcon={undefined}
      onLeftIconPress={undefined}
      rightIconAccessibilityLabel={t`Fermer la modale de propositions d'identifications avec ÉduConnect ou Démarches Simplifiées`}
      rightIcon={Close}
      onRightIconPress={hideModal}>
      <MainContent color={colors.greyDark}>
        {t`Tu peux vérifier ton identité en moins de 2 minutes en utilisant ton compte ÉduConnect. Si tu n'as pas d'identifiants ÉduConnect rapproche toi de ton établissement. `}
      </MainContent>

      <TextQuestion
        onPress={() => openUrl(env.FAQ_LINK_EDUCONNECT_URL)}
        icon={(props) => <InfoPlain {...props} size={getSpacing(5)} />}
        title={t`C’est quoi ÉduConnect\u00a0?`}
      />

      <ButtonPrimary
        title={t`Identification avec ÉduConnect`}
        onPress={() => {
          hideModal()
          dispatch({ type: 'SET_METHOD', payload: IdentityCheckMethod.Educonnect })
          navigate('IdentityCheckEduConnect')
        }}
      />

      <OrSeparator />

      <ButtonTertiaryBlack
        icon={(props) => <EditPen {...props} size={getSpacing(5)} />}
        title={t`Identification manuelle`}
        onPress={() => {
          hideModal()
          dispatch({ type: 'SET_METHOD', payload: IdentityCheckMethod.Ubble })
          navigate('IdentityCheckStart')
        }}
      />
      <DurationInfoText color={colors.greyDark}>{t`Environ 3 heures`}</DurationInfoText>
    </AppModal>
  )
}

const MainContent = styled(Typo.Body)({
  textAlign: 'center',
})

const DurationInfoText = styled(Typo.Body)({
  textAlign: 'center',
})

const TextQuestion = styled(ButtonQuaternaryBlack)({
  marginBottom: getSpacing(4),
})
