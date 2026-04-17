import React from 'react'

import { AccessibilityDeclarationMobileBase } from 'features/profile/pages/Accessibility/AccessibilityDeclarationMobileBase'
import { env } from 'libs/environment/env'

export function AccessibilityDeclarationMobileAndroid() {
  return (
    <AccessibilityDeclarationMobileBase
      appVersion="1.386.1"
      platformName="Android"
      osVersion="15"
      storeLink={{ url: `https://play.google.com/store/apps/details?id=${env.ANDROID_APP_ID}` }}
      auditDate="16/04/2026"
      conformityEN="75,00%"
      conformityRAAM="86,05%"
      averageConformityRAAM="96,68%"
      nonAccessibleContent={[
        'Critère 3.5 - Chaque média temporel synchronisé pré-enregistré a-t-il, si nécessaire, une alternative\u00a0?',
        'Critère 5.4 - Dans chaque écran, les messages de statut sont-ils correctement restitués par les technologies d’assistance\u00a0?',
        'Critère 9.11 - Pour chaque formulaire qui modifie ou supprime des données, ou qui transmet des réponses à un test ou à un examen, ou dont la validation a des conséquences financières ou juridiques, les données saisies peuvent-elles être modifiées, mises à jour ou récupérées par l’utilisateur\u00a0?',
        'Critère 10.2 - Dans chaque écran, l’ordre de restitution par les technologies d’assistance est-il cohérent\u00a0?',
        'Critère 11.10 - Dans chaque écran, les fonctionnalités activables au moyen d’un geste complexe sont-elles activables au moyen d’un geste simple\u00a0?',
      ]}
      toolsUsed={[
        'TalkBack (lecteur d’écran)',
        'Switch Access (accès avec un périphérique externe)',
        'Paramètres de présentation utilisateurs (taille de police etc.)',
      ]}
    />
  )
}
