import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  isVisible: boolean
  dismissModal: () => void
}

export const CodeNotReceivedModal: FunctionComponent<Props> = (props) => {
  return (
    <AppModal
      visible={props.isVisible}
      title={t`Code non reçu\u00a0?`}
      onLeftIconPress={undefined}
      leftIcon={undefined}
      leftIconAccessibilityLabel={undefined}
      rightIconAccessibilityLabel={t`Fermer la modale`}
      rightIcon={Close}
      onRightIconPress={props.dismissModal}>
      <React.Fragment>
        <Introduction>{t`Si après 5 minutes tu n'as pas reçu ton code de validation, tu peux en demander un nouveau.`}</Introduction>
        <Spacer.Column numberOfSpaces={8} />
        <BottomContentContainer>
          <Typo.Caption>{t`Attention, il te reste\u00a0: 5 demandes`}</Typo.Caption>
          <Spacer.Column numberOfSpaces={2} />
          <ButtonPrimary
            type="submit"
            onPress={() => {
              props.dismissModal()
              // TODO : PC-14461 implement code resend
            }}
            wording={t`Demander un autre code`}
          />
        </BottomContentContainer>
      </React.Fragment>
    </AppModal>
  )
}

const Introduction = styled(Typo.Body)({
  textAlign: 'center',
})

const BottomContentContainer = styled.View({
  alignItems: 'center',
})
