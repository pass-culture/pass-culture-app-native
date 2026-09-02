import { DisabilityBonificationStatus, QFBonificationStatus } from 'api/gen'
import { BonificationType } from 'features/bonification/enums'

type BonificationStatus = QFBonificationStatus | DisabilityBonificationStatus | null | undefined

type BonificationButtonProps = {
  label: string
  accessibilityLabel: string
  disabled: boolean
}

export const getBonificationButtonContent = (
  type: BonificationType,
  status: BonificationStatus
): BonificationButtonProps => {
  const bonificationLabel =
    type === BonificationType.FAMILY_QUOTIENT
      ? 'bonus quotient familial'
      : 'bonus situation de handicap'

  switch (status) {
    case QFBonificationStatus.started:
    case DisabilityBonificationStatus.started:
      return {
        label: 'En cours de traitement',
        accessibilityLabel: `En cours de traitement pour le ${bonificationLabel}`,
        disabled: true,
      }

    case QFBonificationStatus.granted:
    case DisabilityBonificationStatus.granted:
      return {
        label: 'Bonus obtenu',
        accessibilityLabel: `Bonus obtenu pour le ${bonificationLabel}`,
        disabled: true,
      }
    case QFBonificationStatus.eligible:
    case DisabilityBonificationStatus.eligible:
      return {
        label: 'Faire une demande',
        accessibilityLabel: `Faire une demande de ${bonificationLabel}`,
        disabled: false,
      }
    default:
      return {
        label: 'Vérifier ma demande',
        accessibilityLabel: `Vérifier ma demande de ${bonificationLabel}`,
        disabled: false,
      }
  }
}
