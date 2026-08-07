import { env } from 'libs/environment/env'

const CONTENTFUL_DOMAIN_URL = 'https://cdn.contentful.com'

// Function so the environment override can mutate `env` before the URL is built.
export const getContentfulBaseUrl = () =>
  `${CONTENTFUL_DOMAIN_URL}/spaces/${env.CONTENTFUL_SPACE_ID}/environments/${env.CONTENTFUL_ENVIRONMENT}`
