import { HandicapAudio } from 'ui/svg/icons/HandicapAudio'
import { HandicapMental } from 'ui/svg/icons/HandicapMental'
import { HandicapMotor } from 'ui/svg/icons/HandicapMotor'
import { HandicapVisual } from 'ui/svg/icons/HandicapVisual'

export const CINEMA_SCREENING_CARD_WIDTH = 176
export const CINEMA_SCREENING_CARD_MIN_HEIGHT = 70

export const CINEMA_SCREENING_ACCESSIBILITY_ENTRIES = [
  { key: 'visual', Icon: HandicapVisual, label: 'Handicap visuel' },
  { key: 'audio', Icon: HandicapAudio, label: 'Handicap auditif' },
  { key: 'mental', Icon: HandicapMental, label: 'Handicap psychique ou cognitif' },
  { key: 'motor', Icon: HandicapMotor, label: 'Handicap moteur' },
] as const
