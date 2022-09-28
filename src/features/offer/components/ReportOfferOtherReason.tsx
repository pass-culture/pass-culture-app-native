import { t } from '@lingui/macro'
import React, { FunctionComponent, useState } from 'react'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { extractApiErrorMessage } from 'api/apiHelpers'
import { useReportOfferMutation } from 'features/offer/services/useReportOffer'
import { QueryKeys } from 'libs/queryKeys'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { LargeTextInput } from 'ui/components/inputs/LargeTextInput'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  dismissModal: () => void
  offerId: number
}

export const ReportOfferOtherReason: FunctionComponent<Props> = (props) => {
  const [inputText, setInputText] = useState('')
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()
  const queryClient = useQueryClient()

  const { mutate } = useReportOfferMutation({
    offerId: props.offerId,
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.REPORTED_OFFERS)
      showSuccessSnackBar({
        message: t`Ton signalement a bien été pris en compte`,
        timeout: SNACK_BAR_TIME_OUT,
      })
      props.dismissModal()
    },
    onError: (error) => {
      showErrorSnackBar({ message: extractApiErrorMessage(error), timeout: SNACK_BAR_TIME_OUT })
    },
  })

  function reportOffer() {
    mutate({ reason: 'OTHER', customReason: inputText })
  }

  return (
    <Form.MaxWidth>
      <Intro>{t`Décris en quelques mots la raison pour laquelle tu souhaites signaler cette offre.`}</Intro>
      <Spacer.Column numberOfSpaces={4} />
      <LargeTextInput
        label={t`Autre raison`}
        value={inputText}
        onChangeText={setInputText}
        maxLength={200}
        autoFocus
        returnKeyType="default"
      />
      <Spacer.Column numberOfSpaces={6} />
      <ButtonPrimary
        wording={t`Signaler l'offre`}
        disabled={!inputText}
        onPress={reportOffer}
        testID="report-other-button"
      />
    </Form.MaxWidth>
  )
}

const Intro = styled(Typo.CaptionNeutralInfo)({
  textAlign: 'left',
})
