import { env } from 'libs/environment'

const CONTENTFUL_DOMAIN_URL = 'https://cdn.contentful.com'
export const CONTENTFUL_BASE_URL = `${CONTENTFUL_DOMAIN_URL}/spaces/${env.CONTENTFUL_SPACE_ID}/environments/${env.CONTENTFUL_ENVIRONMENT}`
