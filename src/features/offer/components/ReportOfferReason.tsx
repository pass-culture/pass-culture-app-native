import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import { useState } from 'react'
import { useQueryClient } from 'react-query'

import { extractApiErrorMessage } from 'api/apiHelpers'
import { useReasonsForReporting } from 'features/offer/services/useReasonsForReporting'
import { useReportOfferMutation } from 'features/offer/services/useReportOffer'
import { QueryKeys } from 'libs/queryKeys'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { RadioButton } from 'ui/components/RadioButton'
import { SectionRow } from 'ui/components/SectionRow'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Spacer } from 'ui/theme'
import { Form } from 'ui/web/form/Form'

interface Props {
  dismissModal: () => void
  onPressOtherReason: () => void
  offerId: number
}

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
    mutate({ reason: selectedReason })
  }

  return (
    <Form.MaxWidth>
      <Spacer.Column numberOfSpaces={3} />
      {reasonsForReporting.map((reason) =>
        reason.id !== 'OTHER' ? (
          <React.Fragment key={reason.id}>
            <RadioButton
              id={reason.id}
              title={reason.title}
              description={reason.description}
              onSelect={setSelectedReason}
              selectedValue={selectedReason}
            />
            <Spacer.Column numberOfSpaces={6} />
          </React.Fragment>
        ) : (
          <SectionRow
            title={reason.title}
            type={'navigable'}
            onPress={props.onPressOtherReason}
            key="other"
          />
        )
      )}
      <Spacer.Column numberOfSpaces={10.5} />
      <ButtonPrimary
        wording={t`Signaler l'offre`}
        disabled={!selectedReason}
        onPress={reportOffer}
        testID="report-button"
      />
    </Form.MaxWidth>
  )
}
