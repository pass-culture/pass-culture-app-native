import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ApiError, extractApiErrorMessage } from 'api/apiHelpers'
import {
  usePhoneValidationRemainingAttempts,
  useSendPhoneValidationMutation,
} from 'features/identityCheck/api/api'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { formatPhoneNumberWithPrefix } from 'features/identityCheck/pages/phoneValidation/utils'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { plural } from 'libs/plural'
import { QueryKeys } from 'libs/queryKeys'
import { queryClient } from 'libs/react-query/queryClient'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { GreyDarkCaption } from 'ui/components/GreyDarkCaption'
import { AppModal } from 'ui/components/modals/AppModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Close } from 'ui/svg/icons/Close'
import { Spacer, Typo } from 'ui/theme'

export interface CodeNotReceivedModalProps {
  isVisible: boolean
  dismissModal: () => void
}

export const CodeNotReceivedModal: FunctionComponent<CodeNotReceivedModalProps> = (props) => {
  const { phoneValidation } = useIdentityCheckContext()
  const { remainingAttempts, isLastAttempt } = usePhoneValidationRemainingAttempts()
  const { navigate } = useNavigation<UseNavigationType>()
  const { showErrorSnackBar } = useSnackBarContext()

  const requestsWording = plural(remainingAttempts ?? 0, {
    one: '# demande',
    other: '# demandes',
  })

  const { mutate: sendPhoneValidationCode, isLoading } = useSendPhoneValidationMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.PHONE_VALIDATION_REMAINING_ATTEMPTS)
      props.dismissModal()
    },
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

  async function requestSendPhoneValidationCode() {
    const callingCode = phoneValidation?.country.callingCodes[0]
    const phoneNumber = phoneValidation?.phoneNumber
    if (callingCode && phoneNumber) {
      const phoneNumberWithPrefix = formatPhoneNumberWithPrefix(phoneNumber, callingCode)
      sendPhoneValidationCode(phoneNumberWithPrefix)
    }
  }

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
            <GreyDarkCaption>{t`Attention, il te reste\u00a0:` + ' '}</GreyDarkCaption>
            <WarningRemainingAttempts isLastAttempt={isLastAttempt}>
              {requestsWording}
            </WarningRemainingAttempts>
          </WarningContainer>
          <Spacer.Column numberOfSpaces={2} />
          <ButtonPrimary
            type="submit"
            onPress={requestSendPhoneValidationCode}
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

const WarningRemainingAttempts = styled(Typo.Caption)<{ isLastAttempt: boolean }>(
  ({ theme, isLastAttempt }) => ({
    color: isLastAttempt ? theme.colors.error : theme.colors.black,
  })
)
