const MIN_ARTISTS = 2
const MAX_VENUES_TO_CHECK = 10
const VENUE_PAGE_OFFERS_COUNT = 50
const ARTIST_SUBCATEGORY = 'LIVRE_PAPIER'
const REGEX_SPECIAL_CHARACTERS = /[.*+?^${}()|[\]\\]/

function isRegexSafe(text) {
  return !REGEX_SPECIAL_CHARACTERS.test(text)
}

function searchOffers(params) {
  const response = http.post(
    `https://${MAESTRO_ALGOLIA_APP_ID}-dsn.algolia.net/1/indexes/${encodeURIComponent(MAESTRO_ALGOLIA_OFFERS_INDEX)}/query`,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Algolia-Application-Id': `${MAESTRO_ALGOLIA_APP_ID}`,
        'X-Algolia-API-Key': `${MAESTRO_ALGOLIA_PUBLIC_API_KEY}`,
      },
      body: JSON.stringify(Object.assign({
        query: '',
        attributesToHighlight: [],
        // Match the venue queries for the anonymous user in this flow.
        facetFilters: ['offer.isEducational:false'],
        numericFilters: ['offer.prices: 0 TO 300'],
      }, params)),
    }
  )

  if (response.status !== 200) {
    throw new Error(`Failed to search offers: ${response.status} - ${response.body}`)
  }

  return json(response.body).hits
}

function countBookArtistsOfOffersWithImage(venueOffers) {
  const artistIds = {}
  venueOffers.forEach(function (hit) {
    // Only count the supported book category targeted by this staging fixture.
    if (!hit.offer || !hit.offer.thumbUrl || hit.offer.subcategoryId !== ARTIST_SUBCATEGORY) return
    const artists = hit.artists || []
    artists.forEach(function (artist) {
      if (artist.id) artistIds[artist.id] = true
    })
  })
  return Object.keys(artistIds).length
}

const bookOffers = searchOffers({
  hitsPerPage: 100,
  filters: `offer.subcategoryId:${ARTIST_SUBCATEGORY}`,
  attributesToRetrieve: ['venue.id'],
})

const venueIds = []
bookOffers.forEach(function (hit) {
  if (hit.venue && hit.venue.id && venueIds.indexOf(hit.venue.id) === -1) venueIds.push(hit.venue.id)
})

let venue

for (let index = 0; index < venueIds.length && index < MAX_VENUES_TO_CHECK && !venue; index++) {
  const venueOffers = searchOffers({
    hitsPerPage: VENUE_PAGE_OFFERS_COUNT,
    filters: `venue.id:${venueIds[index]}`,
    attributesToRetrieve: ['offer.thumbUrl', 'offer.subcategoryId', 'artists'],
  })
  if (countBookArtistsOfOffersWithImage(venueOffers) < MIN_ARTISTS) continue

  // A screening can also enter the page through its top-offers query.
  const movieOffers = searchOffers({
    hitsPerPage: 1,
    filters: `venue.id:${venueIds[index]} AND offer.subcategoryId:SEANCE_CINE`,
    attributesToRetrieve: [],
  })
  if (movieOffers.length > 0) continue

  const venueResponse = http.get(`${MAESTRO_API_BASE_URL}/native/v2/venue/${venueIds[index]}`)
  if (venueResponse.status !== 200) continue

  const candidate = json(venueResponse.body)
  if (!isRegexSafe(candidate.name)) continue

  venue = candidate
}

if (!venue) {
  throw new Error(`No venue with at least ${MIN_ARTISTS} artists found`)
}

output.venueId = venue.id
output.venueName = venue.name
output.venueDeeplink = `passculturestaging://lieu/${venue.id}`
