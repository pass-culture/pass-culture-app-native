export const ALGOLIA_PRODUCTION_APPLICATION_ID = 'E2IKXJ325N'
export const ALGOLIA_PRODUCTION_SEARCH_API_KEY = 'b451e96ac8d8323c321d8cc86e4a8b0a'
const PRODUCTION_WEBAPP_URL = 'https://passculture.app'
const PRODUCTION_IMAGE_RESIZING_URL = 'https://image-resizing.passculture.app'
const PRODUCTION_STORAGE_ORIGIN = 'https://storage.googleapis.com'
const OFFER_IMAGE_SIZE = 256

export const MAX_QUERY_LENGTH = 500
export const COMPLETION_TIMEOUT_IN_MS = 60_000

const COMPLETION_QUERY_PARAMS =
  'compatibilityMode=ai-sdk-5&stream=true&analytics=false&cache=false&memory=false'

export const buildCompletionUrl = (agentId: string): string =>
  `https://${ALGOLIA_PRODUCTION_APPLICATION_ID}.algolia.net/agent-studio/1/agents/${encodeURIComponent(agentId)}/completions?${COMPLETION_QUERY_PARAMS}`

export const buildProductionOfferUrl = (offerId: string): string =>
  `${PRODUCTION_WEBAPP_URL}/offre/${encodeURIComponent(offerId)}`

export const buildProductionImageUrl = (thumbUrl: string): string => {
  const filename = thumbUrl.replace(PRODUCTION_STORAGE_ORIGIN, '').replace(/^\//, '')
  return `${PRODUCTION_IMAGE_RESIZING_URL}/?size=${OFFER_IMAGE_SIZE}&filename=${filename}`
}

export const SAMPLE_QUERIES: { label: string; query: string }[] = [
  { label: 'Sortie ce soir', query: 'Je m’ennuie, je fais quoi ce soir\u00a0?' },
  { label: 'Concert à Lyon', query: 'Un concert de rap à Lyon ce week-end' },
  { label: 'Cadeau mangas', query: 'Un cadeau pour ma sœur qui adore les mangas' },
  { label: 'Gratuit', query: 'Qu’est-ce que je peux faire gratuitement\u00a0?' },
  { label: 'À deux', query: 'Une sortie à faire avec un ami' },
  { label: 'Numérique', query: 'Un abonnement pour écouter de la musique' },
  { label: 'Accessibilité', query: 'Un cinéma accessible en fauteuil roulant à Lille' },
  { label: 'Hors périmètre', query: 'Aide-moi à faire mon devoir de maths' },
]
