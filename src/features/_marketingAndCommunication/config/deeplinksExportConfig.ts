import { api } from 'api/api'
import { AllNavParamList, ScreenNames } from 'features/navigation/RootNavigator'

import { build } from '../../../../package.json'

export type ScreensUsedByMarketing = Extract<
  ScreenNames,
  'Offer' | 'Venue' | 'Home' | 'Search' | 'Profile' | 'SignupForm'
>

type ScreensUsedByMarketingParamsList = Pick<AllNavParamList, ScreensUsedByMarketing>

export type ParamConfig = {
  type: 'string'
  required?: boolean
  description?: string
  serverValidator?: (value: string) => Promise<unknown>
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
      description: `Identifiant unique de l'offre.`,
      serverValidator: (value: string) => api.getnativev1offerofferId(Number(value)),
    },
  },
  Venue: {
    id: {
      type: 'string',
      required: true,
      description: `Identifiant unique de lieu.`,
      serverValidator: (value: string) => api.getnativev1venuevenueId(Number(value)),
    },
  },
  Home: {
    entryId: {
      type: 'string',
      required: false,
      description: `Le module d'accueil à afficher`,
    },
  },
  Search: {},
  Profile: {},
  SignupForm: {},
}

type MarketingParams = 'utm_campaign' | 'utm_source' | 'utm_medium'

type MarketingConfig = {
  [Param in MarketingParams]: ParamConfig
}

export const MARKETING_CONFIG: MarketingConfig = {
  utm_campaign: {
    type: 'string',
    description: `Nom de la campagne relative au produit, son slogan ou encore son code promotionnel.`,
  },
  utm_source: {
    type: 'string',
    description: `Annonceur, site ou publication générant du trafic`,
  },
  utm_medium: {
    type: 'string',
    description: `Support publicitaire ou marketing (ex : cpc, bannière, newsletter envoyée par e-mail).`,
  },
}

type FirebaseDynamicLinkParams = 'amv'

type FirebaseDynamicLinkConfig = {
  [Param in FirebaseDynamicLinkParams]: ParamConfig
}

export const FDL_CONFIG: FirebaseDynamicLinkConfig = {
  amv: {
    type: 'string',
    description: `Version minimale de l'application Android qui peut ouvrir le lien (ex: ${build}). Si l'application installée est une version plus ancienne, l'utilisateur est redirigé vers le Play Store pour mettre à niveau l'application.`,
  },
}
