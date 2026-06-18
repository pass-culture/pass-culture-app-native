import React from 'react'

import { AccessibilityDeclarationMobileBase } from 'features/profile/pages/Accessibility/AccessibilityDeclarationMobileBase'
import { env } from 'libs/environment/env'

export function AccessibilityDeclarationMobileIOS() {
  return (
    <AccessibilityDeclarationMobileBase
      appVersion="1.395.0"
      platformName="iOS"
      osVersion="18.5"
      storeLink={{ url: `https://apps.apple.com/fr/app/pass-culture/id${env.IOS_APP_STORE_ID}` }}
      auditDate="16/06/2026"
      conformityEN="81,63%"
      conformityRAAM="90,91%"
      averageConformityRAAM="97,88%"
      nonAccessibleContent={[
        'Critère 5.1.c - Chaque composant d’interface est-il, si nécessaire, compatible avec les technologies d’assistance\u00a0?',
        'Critère 5.4 - Dans chaque écran, les messages de statut sont-ils correctement restitués par les technologies d’assistance\u00a0?',
        'Critère 8.2 - Dans chaque écran, l’utilisateur peut-il augmenter la taille des caractères de 200% au moins\u00a0?',
        'Critère 11.10 - Dans chaque écran, les fonctionnalités activables au moyen d’un geste complexe sont-elles activables au moyen d’un geste simple\u00a0?',
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
