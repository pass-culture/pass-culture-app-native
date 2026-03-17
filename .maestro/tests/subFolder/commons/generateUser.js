const response = http.post(`${MAESTRO_E2E_ENDPOINT}`, {
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': `${MAESTRO_E2E_API_KEY}`,
  },
  body: JSON.stringify({id_provider, step, age}),
})

if (response.status !== 200) {
  throw new Error(`Failed to generate user: ${response.status} - ${response.body}`)
}

const userData = json(response.body)

const email = userData.email
const token = userData.access_token
const exp = userData.expiration_timestamp

const baseUrl = `https://app.staging.passculture.team/signup-confirmation?email=${email}&expiration_timestamp=${exp}&token=${token}`

output.deeplinkIos = baseUrl

const encodedBaseUrl = encodeURIComponent(baseUrl)

output.deeplinkAndroid = `https://passcultureappstaging.page.link/?link=${encodedBaseUrl}&apn=app.passculture.staging&isi=1557887412&ibi=app.passculture.staging&efr=1`

output.userEmail = email