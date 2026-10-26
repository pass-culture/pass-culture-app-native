const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
const MONTHS = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
]

const e2eBaseUrl = `${MAESTRO_E2E_ENDPOINT}`.replace(/\/account$/, '')

const response = http.post(`${e2eBaseUrl}/offer`, {
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': `${MAESTRO_E2E_API_KEY}`,
    },
    body: JSON.stringify({
        name: `E2E mobile ${subcategory_id} ${Date.now()}`,
        price: Number(price),
        subcategory_id,
        is_duo: `${is_duo}` === 'true',
        timezone: 'Europe/Paris',
    }),
})

if (response.status !== 200) {
    throw new Error(`Failed to generate offer: ${response.status} - ${response.body}`)
}

const offerData = json(response.body)

output.offerId = offerData.id
output.offerName = offerData.name

const offerPath = `offre/${offerData.id}`

output.offerDeeplink = `passculture-staging:///${offerPath}`

const screeningDay = new Date()
screeningDay.setDate(screeningDay.getDate() + 3)

output.offerScreeningDay = `${DAYS[screeningDay.getDay()]} ${screeningDay.getDate()} ${MONTHS[screeningDay.getMonth()]}`
