const response = http.post(`${MAESTRO_E2E_ENDPOINT}`, {
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': `${MAESTRO_E2E_API_KEY}`,
  },
  body: JSON.stringify({ id_provider, step, age }),
})

if (response.status !== 200) {
  throw new Error(`Failed to generate user: ${response.status} - ${response.body}`)
}

const userData = json(response.body)

output.userId = userData.id

const email = userData.email
const token = userData.access_token
const exp = userData.expiration_timestamp

const path = `signup-confirmation?email=${email}&expiration_timestamp=${exp}&token=${token}`
const baseUrl = `https://app.staging.passculture.team/${path}`

output.deeplinkIos = `passculture-staging:///${path}`

const encodedBaseUrl = encodeURIComponent(baseUrl)

output.deeplinkAndroid = `https://passcultureappstaging.page.link/?link=${encodedBaseUrl}&apn=app.passculture.staging&isi=1557887412&ibi=app.passculture.staging&efr=1`

output.userEmail = email
