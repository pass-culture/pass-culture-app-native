const response = http.post(`${MAESTRO_E2E_ENDPOINT}`, {
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': `${MAESTRO_E2E_API_KEY}`,
  },
  body: JSON.stringify({id_provider, step, age}),
})

const userData = json(response.body)
output.userEmail = userData.email

if (response.status !== 200) {
  throw new Error(`Failed to generate user: ${response.status} - ${response.body}`)
}