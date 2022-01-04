import { t } from '@lingui/macro'
import noop from 'lodash/noop'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { openUrl } from 'features/navigation/helpers'
import { env } from 'libs/environment'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { ColorsEnum, Typo, Spacer, getSpacing } from 'ui/theme'

export interface Props {
  visible: boolean
  onApproval: () => void
  onRefusal: () => void
  disableBackdropTap?: boolean
}

const cookieButtonText = 'Politique des cookies'

export const PrivacyPolicyModal: FunctionComponent<Props> = ({
  visible,
  onApproval,
  onRefusal,
  disableBackdropTap = true,
}) => {
  async function openCookiesPolicyExternalUrl() {
    await openUrl(env.COOKIES_POLICY_LINK)
  }
  return (
    <AppModal
      visible={visible}
      title={t`Respect de ta vie privée`}
      onBackdropPress={disableBackdropTap ? noop : undefined}
      leftIconAccessibilityLabel={undefined}
      leftIcon={undefined}
      onLeftIconPress={undefined}
      rightIconAccessibilityLabel={t`Fermer la modale et refuser la collecte des données`}
      rightIcon={Close}
      onRightIconPress={onRefusal}>
      <Description>
        <Typo.Body>
          {t`Nous utilisons des outils pour réaliser des statistiques de navigation et offrir une experience plus sûre. En cliquant sur "Autoriser", tu acceptes l'utilisation de ces services détaillés dans notre`}
        </Typo.Body>
      </Description>
      <ButtonTertiary
        title={cookieButtonText}
        onPress={openCookiesPolicyExternalUrl}
        icon={ExternalSite}
        textSize={12}
      />
      <SubDescription>
        <Typo.Caption color={ColorsEnum.GREY_DARK}>
          {t`Tu pourras modifier tes paramètres de confidentialité dans ton profil.`}
        </Typo.Caption>
      </SubDescription>
      <CallToActionsContainer>
        <AcceptanceButton title={t`Autoriser`} onPress={onApproval} />
        <Spacer.Column numberOfSpaces={3} />
        <RefusalButton title={t`Refuser`} onPress={onRefusal} />
      </CallToActionsContainer>
    </AppModal>
  )
}

const CallToActionsContainer = styled.View(({ theme }) => ({
  flexDirection: theme.isDesktopViewport ? 'column' : 'column-reverse',
  alignItems: 'center',
  width: '100%',
}))

const AcceptanceButton = styled(ButtonPrimary)({
  maxWidth: getSpacing(80),
})

const RefusalButton = styled(ButtonSecondary)({
  maxWidth: getSpacing(80),
})

const Description = styled.Text({
  textAlign: 'center',
})

const SubDescription = styled.Text({
  textAlign: 'center',
  paddingVertical: 20,
  paddingHorizontal: '10%',
})
