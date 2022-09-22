import { api } from 'api/api'
import { AllNavParamList, ScreenNames } from 'features/navigation/RootNavigator'

import { build } from '../../../../package.json'

export type ScreensUsedByMarketing = Extract<
  ScreenNames,
  'Offer' | 'Venue' | 'Home' | 'Search' | 'Profile' | 'SignupForm'
>

type ScreensUsedByMarketingParamsList = Pick<AllNavParamList, ScreensUsedByMarketing>

export type ParamConfig = {
  type:
    | 'string'
    | 'stringArray'
    | 'priceRange'
    | 'boolean'
    | 'offerCategories'
    | 'offerTypes'
    | 'date'
    | 'locationFilter'
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
      description: 'Identifiant unique de l‘offre.',
      serverValidator: (value: unknown) => api.getnativev1offerofferId(Number(value)),
    },
  },
  Venue: {
    id: {
      type: 'string',
      required: true,
      description: 'Identifiant unique de lieu.',
      serverValidator: (value: unknown) => api.getnativev1venuevenueId(Number(value)),
    },
  },
  Home: {
    entryId: {
      type: 'string',
      required: false,
      description: 'Le module d‘accueil à afficher',
    },
  },
  Search: {
    URL: {
      type: 'string',
      required: false,
      description: 'Une URL de recherche a convertir',
    },
    locationFilter: {
      type: 'locationFilter',
      required: false,
      description: 'Lieu',
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
    offerTypes: {
      type: 'offerTypes',
      required: false,
      description: 'Type d‘offre',
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
    offerIsNew: {
      type: 'boolean',
      required: false,
      description: 'Uniquement les nouveautés',
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
  Profile: {},
  SignupForm: {},
}

type MarketingParams = 'utm_campaign' | 'utm_source' | 'utm_medium' | 'utm_content'

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
}

type FirebaseDynamicLinkParams = 'amv'

type FirebaseDynamicLinkConfig = {
  [Param in FirebaseDynamicLinkParams]: ParamConfig
}

export const FDL_CONFIG: FirebaseDynamicLinkConfig = {
  amv: {
    type: 'string',
    description: `Version minimale de l‘application Android qui peut ouvrir le lien (ex\u00a0: ${build}). Si l‘application installée est une version plus ancienne, l‘utilisateur est redirigé vers le Play Store pour mettre à niveau l‘application.`,
  },
}
