const MIN_ARTISTS = 2
const REGEX_SPECIAL_CHARACTERS = /[.*+?^${}()|[\]\\]/

function isRegexSafe(text) {
  return !REGEX_SPECIAL_CHARACTERS.test(text)
}

function getArtistsWithId(artists) {
  return (artists || []).filter(function (artist) {
    return !!artist.id
  })
}

const offersResponse = http.post(
  `https://${MAESTRO_ALGOLIA_APP_ID}-dsn.algolia.net/1/indexes/${encodeURIComponent(MAESTRO_ALGOLIA_OFFERS_INDEX)}/query`,
  {
    headers: {
      'Content-Type': 'application/json',
      'X-Algolia-Application-Id': `${MAESTRO_ALGOLIA_APP_ID}`,
      'X-Algolia-API-Key': `${MAESTRO_ALGOLIA_PUBLIC_API_KEY}`,
    },
    body: JSON.stringify({
      query: '',
      hitsPerPage: 100,
      filters: `offer.subcategoryId:${subcategory_id}`,
      attributesToRetrieve: ['artists'],
      attributesToHighlight: [],
    }),
  }
)

if (offersResponse.status !== 200) {
  throw new Error(`Failed to search offers: ${offersResponse.status} - ${offersResponse.body}`)
}

const candidates = json(offersResponse.body).hits.filter(function (hit) {
  return getArtistsWithId(hit.artists).length >= MIN_ARTISTS
})

let offer
let offerArtist

for (let index = 0; index < candidates.length && !offer; index++) {
  const offerResponse = http.get(`${MAESTRO_API_BASE_URL}/native/v3/offer/${candidates[index].objectID}`)
  if (offerResponse.status !== 200) continue

  const candidate = json(offerResponse.body)
  if (candidate.isExpired || !candidate.isReleased || !isRegexSafe(candidate.name)) continue

  const artistsWithId = getArtistsWithId(candidate.artists)
  if (artistsWithId.length < MIN_ARTISTS) continue

  const safeArtist = artistsWithId.filter(function (artist) {
    return isRegexSafe(artist.name)
  })[0]
  if (!safeArtist) continue

  offer = candidate
  offerArtist = safeArtist
}

if (!offer) {
  throw new Error(`No ${subcategory_id} offer with at least ${MIN_ARTISTS} artists found`)
}

output.offerId = offer.id
output.offerName = offer.name
output.offerDeeplink = `passculturestaging://offre/${offer.id}`
output.offerArtistsCount = offer.artists.length
output.offerArtistName = offerArtist.name
