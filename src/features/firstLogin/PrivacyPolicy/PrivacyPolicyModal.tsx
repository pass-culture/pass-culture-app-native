import noop from 'lodash/noop'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { env } from 'libs/environment'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { AppModal } from 'ui/components/modals/AppModal'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { Close } from 'ui/svg/icons/Close'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Typo, Spacer } from 'ui/theme'

export interface Props {
  visible: boolean
  onApproval: () => void
  onRefusal: () => void
  disableBackdropTap?: boolean
}

export const PrivacyPolicyModal: FunctionComponent<Props> = ({
  visible,
  onApproval,
  onRefusal,
  disableBackdropTap = true,
}) => {
  return (
    <AppModal
      visible={visible}
      title="Respect de ta vie privée"
      onBackdropPress={disableBackdropTap ? noop : undefined}
      rightIconAccessibilityLabel="Fermer la modale et refuser la collecte des données"
      rightIcon={Close}
      onRightIconPress={onRefusal}>
      <Description>
        <Typo.Body>
          Nous utilisons des outils pour réaliser des statistiques de navigation et offrir une
          experience plus sûre. En cliquant sur “Autoriser”, tu acceptes l’utilisation de ces
          services détaillés dans notre
          <Spacer.Row numberOfSpaces={1} />
          <TouchableLink
            as={ButtonInsideText}
            wording="Politique des cookies"
            externalNav={{ url: env.COOKIES_POLICY_LINK }}
            icon={ExternalSiteFilled}
          />
        </Typo.Body>
      </Description>
      <SubDescription>
        <Typo.CaptionNeutralInfo>
          Tu pourras modifier tes paramètres de confidentialité dans ton profil.
        </Typo.CaptionNeutralInfo>
      </SubDescription>
      <CallToActionsContainer>
        <ButtonPrimary
          wording="Autoriser"
          accessibilityLabel="Autoriser l’utilisation des outils pour réaliser des statistiques de navigation"
          onPress={onApproval}
          mediumWidth
        />
        <Spacer.Column numberOfSpaces={3} />
        <ButtonSecondary
          wording="Refuser"
          accessibilityLabel="Refuser l’utilisation des outils pour réaliser des statistiques de navigation"
          onPress={onRefusal}
          mediumWidth
        />
      </CallToActionsContainer>
    </AppModal>
  )
}

const CallToActionsContainer = styled.View(({ theme }) => ({
  flexDirection: theme.isDesktopViewport ? 'column' : 'column-reverse',
  alignItems: 'center',
  width: '100%',
}))

const Description = styled(Typo.Body)({
  textAlign: 'center',
})

const SubDescription = styled(Typo.Caption)({
  textAlign: 'center',
  paddingVertical: 20,
  paddingHorizontal: '10%',
})
