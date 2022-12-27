import React, { FunctionComponent, useState } from 'react'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { extractApiErrorMessage } from 'api/apiHelpers'
import { useReportOfferMutation } from 'features/offer/api/useReportOffer'
import { useReasonsForReporting } from 'features/offer/helpers/useReasonsForReporting/useReasonsForReporting'
import { QueryKeys } from 'libs/queryKeys'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { SectionRow } from 'ui/components/SectionRow'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { getSpacing, Spacer } from 'ui/theme'

interface Props {
  dismissModal: () => void
  onPressOtherReason: () => void
  offerId: number
}

const marginVertical = getSpacing(3)

export const ReportOfferReason: FunctionComponent<Props> = (props) => {
  const { data } = useReasonsForReporting()
  const [selectedReason, setSelectedReason] = useState('')
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()
  const queryClient = useQueryClient()

  const reasonsForReporting = Object.entries(data?.reasons ?? []).map(([key, value]) => {
    return {
      id: key,
      ...value,
    }
  })

  const { mutate } = useReportOfferMutation({
    offerId: props.offerId,
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.REPORTED_OFFERS)
      showSuccessSnackBar({
        message: 'Ton signalement a bien été pris en compte',
        timeout: SNACK_BAR_TIME_OUT,
      })
      props.dismissModal()
    },
    onError: (error) => {
      showErrorSnackBar({ message: extractApiErrorMessage(error), timeout: SNACK_BAR_TIME_OUT })
    },
  })

  function reportOffer() {
    mutate({ reason: selectedReason })
  }

  return (
    <Form.MaxWidth>
      {reasonsForReporting.map((reason) => {
        return reason.id !== 'OTHER' ? (
          <RadioButton
            key={reason.id}
            label={reason.title}
            description={reason.description}
            isSelected={selectedReason === reason.id}
            onSelect={() => setSelectedReason(reason.id)}
            marginVertical={marginVertical}
          />
        ) : (
          <StyledSectionRow
            title={reason.title}
            type="navigable"
            onPress={props.onPressOtherReason}
            key="other"
          />
        )
      })}
      <Spacer.Column numberOfSpaces={10.5} />
      <ButtonPrimary wording="Signaler l’offre" disabled={!selectedReason} onPress={reportOffer} />
    </Form.MaxWidth>
  )
}

const StyledSectionRow = styled(SectionRow)({
  marginVertical,
})
