import { t, plural } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components/native'

import { ApiError, extractApiErrorMessage } from 'api/apiHelpers'
import { useSendPhoneValidationMutation } from 'features/identityCheck/api'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Close } from 'ui/svg/icons/Close'
import { Spacer, Typo } from 'ui/theme'

export interface CodeNotReceivedModalProps {
  isVisible: boolean
  dismissModal: () => void
  phoneNumber: string
}

export const CodeNotReceivedModal: FunctionComponent<CodeNotReceivedModalProps> = (props) => {
  // TODO(PC-14462): implement attempts remaining fetch and delete this mock initialization
  const [requestsRemaining, setRequestsRemaining] = useState(5)
  const { navigate } = useNavigation<UseNavigationType>()
  const { showErrorSnackBar } = useSnackBarContext()
  const hasOneRequestRemaining = requestsRemaining === 1

  const requestsWording = plural(requestsRemaining, {
    one: '# demande',
    other: '# demandes',
  })

  const { mutate: sendPhoneValidationCode, isLoading } = useSendPhoneValidationMutation({
    onSuccess: () => props.dismissModal(),
    onError: (error: ApiError | unknown) => {
      props.dismissModal()
      const { content } = error as ApiError
      if (content.code === 'TOO_MANY_SMS_SENT') {
        navigate('PhoneValidationTooManySMSSent')
      } else {
        const message = extractApiErrorMessage(error)
        showErrorSnackBar({
          message,
          timeout: SNACK_BAR_TIME_OUT,
        })
      }
    },
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
              sendPhoneValidationCode(props.phoneNumber)
              // TODO(PC-14461): implement code resend and delete this mock behavior
              if (requestsRemaining > 0) {
                setRequestsRemaining(requestsRemaining - 1)
              } else {
                setRequestsRemaining(5)
              }
            }}
            wording={t`Demander un autre code`}
            isLoading={isLoading}
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
