import { api } from 'api/api'
import {
  paramConfig,
  ScreenConfig,
} from 'features/_marketingAndCommunication/components/DeeplinksGeneratorForm'
import { ScreenNames } from 'features/navigation/RootNavigator'

export const SCREENS_CONFIG: Partial<Record<ScreenNames, ScreenConfig>> = {
  Offer: {
    _utms: true,
    id: {
      type: 'string',
      required: true,
      description: `Identifiant unique de l'offre.`,
      serverValidator: (value: string) => api.getnativev1offerofferId(Number(value)),
    },
  },
  Venue: {
    _utms: true,
    id: {
      type: 'string',
      required: true,
      description: `Identifiant unique de lieu.`,
      serverValidator: (value: string) => api.getnativev1venuevenueId(Number(value)),
    },
  },
  Home: {
    _tabNav: true,
    _utms: true,
    entryId: {
      type: 'string',
      required: false,
      description: `Le module d'accueil à afficher`,
    },
  },
  Search: {
    _tabNav: true,
    _utms: true,
  },
  Profile: {
    _tabNav: true,
    _utms: true,
  },
  SetEmail: {
    _utms: true,
  },
}

export const MARKETING_CONFIG: Record<string, paramConfig> = {
  utm_campaign: {
    type: 'string',
    description: `Permet d'identifier le nom de la campagne relative au produit, son slogan ou encore son code promotionnel.`,
  },
  utm_source: {
    type: 'string',
    description: `Permet d'identifier, entre autres, l'annonceur, le site et la publication générant du trafic`,
  },
  utm_medium: {
    type: 'string',
    description: `Permet d'identifier le support publicitaire ou marketing (par exemple : cpc, bannière, newsletter envoyée par e-mail).`,
  },
}

export const FDL_CONFIG: Record<string, paramConfig> = {
  amv: {
    type: 'string',
    description: `La versionCode de la version minimale de l'application Android qui peut ouvrir le lien (ex: 1016103). Si l'application installée est une version plus ancienne, l'utilisateur est redirigé vers le Play Store pour mettre à niveau l'application.`,
  },
}
