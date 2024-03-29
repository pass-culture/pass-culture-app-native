import { Dispatch, SetStateAction } from 'react'

export type DisabilitiesProperties = {
  isAudioDisabilityCompliant: boolean | undefined
  isMentalDisabilityCompliant: boolean | undefined
  isMotorDisabilityCompliant: boolean | undefined
  isVisualDisabilityCompliant: boolean | undefined
}

export type IAccessibilityFiltersContext = {
  disabilities: DisabilitiesProperties
  setDisabilities: Dispatch<SetStateAction<DisabilitiesProperties>>
}
