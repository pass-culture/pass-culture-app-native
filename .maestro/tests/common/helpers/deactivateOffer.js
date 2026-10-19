const e2eBaseUrl = `${MAESTRO_E2E_ENDPOINT}`.replace(/\/account$/, '')

const response = http.post(`${e2eBaseUrl}/offer/${output.offerId}/deactivate`, {
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': `${MAESTRO_E2E_API_KEY}`,
    },
    body: JSON.stringify({}),
})

if (response.status !== 200) {
    throw new Error(`Failed to deactivate offer: ${response.status} - ${response.body}`)
}
