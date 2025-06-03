import { useMutation } from 'react-query'

const ACCESS_TOKEN = 'nope'

export const useVertexAIMutation = ({ onSuccess }) => {
  return useMutation({
    onSuccess,
    mutationFn: (rawQuery: string) => fetchVertexAI(rawQuery),
  })
}

const url =
  'https://europe-west1-aiplatform.googleapis.com/v1/projects/passculture-metier-ehp/locations/europe-west1/publishers/google/models/gemini-2.0-flash-001:generateContent'
const fetchVertexAI = async (rawQuery: string) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: newFunction(rawQuery),
              },
            ],
          },
        ],
      }),
    })
    if (!response.ok) throw new Error('Failed to fetch vertex AI')
    return await response.json()
  } catch (_error) {
    return []
  }
}
const newFunction = (rawQuery: string) =>
  `
Je voudrais analyser une phrase énoncée par un jeune âgé de 15 à 21 ans formulant une demande de recherche d'offre culturelle en France à la fois sur le territoire hexagonal et dans les territoires d'outre-mer.

Extrais-moi la category d'offre culturelle et le price de la demande et toute information que tu juges essentielle dans un paramètre query.
Si c'est un titre de film, ne mets que le titre dans la query.

Donne-moi uniquement un dictionnaire JSON sans markdown avec ces trois paramètres. Si tu ne trouves pas un de ces trois paramètres, indique null.

Voici la phrase du jeune : ${rawQuery}.

Le paramètre category doit appartenir à un élément de la liste suivante : 'ARTS_LOISIRS_CREATIFS', 'CARTES_JEUNES', 'CONCERTS_FESTIVALS', 'EVENEMENTS_EN_LIGNE', 'CINEMA', 'FILMS_DOCUMENTAIRES_SERIES', 'JEUX_JEUX_VIDEOS', 'LIVRES', 'MEDIA_PRESSE', 'MUSEES_VISITES_CULTURELLES', 'MUSIQUE', 'NONE', 'RENCONTRES_CONFERENCES', 'SPECTACLES'
`
