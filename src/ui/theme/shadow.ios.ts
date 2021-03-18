import { ShadowInput, iOSShadowOutput } from './shadow.d'

/* 
  The ".toString()" functions called are used to avoid 
  "Expected style shadowXXXXX: 0.15px to be unitless" warnings.
*/
export function getShadow(shadowInput: ShadowInput): iOSShadowOutput {
  return {
    shadowOffset: `${shadowInput.shadowOffset.width}px ${shadowInput.shadowOffset.height}px`,
    shadowRadius: shadowInput.shadowRadius,
    shadowColor: shadowInput.shadowColor,
    shadowOpacity: shadowInput.shadowOpacity.toString(),
  }
}

export function getNativeShadow(shadowInput: ShadowInput): ShadowInput {
  return shadowInput
}
