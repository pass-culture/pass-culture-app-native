import { QFBonificationStatus, DisabilityBonificationStatus } from 'api/gen'
import { BonificationType } from 'features/bonification/enums'
import { getBonificationButtonContent } from 'features/profile/helpers/getBonificationButtonContent'

const cases = [
  {
    name: 'QF - started',
    type: BonificationType.FAMILY_QUOTIENT,
    status: QFBonificationStatus.started,
    expected: {
      label: 'En cours de traitement',
      accessibilityLabel: 'En cours de traitement pour le bonus quotient familial',
      disabled: true,
    },
  },
  {
    name: 'Disability - started',
    type: BonificationType.DISABILITY,
    status: DisabilityBonificationStatus.started,
    expected: {
      label: 'En cours de traitement',
      accessibilityLabel: 'En cours de traitement pour le bonus situation de handicap',
      disabled: true,
    },
  },
  {
    name: 'QF - granted',
    type: BonificationType.FAMILY_QUOTIENT,
    status: QFBonificationStatus.granted,
    expected: {
      label: 'Bonus obtenu',
      accessibilityLabel: 'Bonus obtenu pour le bonus quotient familial',
      disabled: true,
    },
  },
  {
    name: 'Disability - granted',
    type: BonificationType.DISABILITY,
    status: DisabilityBonificationStatus.granted,
    expected: {
      label: 'Bonus obtenu',
      accessibilityLabel: 'Bonus obtenu pour le bonus situation de handicap',
      disabled: true,
    },
  },
  {
    name: 'QF - default',
    type: BonificationType.FAMILY_QUOTIENT,
    status: QFBonificationStatus.not_eligible,
    expected: {
      label: 'Faire une demande',
      accessibilityLabel: 'Faire une demande de bonus quotient familial',
      disabled: false,
    },
  },
  {
    name: 'Disability - default',
    type: BonificationType.DISABILITY,
    status: DisabilityBonificationStatus.not_eligible,
    expected: {
      label: 'Faire une demande',
      accessibilityLabel: 'Faire une demande de bonus situation de handicap',
      disabled: false,
    },
  },
  {
    name: 'null status fallback',
    type: BonificationType.FAMILY_QUOTIENT,
    status: null,
    expected: {
      label: 'Faire une demande',
      accessibilityLabel: 'Faire une demande de bonus quotient familial',
      disabled: false,
    },
  },
  {
    name: 'undefined status fallback',
    type: BonificationType.DISABILITY,
    status: undefined,
    expected: {
      label: 'Faire une demande',
      accessibilityLabel: 'Faire une demande de bonus situation de handicap',
      disabled: false,
    },
  },
]

describe('getBonificationButtonContent', () => {
  it.each(cases)('$name', ({ type, status, expected }) => {
    expect(getBonificationButtonContent(type, status)).toEqual(expected)
  })
})
