const MIN_SIMILAR_ARTISTS = 2
const REGEX_SPECIAL_CHARACTERS = /[.*+?^${}()|[\]\\]/

function isRegexSafe(text) {
  return !REGEX_SPECIAL_CHARACTERS.test(text)
}

const artistsResponse = http.post(
  `https://${MAESTRO_ALGOLIA_APP_ID}-dsn.algolia.net/1/indexes/${encodeURIComponent(MAESTRO_ALGOLIA_ARTISTS_INDEX)}/query`,
  {
    headers: {
      'Content-Type': 'application/json',
      'X-Algolia-Application-Id': `${MAESTRO_ALGOLIA_APP_ID}`,
      'X-Algolia-API-Key': `${MAESTRO_ALGOLIA_PUBLIC_API_KEY}`,
    },
    body: JSON.stringify({
      query: `${artist_name}`,
      hitsPerPage: 20,
      attributesToRetrieve: ['name'],
      attributesToHighlight: [],
    }),
  }
)

if (artistsResponse.status !== 200) {
  throw new Error(`Failed to search artist: ${artistsResponse.status} - ${artistsResponse.body}`)
}

const expectedName = `${artist_name}`.trim().toLowerCase()
const artist = json(artistsResponse.body).hits.filter(function (hit) {
  return hit.name.trim().toLowerCase() === expectedName
})[0]

if (!artist) {
  throw new Error(`Artist "${artist_name}" not found in Algolia index ${MAESTRO_ALGOLIA_ARTISTS_INDEX}`)
}

const artistResponse = http.get(`${MAESTRO_API_BASE_URL}/native/v1/artists/${artist.objectID}`)

if (artistResponse.status !== 200) {
  throw new Error(`Failed to get artist ${artist.objectID}: ${artistResponse.status} - ${artistResponse.body}`)
}

const similarArtistsResponse = http.get(`${MAESTRO_API_BASE_URL}/native/v1/artists/${artist.objectID}/similar`)

if (similarArtistsResponse.status !== 200) {
  throw new Error(
    `Failed to get similar artists of ${artist.objectID}: ${similarArtistsResponse.status} - ${similarArtistsResponse.body}`
  )
}

const similarArtists = json(similarArtistsResponse.body).artists

if (similarArtists.length < MIN_SIMILAR_ARTISTS) {
  throw new Error(`Artist "${artist.name}" has ${similarArtists.length} similar artist(s), ${MIN_SIMILAR_ARTISTS} expected`)
}

const similarArtist = similarArtists.filter(function (similar) {
  return isRegexSafe(similar.name)
})[0]

if (!similarArtist) {
  throw new Error(`No similar artist of "${artist.name}" can be used as a Maestro selector`)
}

output.artistId = artist.objectID
output.artistName = artist.name
output.artistDeeplink = `passculturestaging://artiste/${artist.objectID}`
output.similarArtistName = similarArtist.name
output.similarArtistsCount = similarArtists.length
