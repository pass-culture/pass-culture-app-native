import { CookieCategoriesEnum } from 'features/cookies/enums'

export const cookiesInfo: {
  [key in CookieCategoriesEnum]: {
    title: string
    description: string
    caption?: string
    permanentCaption?: string
  }
} = {
  [CookieCategoriesEnum.customization]: {
    title: 'Personnaliser ta navigation',
    description:
      'Ces cookies nous permettent, en fonction de ta navigation, de te proposer des contenus supposés pertinents et susceptibles de t’intéresser.',
    caption: 'Sans ces cookies, nous ne pourrons pas te proposer des recommandations adaptées.',
  },
  [CookieCategoriesEnum.performance]: {
    title: 'Enregistrer des statistiques de navigation',
    description:
      'Ces cookies sont là pour nous aider à améliorer notre service grâce à des statistiques anonymes sur l’usage du pass Culture. Nous regardons par exemple les mots que tu tapes dans la barre de recherche pour définir des tendances et ainsi améliorer les résultats qui te sont proposés.',
    caption:
      'Si tu désactives ces cookies, nous ne pourrons pas prendre en compte ton usage de l’application pour continuer à la créer au plus près de nos utilisateurs.',
  },
  [CookieCategoriesEnum.marketing]: {
    title: 'Mesurer l’efficacité de nos publicités',
    description: 'Tu ne verras pas de publicité de tiers sur notre site ou sur notre application.',
    caption:
      'En revanche, nous faisons de la publicité sur les réseaux sociaux pour faire connaître le pass Culture auprès du plus grand nombre. Grâce à ces cookies, nous pourrons en estimer l’efficacité.',
  },
  [CookieCategoriesEnum.essential]: {
    title: 'Assurer la sécurité, prévenir la fraude et corriger les bugs',
    description:
      'Nous enregistrons par exemple ton consentement ou non aux autres cookies pour ne pas te le redemander. Ils te permettent aussi de rester connecté et d’assurer la sécurité de l’application.',
    permanentCaption:
      'Nous ne demandons pas ton consentement pour ces cookies car ils sont obligatoires pour le bon fonctionnement du pass Culture.',
  },
}
