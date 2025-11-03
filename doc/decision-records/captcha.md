# DR000 - Remplacer reCAPTCHA

> Status : Draft

## TODO

1. [x] Lister les alternatives
1. [x] Éliminer des alternatives critères basiques
1. [ ] Éliminer des alternatives critères plus avancés
1. Audit
   - [ ] Audit sécurité
   - [ ] Audit accessibilité
   - [ ] Audit protection des données personnelles
1. [ ] Éliminer des alternatives suites aux audits
1. [ ] Faire des PoC
1. [ ] Implémenter la solution retenue

<!--
## Décision

_Explain the decision taken, specifying the choices made and why this solution was chosen._

Chosen option: "{title of option 1}", because {justification. e.g., only option, which meets k.o. criterion decision driver | which resolves force {force} | … | comes out best (see below)}.
-->

## Contexte

Problème : On dépense 1200€ chaque mois juste pour vérifier que nos utilisateurs ne sont pas des robots

Objectif : Économiser plus de 1000€ par mois sans perdre en sécurité

## Alternatives considered

Listes provenant de :

- [AlternativeTo](https://alternativeto.net/software/recaptcha/)
- [European Alternative](https://european-alternatives.eu/category/captcha-services)

Options :

- Pas encore éliminés :
  - [CaptchaText](#captcha-text)
  - [InputGuard](#inputguard)
  - [Private Captcha Self Hosted](#private-captcha-self-hosted)
  - [Swetrix](#swetrix)
  - [Altcha Sentinel](#altcha-sentinel)
  - [Altcha Open Source](#altcha-open-source)
  - [mCaptcha](#mcaptcha)
  - [Cloudflare Turnstile](#cloudflare-turnstile)
- Trop cher :
  - [Captcha](#captcha)
  - [hCaptcha](#hcaptcha)
  - [CaptchaFox](#captchafox)
  - [MTCaptcha](#mtcaptcha)
  - [TrustCaptcha](#trustcaptcha)
  - [Friendly Captcha](#friendly-captcha)
  - [Private Captcha SaaS](#private-captcha-saas)
- Autre raison :
  - [Captcheck](#captcheck)
  - [Sblam](#sblam)
  - [EU Captcha](#eu-captcha)

<!--
## Justification

_List the reasons why this choice fits the context and stands out from the alternatives._

{Describe how the implementation of/compliance with the ADR can/will be confirmed. Are the design that was decided for and its implementation in line with the decision made? E.g., a design/code review or a test with a library such as ArchUnit can help validate this. Not that although we classify this element as optional, it is included in many ADRs.}

## Consequences

_Describe the impact of this decision, both positive and negative. Mention the short- and long-term implications.
_

- Good, because {positive consequence, e.g., improvement of one or more desired qualities, …}
- Bad, because {negative consequence, e.g., compromising one or more desired qualities, …}

## Actions to be implemented

1.
-->

## Decision Drivers

- Coût : Facture de moins de 150€ / mois
- Sécurité : Taux de détection de bots identique ou meilleur
- Volume : 1.3 million vérifications / mois
- Performance : Temps de réponse équivalent ou plus rapide
- Fiabilité : Pas de panne ou bug pendant 1 mois après migration
- Accessibilité : 🤷
- Protection des données :
- Hébergement : self hosted / monde / europe / france
- Licence : Open Source / Closed Source

## Pros and Cons of the Options

### Pas encore éliminés

#### Captcha Text

[Site](https://www.captchatext.com/)

[Démo](https://www.captchatext.com/examples.html)

- Coût : [$29 / an](https://www.captchatext.com/index.html#itsfree) ✅
  - No Branding and No Backlinks : $299 / an
- Sécurité : [SOC2 Compliant](https://www.captchatext.com/compliance.html)
- Volume : Unlimited Traffic Handling | Unlimited Evals/Assessments ✅
- Performance : Serveur notamment en Europe, et validation sans rechargement de la page
- Fiabilité :
- Accessibilité : WCAG 2.2 AAA | [VPAT Report](https://www.captchatext.com/VPAT.html) ✅
  - il y a un captcha audio
  - quand je tente de faire la démo au clavier, je n'arrive pas à cocher la checkbox ⚠️
  - parfois ça demande un mot qui commence par une majuscule, à l'audio, ça ne s'entend pas ⚠️
- Protection des données : [GDPR Compliant](https://www.captchatext.com/compliance.html) ; [Privacy Policy](https://www.captchatext.com/privacy.html)
- Hébergement : monde
- Licence : Closed Source

#### InputGuard

[Site](https://zenofx.com/inputguard/)

[Démo](https://zenofx.com/contact.html)

- Coût : [59.88€ / Fair use (not suitable for high volume sites) / site / an](https://zenofx.com/inputguard/order.html) ; [besoin de les contacter](https://zenofx.com/inputguard/)
- Sécurité :
- Volume :
- Performance :
- Fiabilité :
- Accessibilité : ["User friendly, accessible interface"](https://zenofx.com/inputguard/)
- Protection des données : ["No user data is ever collected or submitted to 3rd parties" ; GDPR (DSGVO) compliant](https://zenofx.com/inputguard/)
- Hébergement : self hosted / monde
- Licence : Closed Source

#### Private Captcha Self Hosted

Exclusivement la partie self hosted ;
[voir ici pour la partie SaaS](#private-captcha-saas)

[Site](https://privatecaptcha.com/)

[Démo](https://privatecaptcha.com/)

- Coût : [29€ / mois self hostable](https://privatecaptcha.com/self-hosting/#pricing) ✅
- Sécurité :
- Volume :
- Performance : [script is 7% of the size of Google reCAPTCHA script](https://privatecaptcha.com/)
- Fiabilité :
- Accessibilité : [screen reader friendly, WCAG 2.2 compliant](https://privatecaptcha.com/use-case/accessibility/)
  - [la vérification résout un problème cryptographique en arrière plan](https://privatecaptcha.com/faq/) ([Proof of Work])
  - la vérification ne demande rien d'autre que de cocher une case
- Protection des données : [GDPR/CCPA ready : No personal data processing](https://privatecaptcha.com/) ; [Data Processing Agreement](https://privatecaptcha.com/legal/dpa/)
- Hébergement : self hosted
- Licence : [Open Source](https://github.com/PrivateCaptcha/PrivateCaptcha) : PolyForm Noncommercial License 1.0.0

#### Swetrix

[Site](https://captcha.swetrix.com/)

[Demo](https://captcha.swetrix.com/demo)

- Coût : [99€ / 2M requests / mois](https://swetrix.com/#pricing)
- Sécurité :
- Volume :
- Performance :
- Fiabilité :
- Accessibilité :
  - je n'arrive pas à accéder au bouton "submit" au clavier ⚠️
- Protection des données : [GDPR Compliant](https://swetrix.com/data-policy#gdpr-compliance)
- Hébergement : self hosted / Europe (Allemagne)
- Licence : [Open Source](https://github.com/Swetrix/swetrix) : AGPL 3.0

De ce que j'en comprends, Swetrix est un outil de tracking / analytics ; les Captcha ne sont pas leur coeur de métier

#### Altcha Sentinel

Exclusivement la partie Sentinel ;
[voir ici pour la partie Open Source](#altcha-open-source)

[Site](https://altcha.org/fr/)

[Demo](https://altcha.org/fr/docs/v2/sentinel/features/adaptive-captcha/)

- Coût : [Sentinel 74€ / mois](https://altcha.org/docs/v2/sentinel/pricing/#licensing-plans)
- Sécurité : [SOC 2, ISO 27001](https://altcha.org/docs/v2/compliance/security/)
- Volume : Illimité
- Performance :
- Fiabilité :
- Accessibilité : Conforme à [WCAG 2.2 AA](https://altcha.org/docs/v2/compliance/wcag/)/[EAA](https://altcha.org/docs/v2/compliance/european-accessibility-act-2025/)
- Protection des données : [GDPR Compliant](https://altcha.org/docs/v2/compliance/gdpr/)
- Hébergement : self hosted / USA / Europe
- Licence : Closed Source ?

#### Altcha Open Source

Exclusivement la partie Open Source ;
[voir ici pour la partie Sentinel](#altcha-sentinel)

[Site](https://altcha.org/fr/open-source-captcha/)

[Demo](https://altcha.org/fr/open-source-captcha/#demo)

- Coût : Gratuit en self hosted
- Sécurité : [SOC 2, ISO 27001](https://altcha.org/docs/v2/compliance/security/)
- Volume : Illimité
- Performance :
- Fiabilité :
- Accessibilité : Conforme à [WCAG 2.2 AA](https://altcha.org/docs/v2/compliance/wcag/)/[EAA](https://altcha.org/docs/v2/compliance/european-accessibility-act-2025/)
  - en dark mode, je n'ai pas d'indication visuel que mon focus est sur la checkbox ⚠️
- Protection des données : [GDPR Compliant](https://altcha.org/docs/v2/compliance/gdpr/)
- Hébergement : self hosted
- Licence : [Open Source](https://github.com/altcha-org/altcha) : MIT

#### mCaptcha

[Site](https://mcaptcha.org/)

[Demo](https://showcase.mcaptcha.org/) ([le backend de démo est down](https://github.com/mCaptcha/showcase/issues/8))

- Coût : gratuit
- Sécurité : [Security](https://mcaptcha.org/security)
- Volume : illimité
- Performance :
- Fiabilité :
- Accessibilité :
  - pas directement mentionnée mais ça fonctionne sur du [Proof of Work]
    d'après [la page d'accueil](https://mcaptcha.org/) donc l'user ne devrait pas à avoir à résoudre des puzzles
- Protection des données : [Privacy Policy](https://mcaptcha.org/privacy-policy)
- Hébergement : self hosted
- Licence : [Open Source](https://github.com/mCaptcha/mCaptcha) : AGPL 3.0

#### Cloudflare Turnstile

[Site](https://www.cloudflare.com/application-services/products/turnstile/)

[Démo](https://dash.cloudflare.com/sign-up?to=/:account/turnstile)

- Coût : [Besoin de les contacter](https://www.cloudflare.com/application-services/products/turnstile/)
- Sécurité :
- Volume : Illimité
- Performance :
- Fiabilité :
- Accessibilité :
  - ça n'en parle pas directement, [ça semble décrire](https://www.cloudflare.com/application-services/products/turnstile/#how-it-works) un mécanisme de [Proof of Work]
- Protection des données :
- Hébergement : monde
- Licence : Closed Source

### Trop cher

Certaines options, il faut les contacter pour avoir une offre custom

Les offres où le prix / volume sont proches où au dessus de notre limite ont été écartées

#### Captcha

[Forfait avancé](https://www.captcha.eu/fr/)

- Coût / Volume : [179,90€ / 100K requests / mois](https://www.captcha.eu/fr/#pricing) ; Possibilité de les contacter

#### hCaptcha

[Site](https://www.hcaptcha.com/) (site (mal-)traduit automatiquement)

- Coût / Volume : [$99 / 100K requests / month](https://www.hcaptcha.com/pricing) ; besoin de les contacter ❌
- Accessibilité : WCAG 2.1
- Hébergement : monde
- Licence : Closed Source

#### CaptchaFox

[Site](https://captchafox.com/)

- Coût / Volume : [85 € / 100K requests / mois ; Besoin de les contacter](https://captchafox.com/pricing) ❌
- Hébergement : Europe
- Licence : Closed Source

#### MTCaptcha

[Site](https://www.mtcaptcha.com/)

- Coût : [$969 / an ou $1734 / an](https://www.mtcaptcha.com/pricing) ❌
- Volume : 1M ou 2M
- Accessibilité : VPAT and WCAG 2.1 AAA Compliant
- Hébergement : monde
- Licence : Closed Source

#### TrustCaptcha

[Site](https://www.trustcomponent.com/en/products/captcha)

- Coût / Volume : [290€ / 150K requests / mois](https://www.trustcomponent.com/en/products/captcha/pricing) ; Besoin de les contacter ❌
- Hébergement : Europe
- Licence : Closed Source

Possibilité de les contacter pour dépasser les plans prévus

#### Friendly Captcha

[Site](https://friendlycaptcha.com/fr/)

- Coût / Volume : [200€ / 50K requests / mois pour ; Besoin de les contacter](https://friendlycaptcha.com/#pricing) ❌
- Accessibilité : [Compliant with WCAG, EAA, ADA, and more](https://friendlycaptcha.com/accessibility/)
- Hébergement : monde
- Licence : Closed Source

#### Private Captcha SaaS

Exclusivement la partie SaaS ;
[voir ici pour la partie self hosted](#private-captcha-self-hosted)

[Site](https://privatecaptcha.com/)

- Coût : [€999 / 1M requests / month](https://privatecaptcha.com/#pricing) ❌
- Accessibilité : [screen reader friendly, WCAG 2.2 compliant](https://privatecaptcha.com/use-case/accessibility/)
- Hébergement : Europe
- Licence : [Open Source](https://github.com/PrivateCaptcha/PrivateCaptcha) : PolyForm Noncommercial License 1.0.0

### Autre raison

#### Captcheck

[Site](https://captcheck.netsyms.com/)

- Coût : gratuit ✅
- Hébergement : self hosted / monde
- Licence : Open Source

En anglais uniquement ❌

#### Sblam

[Site](https://sblam.com/en.html)

Solution faite uniquement pour s'intégrer dans du [PHP](https://sblam.com/install.html) ❌

#### EU Captcha

[Annonce](https://interoperable-europe.ec.europa.eu/collection/eupl/news/eu-captcha-under-eupl-12)

[Site](https://ec.europa.eu/isa2/actions/developing-open-source-captcha_en/)

[Repository](https://code.europa.eu/eu-captcha/EU-CAPTCHA)

- Coût : gratuit
- Accessibilité : "accessible by users with disabilities" ✅
  - il y aurait un captcha audio
- Hébergement : self hosted
- Licence : [Open Source](https://code.europa.eu/eu-captcha/EU-CAPTCHA) : EUPL 1.2

App faite en java -> nécessite de savoir déployer une app en Java

Le repo a été archivé ❌

## Réferences

À lire

- https://www.w3.org/TR/turingtest/
- https://design.numerique.gouv.fr/articles/2024-11-28-captcha-et-accessibilite/

[Proof of Work]: https://en.wikipedia.org/wiki/Proof_of_work
