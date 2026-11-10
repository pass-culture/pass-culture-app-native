import { APIRequestContext } from '@playwright/test'

function getE2eCredentials() {
  const baseUrl = process.env.E2E_API_BASE_URL ?? ''
  const apiKey = process.env.E2E_API_KEY ?? ''
  if (!baseUrl || !apiKey) {
    throw new Error(
      'E2E_API_BASE_URL / E2E_API_KEY are not set — copy them into e2e/web/.env.secret (see e2e/web/README.md).'
    )
  }
  return { baseUrl, apiKey }
}

type GeneratedUser = {
  userId: number
  email: string
  confirmationPath: string
}

export async function generateBeneficiaryUser(request: APIRequestContext): Promise<GeneratedUser> {
  const { baseUrl, apiKey } = getE2eCredentials()
  const response = await request.post(`${baseUrl}/account`, {
    headers: { 'x-api-key': apiKey },
    data: { id_provider: 'UBBLE', step: 'BENEFICIARY', age: 18 },
  })
  if (!response.ok()) {
    throw new Error(`generateBeneficiaryUser failed: ${response.status()} ${await response.text()}`)
  }
  const body = await response.json()
  const confirmationPath =
    `/signup-confirmation?email=${encodeURIComponent(body.email)}` +
    `&expiration_timestamp=${body.expiration_timestamp}&token=${body.access_token}`
  return { userId: body.id, email: body.email, confirmationPath }
}

type GeneratedOffer = {
  id: number
  name: string
}

async function generateOffer(
  request: APIRequestContext,
  overrides: { name: string; subcategoryId: string }
): Promise<GeneratedOffer> {
  const { baseUrl, apiKey } = getE2eCredentials()
  const response = await request.post(`${baseUrl}/offer`, {
    headers: { 'x-api-key': apiKey },
    data: {
      name: overrides.name,
      price: 10,
      subcategory_id: overrides.subcategoryId,
      is_duo: false,
      timezone: 'Europe/Paris',
    },
  })
  if (!response.ok()) {
    throw new Error(`generateOffer failed: ${response.status()} ${await response.text()}`)
  }
  const body = await response.json()
  return { id: body.id, name: body.name }
}

export function generateCinemaOffer(request: APIRequestContext): Promise<GeneratedOffer> {
  return generateOffer(request, {
    name: `E2E web - séance cinéma ${Date.now()}`,
    subcategoryId: 'SEANCE_CINE',
  })
}

export async function deactivateOffer(request: APIRequestContext, offerId: number): Promise<void> {
  const { baseUrl, apiKey } = getE2eCredentials()
  await request.post(`${baseUrl}/offer/${offerId}/deactivate`, {
    headers: { 'x-api-key': apiKey },
  })
}
