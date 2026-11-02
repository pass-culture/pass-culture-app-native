import React, { FunctionComponent } from 'react'

import { CinemaScreeningDetails } from 'features/bookings/components/CinemaScreeningDetailsModal/CinemaScreeningDetails'
import { CinemaScreeningDetailsModalProps } from 'features/bookings/components/CinemaScreeningDetailsModal/types'
import { ModalDetailed } from 'ui/designSystem/ModalDetailed/ModalDetailed'

export const CinemaScreeningDetailsModal: FunctionComponent<CinemaScreeningDetailsModalProps> = ({
  onClose,
  details,
}) => (
  <ModalDetailed
    title="Informations sur la séance"
    onClose={onClose}
    closeAccessibilityLabel="Fermer la modale d’informations sur la séance"
    hasFixedFooter
    primaryButton={{
      wording: 'Fermer',
      accessibilityLabel: 'Fermer les informations sur la séance',
      onPress: onClose,
    }}>
    <CinemaScreeningDetails details={details} />
  </ModalDetailed>
)
