import { t } from '@lingui/macro'
import resolveResponse from 'contentful-resolve-response'
import { Alert } from 'react-native'

import { EntryCollection, EntryFields } from 'features/home/contentful.d'
import { env } from 'libs/environment'
import { getExternal } from 'libs/fetch'
import { _ } from 'libs/i18n'

const CONTENTFUL_BASE_URL = 'https://cdn.contentful.com'
const DEPTH_LEVEL = 2

export const getHomepageEntries = async () => {
  try {
    const homepageData: EntryCollection<EntryFields> = await getExternal(
      `${CONTENTFUL_BASE_URL}/spaces/${env.CONTENTFUL_SPACE_ID}/environments/${env.CONTENTFUL_ENVIRONMENT}/entries?include=${DEPTH_LEVEL}&content_type=homepage&access_token=${env.CONTENTFUL_ACCESS_TOKEN}`
    )
    return adaptHomepageEntries(homepageData)
  } catch (error) {
    Alert.alert(
      _(t`Échec de la récupération du contenu Contentful pour la homepage ${error.message}`)
    )
  }
}

const adaptHomepageEntries = (homepageData: EntryCollection<EntryFields>) => {
  const formattedResponse = resolveResponse(homepageData)
  /* Support good practice is to configure on Contentful dashboard only 1 contenttype homepage
    But there is not blocking on the dashboard, that's why we select first one here */
  return formattedResponse[0]
}
