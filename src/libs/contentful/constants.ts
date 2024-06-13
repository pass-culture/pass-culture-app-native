import { env } from 'libs/environment'

const CONTENTFUL_DOMAIN_URL = 'https://cdn.contentful.com'
export const CONTENTFUL_BASE_URL = `${CONTENTFUL_DOMAIN_URL}/spaces/${env.CONTENTFUL_SPACE_ID}/environments/${env.CONTENTFUL_ENVIRONMENT}`

export const REDESIGN_AB_TESTING_HOME_MODULES = [
  '4XbgmX7fVVgBMoCJiLiY9n',
  '1ZmUjN7Za1HfxlbAOJpik2',
  'a7y5X9eAxgL4RLMSCD3Wn',
  '4Fs4egA8G2z3fHgU2XQj3h',
]
