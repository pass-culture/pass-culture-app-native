import React, { FunctionComponent } from 'react'

import { CinemaScreeningDetails } from 'features/bookings/components/CinemaScreeningDetailsModal/CinemaScreeningDetails'
import { CinemaScreeningDetailsModalProps } from 'features/bookings/components/CinemaScreeningDetailsModal/types'
import { ModalDetailed } from 'ui/designSystem/ModalDetailed/ModalDetailed'

const CLOSE_MODAL_ACCESSIBILITY_LABEL = 'Fermer la modale d’informations sur la séance'
const CLOSE_BUTTON_ACCESSIBILITY_LABEL = 'Fermer les informations sur la séance'

export const CinemaScreeningDetailsModal: FunctionComponent<CinemaScreeningDetailsModalProps> = ({
  onClose,
  details,
}) => (
  <ModalDetailed
    title="Informations sur la séance"
    onClose={onClose}
    closeAccessibilityLabel={CLOSE_MODAL_ACCESSIBILITY_LABEL}
    hasFixedFooter
    primaryButton={{
      wording: 'Fermer',
      accessibilityLabel: CLOSE_BUTTON_ACCESSIBILITY_LABEL,
      onPress: onClose,
    }}>
    <CinemaScreeningDetails details={details} />
  </ModalDetailed>
)
