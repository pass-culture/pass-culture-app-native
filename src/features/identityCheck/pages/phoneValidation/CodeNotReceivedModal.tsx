import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { extractApiErrorMessage, isApiError } from 'api/apiHelpers'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { formatPhoneNumberWithPrefix } from 'features/identityCheck/pages/phoneValidation/helpers/formatPhoneNumber'
import { usePhoneValidationRemainingAttemptsQuery } from 'features/identityCheck/queries/usePhoneValidationRemainingAttemptsQuery'
import { useSendPhoneValidationMutation } from 'features/identityCheck/queries/useSendPhoneValidationMutation'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { analytics } from 'libs/analytics/provider'
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
  const { remainingAttempts, isLastAttempt } = usePhoneValidationRemainingAttemptsQuery()
  const { navigate } = useNavigation<UseNavigationType>()
  const { showErrorSnackBar } = useSnackBarContext()

  const requestsWording = plural(remainingAttempts ?? 0, {
    singular: '# demande',
    plural: '# demandes',
  })

  const { mutate: sendPhoneValidationCode, isPending } = useSendPhoneValidationMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PHONE_VALIDATION_REMAINING_ATTEMPTS] })
      props.dismissModal()
    },
    onError: (error: unknown) => {
      props.dismissModal()
      if (isApiError(error) && error.content?.code === 'TOO_MANY_SMS_SENT') {
        navigate(...getSubscriptionHookConfig('PhoneValidationTooManySMSSent'))
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
    const callingCode = phoneValidation?.country.callingCode
    const phoneNumber = phoneValidation?.phoneNumber
    if (callingCode && phoneNumber) {
      const phoneNumberWithPrefix = formatPhoneNumberWithPrefix(phoneNumber, callingCode)
      sendPhoneValidationCode(phoneNumberWithPrefix)
    }
  }, [phoneValidation?.country.callingCode, phoneValidation?.phoneNumber, sendPhoneValidationCode])

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
            <CaptionNeutralInfo>Attention, il te reste&nbsp;: </CaptionNeutralInfo>
            <WarningRemainingAttempts isLastAttempt={isLastAttempt}>
              {requestsWording}
            </WarningRemainingAttempts>
          </WarningContainer>
          <Spacer.Column numberOfSpaces={2} />
          <ButtonPrimary
            type="submit"
            onPress={requestSendPhoneValidationCode}
            wording="Demander un autre code"
            isLoading={isPending}
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

const WarningRemainingAttempts = styled(Typo.BodyAccentXs)<{ isLastAttempt: boolean }>(
  ({ theme, isLastAttempt }) => ({
    color: isLastAttempt
      ? theme.designSystem.color.text.error
      : theme.designSystem.color.text.default,
  })
)

const CaptionNeutralInfo = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
