import { Platform } from 'react-native'

import { openUrl } from 'features/navigation/helpers'

export const isValidFrenchPhoneNumber = (phonenumber: string) => {
  const metropolitanFranceReg = new RegExp(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/)
  const overseasFranceReg = new RegExp(
    /^(?:(?:\+|00|0)((262|692)|(263|693)|508|(5|6)90|691|(5|6)94|(5|6|7)96|697|681|687|689))(?:[\s.-]*\d{2}){3,4}$/
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
    phonenumber.match(metropolitanFranceReg) !== null ||
    phonenumber.match(overseasFranceReg) !== null
  )
}

export async function openPhoneNumber(phone: string) {
  const url = Platform.OS === 'android' ? `tel:${phone}` : `telprompt:${phone}`
  await openUrl(url)
}

export async function openMail(mail: string) {
  const url = `mailto:${mail}`
  await openUrl(url)
}
