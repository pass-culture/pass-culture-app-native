import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import { useState } from 'react'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { extractApiErrorMessage } from 'api/helpers'
import { useReportOfferMutation } from 'features/offer/services/useReportOffer'
import { QueryKeys } from 'libs/queryKeys'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { RadioButton } from 'ui/components/RadioButton'
import { SectionRow } from 'ui/components/SectionRow'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Spacer } from 'ui/theme'

interface Props {
  isVisible: boolean
  dismissModal: () => void
  onGoBack: () => void
  onPressOtherReason: () => void
  offerId: number
}

// TODO(PC-9943) get report offer reasons from api.getnativev1offerreportreasons
const REASONS_FOR_REPORTING = [
  {
    id: 'IMPROPER',
    title: t`La description est non conforme`,
    subtitle: t`(La date ne correspond pas, mauvaise description…)`,
  },
  {
    id: 'PRICE_TOO_HIGH',
    title: t`Le tarif est trop élevé`,
    subtitle: t`(comparé à l’offre public)`,
  },
  {
    id: 'INAPPROPRIATE',
    title: t`Le contenu est inapproprié`,
    subtitle: t`(violence, incitation à la haine, nudité...)`,
  },
]

export const ReportOfferReasonModal: FunctionComponent<Props> = (props) => {
  const [selectedReason, setSelectedReason] = useState('')
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
    mutate({ reason: selectedReason })
  }

  return (
    <AppModal
      visible={props.isVisible}
      title={t`Pourquoi signales-tu` + '\n' + t`cette offre ?`}
      rightIcon={Close}
      onRightIconPress={props.dismissModal}
      leftIcon={ArrowPrevious}
      onLeftIconPress={props.onGoBack}
      onBackdropPress={props.dismissModal}>
      <ModalContent>
        <Spacer.Column numberOfSpaces={3} />
        <RadioButton choices={REASONS_FOR_REPORTING} onSelect={setSelectedReason} />
        <SectionRow title={t`Autre`} type={'navigable'} onPress={props.onPressOtherReason} />
        <Spacer.Column numberOfSpaces={10.5} />
        <ButtonPrimary
          title={t`Signaler l'offre`}
          disabled={!selectedReason}
          onPress={reportOffer}
          testId="report-button"
        />
      </ModalContent>
    </AppModal>
  )
}

const ModalContent = styled.View({
  width: '100%',
})
