import { t, plural } from '@lingui/macro'
import React, { FunctionComponent, useState } from 'react'
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
  // TODO : PC-14462 implement attempts remaining fetch and delete this mock initialization
  const [requestsRemaining, setRequestsRemaining] = useState(5)
  const hasOneRequestRemaining = requestsRemaining === 1

  const requestsWording = plural(requestsRemaining, {
    one: '# demande',
    other: '# demandes',
  })

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
          <WarningContainer>
            <WarningMessage>{t`Attention, il te reste\u00a0:` + ' '}</WarningMessage>
            <WarningRemainingAttempts isLastAttempt={hasOneRequestRemaining}>
              {requestsWording}
            </WarningRemainingAttempts>
          </WarningContainer>
          <Spacer.Column numberOfSpaces={2} />
          <ButtonPrimary
            type="submit"
            onPress={() => {
              props.dismissModal()
              // TODO : PC-14461 implement code resend and delete this mock behavior
              if (requestsRemaining > 0) {
                setRequestsRemaining(requestsRemaining - 1)
              } else {
                setRequestsRemaining(5)
              }
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

const WarningContainer = styled.View({
  flexDirection: 'row',
})

const WarningMessage = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const WarningRemainingAttempts = styled(Typo.Caption)<{ isLastAttempt: boolean }>(
  ({ theme, isLastAttempt }) => ({
    color: isLastAttempt ? theme.colors.error : theme.colors.black,
  })
)
