import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { SubcategoryIdEnum } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

export function useVenueProAdvicesQuery({
  venueId,
  enableProAdvices,
}: {
  venueId: number
  enableProAdvices: boolean
}) {
  return useQuery({
    queryKey: [QueryKeys.VENUE_ADVICES, venueId],
    queryFn: () => api.getNativeV1VenuevenueIdAdvices(venueId),
    enabled: enableProAdvices,
    staleTime: 60 * 60 * 1000,
    select: (data) => {
      if (data?.proAdvices.length === 0) {
        return {
          nbResults: 2,
          proAdvices: [
            {
              author: 'Cédric',
              content:
                'Lorsque j’ai découvert ce livre, j’ai été étonnée de sa longueur. Il me paraissait plutôt court pour raconter l’histoire que le résumé nous présentait. Pourtant, l’auteur n’avait pas besoin de plus de pages pour nous entraîner dans cet amour pur et exaltant. Cette inconnue nous dévoile tout son amour, pourtant non réciproque, et nous livre de belles leçons de vie. L’auteur dont l’inconnue s’est éprise ne s’aperçoit de l’importance de celle-ci uniquement après sa mort, lorsqu’il cesse de recevoir des fleurs le jour de son anniversaire. J’ai aimé cette histoire, qui était passionnante, et qui nous entrainait dans les tourbillons de la passion et de l’amour fou. Elle était aussi facile et rapide à lire. Je mettrais la note de 9.5/10.',
              offerId: 39033738,
              offerName: 'Je vais mieux',
              offerSubcategory: SubcategoryIdEnum.LIVRE_PAPIER,
              publicationDatetime: '2026-01-27T13:38:39.887195Z',
              offerThumbUrl:
                'https://storage.googleapis.com/passculture-metier-ehp-staging-assets-fine-grained/thumbs/62a52d64-c477-57d4-8914-9c7990b6e66a',
            },
            {
              author: 'Tom',
              content:
                'La vie heureuse de David Foenkinos raconte l’histoire de Éric et Amélie qui se retrouvent grâce au groupe Facebook des anciens du lycée de Châteaubriant pour travailler ensemble. Mais leur chemin se re sépare après une mission à Séoul qui boulversera la vie d’Éric, mais permettra à Amélie de le retrouver. Ce roman raconte le retour à la vie de personnages ayant perdu l’espoir. J’ai beaucoup aimé la plume de l’auteur et sa façon de raconter ses personnages. 9/10',
              offerId: 39033738,
              offerName: 'Je vais mieux',
              offerSubcategory: SubcategoryIdEnum.LIVRE_PAPIER,
              publicationDatetime: '2026-01-27T13:38:39.887195Z',
              offerThumbUrl:
                'https://storage.googleapis.com/passculture-metier-ehp-staging-assets-fine-grained/thumbs/62a52d64-c477-57d4-8914-9c7990b6e66a',
            },
            {
              author: 'Julie',
              content:
                'J’ai bien aimé La vie heureuse de David Foenkinos. C’est un roman surprenant, je ne m’attendais pas du tout à ça et si le début était un peu long à démarrer, une fois l’histoire pleinement lancée, j’ai dévoré le livre. J’ai vraiment trouvé le concept intéressant. Même si je ne me suis pas forcément identifiée au personnage principal, ça ne m’a pas du tout gênée pour lire et apprécier l’ouvrage\u00a0!',
              offerId: 39033738,
              offerName: 'Je vais mieux',
              offerSubcategory: SubcategoryIdEnum.LIVRE_PAPIER,
              publicationDatetime: '2026-01-27T13:38:39.887195Z',
            },
          ],
        }
      }
      return data
    },
  })
}
