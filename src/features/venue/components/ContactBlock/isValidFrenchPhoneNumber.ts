export const isValidFrenchPhoneNumber = (phonenumber: string) => {
  const metropolitanFranceReg = new RegExp(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/)
  const overseasFranceReg = new RegExp(
    /^(?:(?:\+|00|0)((262|692)|(263|693)|508|(5|6)90|691|(5|6)94|(5|6|7)96|697|681|687|689))(?:[\s.-]*\d{2}){3,4}$/ //NOSONAR(typescript:S5843) Regex simplification is not possible below a complexity index of 20
  )
  // 262, 263 = La Réunion, Mayotte
  // 508 = Saint-Pierre-et-Miquelon
  // 590 = Guadeloupe, Saint-Martin et Saint-Barthélemy
  // 594 = Guyane française
  // 596 = Martinique
  // 681 = Wallis-et-Futuna
  // 687 = Nouvelle-Calédonie
  // 689 = Polynésie française
  return (
    metropolitanFranceReg.exec(phonenumber) !== null || overseasFranceReg.exec(phonenumber) !== null
  )
}
