import { ShadowInput } from '@pass-culture/id-check/src/ui/shadows/shadows'

// TODO: web integration
export function getShadow(shadowInput: ShadowInput) {
  return {
    shadowOffset: `${shadowInput.shadowOffset.width}px ${shadowInput.shadowOffset.height}px`,
    shadowRadius: shadowInput.shadowRadius,
    shadowColor: shadowInput.shadowColor,
    shadowOpacity: shadowInput.shadowOpacity.toString(),
  }
}

export function getNativeShadow(shadowInput: ShadowInput) {
  return shadowInput
}

export function getAnimatedNativeShadow(shadowInput: ShadowInput) {
  return shadowInput
}
