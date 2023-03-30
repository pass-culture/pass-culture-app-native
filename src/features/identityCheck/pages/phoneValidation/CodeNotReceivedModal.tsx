import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { ApiError, extractApiErrorMessage } from 'api/apiHelpers'
import { usePhoneValidationRemainingAttempts } from 'features/identityCheck/api/usePhoneValidationRemainingAttempts'
import { useSendPhoneValidationMutation } from 'features/identityCheck/api/useSendPhoneValidationMutation'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { formatPhoneNumberWithPrefix } from 'features/identityCheck/pages/phoneValidation/helpers/formatPhoneNumber'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/firebase/analytics'
import { plural } from 'libs/plural'
import { QueryKeys } from 'libs/queryKeys'
import { queryClient } from 'libs/react-query/queryClient'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Close } from 'ui/svg/icons/Close'
import { Spacer, Typo } from 'ui/theme'

export interface CodeNotReceivedModalProps {
  isVisible: boolean
  dismissModal: () => void
}

export const CodeNotReceivedModal: FunctionComponent<CodeNotReceivedModalProps> = (props) => {
  const { phoneValidation } = useSubscriptionContext()
  const { remainingAttempts, isLastAttempt } = usePhoneValidationRemainingAttempts()
  const { navigate } = useNavigation<UseNavigationType>()
  const { showErrorSnackBar } = useSnackBarContext()

  const requestsWording = plural(remainingAttempts ?? 0, {
    one: '# demande',
    other: '# demandes',
  })

  const { mutate: sendPhoneValidationCode, isLoading } = useSendPhoneValidationMutation({
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.PHONE_VALIDATION_REMAINING_ATTEMPTS])
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

  const requestSendPhoneValidationCode = useCallback(async () => {
    analytics.logHasRequestedCode()
    const callingCode = phoneValidation?.country.callingCodes[0]
    const phoneNumber = phoneValidation?.phoneNumber
    if (callingCode && phoneNumber) {
      const phoneNumberWithPrefix = formatPhoneNumberWithPrefix(phoneNumber, callingCode)
      sendPhoneValidationCode(phoneNumberWithPrefix)
    }
  }, [phoneValidation?.country.callingCodes, phoneValidation?.phoneNumber, sendPhoneValidationCode])

  return (
    <AppModal
      visible={props.isVisible}
      title="Code non reçu&nbsp;?"
      rightIconAccessibilityLabel="Fermer la modale"
      rightIcon={Close}
      onRightIconPress={props.dismissModal}>
      <React.Fragment>
        <StyledBody>
          Si après 5 minutes tu n’as pas reçu ton code de validation, tu peux en demander un
          nouveau.
        </StyledBody>
        <Spacer.Column numberOfSpaces={8} />
        <BottomContentContainer>
          <WarningContainer>
            <Typo.CaptionNeutralInfo>Attention, il te reste&nbsp;: </Typo.CaptionNeutralInfo>
            <WarningRemainingAttempts isLastAttempt={isLastAttempt}>
              {requestsWording}
            </WarningRemainingAttempts>
          </WarningContainer>
          <Spacer.Column numberOfSpaces={2} />
          <ButtonPrimary
            type="submit"
            onPress={requestSendPhoneValidationCode}
            wording="Demander un autre code"
            isLoading={isLoading}
          />
        </BottomContentContainer>
      </React.Fragment>
    </AppModal>
  )
}

const StyledBody = styled(Typo.Body)({
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
