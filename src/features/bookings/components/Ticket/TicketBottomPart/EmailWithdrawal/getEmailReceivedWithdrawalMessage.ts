import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { LINE_BREAK } from 'ui/theme/constants'

export const getEmailReceivedWithdrawalMessage = ({
  isEventDay,
  isDuo,
  userEmail,
}: {
  isEventDay: boolean
  isDuo: boolean
  userEmail: UserProfileResponseWithoutSurvey['email']
}) => {
  const startTextEventDay =
    'C’est aujourd’hui\u00a0!' +
    LINE_BREAK +
    `Tu as dû recevoir ${isDuo ? 'tes billets' : 'ton billet'}`
  const startTextBeforeEventDay = isDuo
    ? 'Tes billets t’ont été envoyés'
    : 'Ton billet t’a été envoyé'
  const endText = ` par e-mail à l’adresse ${userEmail}. Pense à vérifier tes spams.`

  return (isEventDay ? startTextEventDay : startTextBeforeEventDay) + endText
}
