import { t } from '@lingui/macro'
import React, { FunctionComponent, useState } from 'react'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { extractApiErrorMessage } from 'api/apiHelpers'
import { useReportOfferMutation } from 'features/offer/services/useReportOffer'
import { QueryKeys } from 'libs/queryKeys'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { LargeTextInput } from 'ui/components/inputs/LargeTextInput'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

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
    <React.Fragment>
      <Intro>{t`Décris en quelques mots la raison pour laquelle tu souhaites signaler cette offre.`}</Intro>
      <Spacer.Column numberOfSpaces={4} />
      <InputTitle>{t`Autre raison`}</InputTitle>
      <Spacer.Column numberOfSpaces={2} />
      <LargeTextInput value={inputText} onChangeText={setInputText} maxLength={200} />
      <Spacer.Column numberOfSpaces={6} />
      <ButtonPrimary
        title={t`Signaler l'offre`}
        disabled={!inputText}
        onPress={reportOffer}
        testId="report-other-button"
      />
    </React.Fragment>
  )
}

const Intro = styled(Typo.Caption)({
  textAlign: 'left',
  color: ColorsEnum.GREY_DARK,
})

const InputTitle = styled(Typo.ButtonText)({
  textAlign: 'left',
})
