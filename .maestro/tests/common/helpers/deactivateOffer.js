const response = http.post(`${MAESTRO_E2E_BASE_URL}/offer/${output.offerId}/deactivate`, {
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': `${MAESTRO_E2E_API_KEY}`,
    },
    body: JSON.stringify({}),
})

if (response.status !== 200) {
    throw new Error(`Failed to deactivate offer: ${response.status} - ${response.body}`)
}
