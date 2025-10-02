import React from 'react'

import { AccessibilityDeclarationMobileBase } from 'features/profile/pages/Accessibility/AccessibilityDeclarationMobileBase'
import { env } from 'libs/environment/env'

export function AccessibilityDeclarationMobileIOS() {
  return (
    <AccessibilityDeclarationMobileBase
      platformName="iOS"
      osVersion="18.5"
      storeLink={{ url: `https://apps.apple.com/fr/app/pass-culture/id${env.IOS_APP_STORE_ID}` }}
      conformityEN="25.00%"
      conformityRAAM="41.86%"
      nonAccessibleContent={[
        'Des images porteuses d’information ne disposent pas d’alternative pertinente accessible aux technologies d’assistance.',
        'Des images légendées ne sont pas correctement restituées par les lecteurs d’écran.',
        'Des éléments graphiques ou composants d’interface présentent des contrastes insuffisants.',
        'Certains contenus audio/vidéo pré-enregistrés ne disposent pas d’alternative textuelle.',
        'Certains contenus audio/vidéo ne sont pas sous-titrés ou leurs sous-titres ne sont pas pertinents.',
        'Certains médias ne sont pas clairement identifiés par un texte adjacent.',
        'Certains composants d’interface ne sont pas accessibles aux technologies d’assistance (nom, rôle, état non restitués).',
        'Certains intitulés visibles ne sont pas cohérents ou présents dans l’alternative accessible.',
        'Certains champs de formulaire ne sont pas correctement étiquetés ou leur étiquette n’est pas accessible.',
        'Certains champs de formulaire ne sont pas groupés ou ne sont pas reliés à leurs légendes.',
        'Les messages d’erreur ne sont pas toujours annoncés aux technologies d’assistance.',
        'Certains messages de statut (comme les retours de validation) ne sont pas restitués aux lecteurs d’écran.',
        'Certains éléments ne sont pas accessibles au clavier ou au pointage.',
        'Certains contenus ne sont pas lus dans la bonne langue par les technologies d’assistance.',
        'L’information n’est pas toujours structurée par des titres hiérarchisés.',
        'Certaines listes ne sont pas reconnues comme telles par les lecteurs d’écran.',
        'Certains écrans ne sont pas du tout accessibles avec les technologies d’assistance.',
        'L’agrandissement du texte jusqu’à 200 % entraîne parfois des pertes de contenu ou de fonctionnalités.',
        'Certains contenus nécessitent des gestes complexes (comme le balayage) sans méthode alternative simple proposée.',
        'L’affichage en mode paysage n’est pas toujours correctement géré.',
      ]}
      toolsUsed={[
        'VoiceOver (lecteur d’écran)',
        'Clavier externe',
        'VoiceControl (contrôle vocal)',
        'Paramètres de présentation utilisateurs (taille de police, contrastes renforcés etc.)',
      ]}
    />
  )
}
