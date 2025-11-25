import type { ReadonlyDeep } from 'type-fest'

import { api } from 'api/api'
import { AllNavParamList, ScreenNames } from 'features/navigation/navigators/RootNavigator/types'

const screensUsedByMarketing = [
  'Offer',
  'Venue',
  'VenueMap',
  'Home',
  'SearchResults',
  'SearchLanding',
  'Profile',
  'SignupForm',
  'ThematicHome',
  'Stepper',
  'ThematicSearch',
  'Bookings',
  'SearchStackNavigator',
  'Favorites',
] as const satisfies ReadonlyDeep<ScreenNames[]>

export type ScreensUsedByMarketing = (typeof screensUsedByMarketing)[number]

type ScreensUsedByMarketingParamsList = Pick<AllNavParamList, ScreensUsedByMarketing>

export type ParamConfig = {
  type:
    | 'string'
    | 'stringArray'
    | 'priceRange'
    | 'boolean'
    | 'offerCategories'
    | 'offerNativeCategories'
    | 'date'
    | 'locationFilter'
    | 'thematicSearchCategories'
  required?: boolean
  description: string
  serverValidator?: (value: unknown) => Promise<unknown>
}

type ScreenConfig<Screen extends ScreensUsedByMarketing> = {
  [Param in keyof ScreensUsedByMarketingParamsList[Screen]]: ParamConfig
}

export const SCREENS_CONFIG: {
  [Screen in ScreensUsedByMarketing]: ScreenConfig<Screen>
} = {
  Offer: {
    id: {
      type: 'string',
      required: true,
      description: 'Identifiant unique de l’offre.',
      serverValidator: (value: unknown) => api.getNativeV2OfferofferId(Number(value)),
    },
  },
  VenueMap: {},
  Venue: {
    id: {
      type: 'string',
      required: true,
      description: 'Identifiant unique de lieu.',
      serverValidator: (value: unknown) => api.getNativeV2VenuevenueId(Number(value)),
    },
  },
  Home: {
    videoModuleId: {
      type: 'string',
      required: false,
      description:
        'L’identifiant du module vidéo dont la modale sera affichée à l’ouverture du lien',
    },
  },
  ThematicHome: {
    homeId: {
      type: 'string',
      required: false,
      description: 'Le module d’accueil thématique à afficher',
    },
    videoModuleId: {
      type: 'string',
      required: false,
      description:
        'L’identifiant du module vidéo dont la modale sera affichée à l’ouverture du lien',
    },
  },
  SearchResults: {
    URL: {
      type: 'string',
      required: false,
      description: 'Une URL de recherche a convertir',
    },
    query: {
      type: 'string',
      required: false,
      description: 'Mot clé',
    },
    offerCategories: {
      type: 'offerCategories',
      required: false,
      description: 'Categories',
    },
    offerNativeCategories: {
      type: 'offerNativeCategories',
      required: false,
      description: 'Sous-catégories',
    },
    tags: {
      type: 'stringArray',
      required: false,
      description: 'Tags',
    },
    priceRange: {
      type: 'priceRange',
      required: false,
      description: 'Prix',
    },
    offerIsFree: {
      type: 'boolean',
      required: false,
      description: 'Uniquement les offres gratuites',
    },
    offerIsDuo: {
      type: 'boolean',
      required: false,
      description: 'Offre DUO',
    },
    beginningDatetime: {
      type: 'date',
      required: false,
      description: 'Date de début',
    },
    endingDatetime: {
      type: 'date',
      required: false,
      description: 'Date de fin',
    },
  },
  ThematicSearch: {
    offerCategories: {
      type: 'thematicSearchCategories',
      required: true,
      description: 'Categories',
    },
  },
  Profile: {},
  SignupForm: {},
  Stepper: {},
  Bookings: {},
  SearchStackNavigator: {},
  Favorites: {},
  SearchLanding: {},
}

type MarketingParams = 'utm_campaign' | 'utm_source' | 'utm_medium' | 'utm_content' | 'utm_gen'

type MarketingConfig = {
  [Param in MarketingParams]: ParamConfig
}

export const MARKETING_CONFIG: MarketingConfig = {
  utm_campaign: {
    type: 'string',
    description:
      'Nom de la campagne. Exemple\u00a0: “festivals22”, “tempsfortJapon”, “LouisSan”... une campagne peut être menée sur différents canaux.',
  },
  utm_source: {
    type: 'string',
    description:
      'Source de la campagne\u00a0: transac, newsletter (pour les emails), batch, insta, facebook, tiktok.',
  },
  utm_medium: {
    type: 'string',
    description:
      'Canal de la campagne\u00a0: email, push, smo (social media organic), smp (social media paid), sea (pour les campagnes d’adword...), press, partner (partenaires, influenceurs...).',
  },
  utm_content: {
    type: 'string',
    description: 'Visuel de la campagne si elle en compte plusieurs (1, 2, 3, a , b, c...).',
  },
  utm_gen: {
    type: 'string',
    description: 'Type de campagne\u00a0: marketing ou product.',
    required: true,
  },
}
