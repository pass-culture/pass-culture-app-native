import { t } from '@lingui/macro'
import { Alert } from 'react-native'

import { env } from 'libs/environment'
import { getExternal } from 'libs/fetch'
import { _ } from 'libs/i18n'

const CONTENTFUL_BASE_URL = 'https://cdn.contentful.com'
const DEPTH_LEVEL = 2

export const getHomepageEntries = async () => {
  try {
    const homepageData = await getExternal(
      `${CONTENTFUL_BASE_URL}/spaces/${env.CONTENTFUL_SPACE_ID}/environments/${env.CONTENTFUL_ENVIRONMENT}/entries?include=${DEPTH_LEVEL}&content_type=homepage&access_token=${env.CONTENTFUL_ACCESS_TOKEN}`
    )
    return homepageData
  } catch (error) {
    Alert.alert(
      _(t`Échec de la récupération du contenu Contentful pour la homepage ${error.message}`)
    )
  }
}
