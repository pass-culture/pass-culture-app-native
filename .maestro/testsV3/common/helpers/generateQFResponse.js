const response = http.post(`${MAESTRO_E2E_ENDPOINT}/${user_id}/quotient_familial`, {
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': `${MAESTRO_E2E_API_KEY}`,
  },
  body: JSON.stringify({ mock_type }),
})

if (response.status !== 200) {
  throw new Error(`Failed to configure quotient familial: ${response.status} - ${response.body}`)
}
