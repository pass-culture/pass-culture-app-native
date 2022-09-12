import { t } from '@lingui/macro'

import { WEBAPP_V2_URL } from 'libs/environment'

const url = WEBAPP_V2_URL + '/accueil?utm_campaign=partage_app&utm_source=batch&utm_medium=app'

export const shareAppContent = {
  title: t`Partage le lien d’invitation`,
  message: t`Profite toi aussi de tous les bons plans du pass Culture\u00a0:`,
  url,
}
