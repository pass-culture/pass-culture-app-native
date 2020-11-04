import { iOSShadowInput, iOSShadowOutput } from './shadow.d'

/* 
  The ".toString()" functions called are used to avoid 
  "Expected style shadowXXXXX: 0.15px to be unitless" warnings.
*/
export function getShadow(shadowInput: iOSShadowInput): iOSShadowOutput {
  return {
    shadowOffset: {
      width: shadowInput.shadowOffset.width.toString(),
      height: shadowInput.shadowOffset.height.toString(),
    },
    shadowRadius: shadowInput.shadowRadius,
    shadowColor: shadowInput.shadowColor,
    shadowOpacity: shadowInput.shadowOpacity.toString(),
  }
}
