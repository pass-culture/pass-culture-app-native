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

## Decision

_Explain the decision taken, specifying the choices made and why this solution was chosen._

Chosen option: "{title of option 1}", because {justification. e.g., only option, which meets k.o. criterion decision driver | which resolves force {force} | … | comes out best (see below)}.

## Context

Problème : On dépense 1200€ chaque mois juste pour vérifier que nos utilisateurs ne sont pas des robots

Objectif : Économiser plus de 1000€ par mois sans perdre en sécurité

## Alternatives considered

Listes provenant de :

- [AlternativeTo](https://alternativeto.net/software/recaptcha/)
- [European Alternative](https://european-alternatives.eu/category/captcha-services)

Options :

- Pas encore éliminés :
  - [CaptchaText](#captcha-text)
  - [EU Captcha](#eu-captcha)
  - [InputGuard](#inputguard)
  - [Private Captcha](#private-captcha)
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
- Autre raison :
  - [Captcheck](#captcheck)
  - [Sblam](#sblam)

## Justification

_List the reasons why this choice fits the context and stands out from the alternatives._

{Describe how the implementation of/compliance with the ADR can/will be confirmed. Are the design that was decided for and its implementation in line with the decision made? E.g., a design/code review or a test with a library such as ArchUnit can help validate this. Not that although we classify this element as optional, it is included in many ADRs.}

## Consequences

_Describe the impact of this decision, both positive and negative. Mention the short- and long-term implications.
_

- Good, because {positive consequence, e.g., improvement of one or more desired qualities, …}
- Bad, because {negative consequence, e.g., compromising one or more desired qualities, …}
- … <!-- numbers of consequences can vary -->

## Actions to be implemented

1.

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

- Coût : [$29 / an](https://www.captchatext.com/index.html#itsfree) ✅
- Sécurité : [SOC2 Compliant](https://www.captchatext.com/compliance.html)
- Volume : Unlimited Traffic Handling | Unlimited Evals/Assessments ✅
- Performance : Serveur notamment en Europe, et validation sans rechargement de la page
- Fiabilité :
- Accessibilité : WCAG 2.2 AAA | [VPAT Report](https://www.captchatext.com/VPAT.html) ✅
  - il y a un captcha audio
  - quand je tente de faire la démo au clavier, je n'arrive pas à cocher la checkbox ⚠️
- Protection des données : [GDPR Compliant](https://www.captchatext.com/compliance.html) ; [Privacy Policy](https://www.captchatext.com/privacy.html)
- Hébergement : monde
- Licence : Closed Source

#### EU Captcha

[Annonce](https://interoperable-europe.ec.europa.eu/collection/eupl/news/eu-captcha-under-eupl-12)

[Site](https://ec.europa.eu/isa2/actions/developing-open-source-captcha_en/)

[Repository](https://code.europa.eu/eu-captcha/EU-CAPTCHA)

- Coût : gratuit
- Sécurité :
- Volume :
- Performance :
- Fiabilité :
- Accessibilité : "accessible by users with disabilities" ✅
  - il y aurait un captcha audio
- Protection des données :
- Hébergement : self hosted
- Licence : [Open Source](https://code.europa.eu/eu-captcha/EU-CAPTCHA) : EUPL 1.2

App faite en java -> nécessite de savoir déployer une app en Java

#### InputGuard

[Site](https://zenofx.com/inputguard/)

- Coût : besoin de les contacter
- Sécurité :
- Volume :
- Performance :
- Fiabilité :
- Accessibilité : "User friendly, accessible interface"
- Protection des données :
- Hébergement : self hosted / monde
- Licence : Closed Source

#### Private Captcha

[Site](https://privatecaptcha.com/)

- Coût : €11988 / year ; [29€ / mois self hostable](https://privatecaptcha.com/self-hosting/#pricing) ✅
- Sécurité :
- Volume :
- Performance :
- Fiabilité :
- Accessibilité : [screen reader friendly, WCAG 2.2 compliant](https://privatecaptcha.com/use-case/accessibility/)
- Protection des données :
- Hébergement : self hosted / Europe
- Licence : [Open Source](https://github.com/PrivateCaptcha/PrivateCaptcha) : PolyForm Noncommercial License 1.0.0

#### Swetrix

[Site](https://captcha.swetrix.com/)

- Coût : [99€ / 2M requests / mois](https://swetrix.com/#pricing)
- Sécurité :
- Volume :
- Performance :
- Fiabilité :
- Accessibilité :
- Protection des données :
- Hébergement : self hosted / Europe
- Licence : [Open Source](https://github.com/Swetrix/swetrix) : AGPL 3.0

#### Altcha Sentinel

[Site](https://altcha.org/fr/)

- Coût : [Sentinel 74€ / mois](https://altcha.org/docs/v2/sentinel/pricing/#licensing-plans)
- Sécurité :
- Volume : Illimité
- Performance :
- Fiabilité :
- Accessibilité : [Conforme à WCAG/EAA](https://altcha.org/fr/docs/v2/compliance/#accessibility)
- Protection des données :
- Hébergement : self hosted / USA / Europe
- Licence : Closed Source ?

#### Altcha Open Source

[Site](https://altcha.org/fr/)

- Coût : Gratuit en self hosted
- Sécurité :
- Volume : Illimité
- Performance :
- Fiabilité :
- Accessibilité : [Conforme à WCAG/EAA](https://altcha.org/fr/docs/v2/compliance/#accessibility)
- Protection des données :
- Hébergement : self hosted
- Licence : [Open Source](https://github.com/altcha-org/altcha) : MIT

#### mCaptcha

[Site](https://mcaptcha.org/)

- Coût : gratuit
- Sécurité :
- Volume : illimité
- Performance :
- Fiabilité :
- Accessibilité :
- Protection des données :
- Hébergement : self hosted
- Licence : [Open Source](https://github.com/mCaptcha/mCaptcha) : AGPL 3.0

#### Cloudflare Turnstile

[Site](https://www.cloudflare.com/application-services/products/turnstile/)

- Coût : [Besoin de les contacter](https://www.cloudflare.com/application-services/products/turnstile/)
- Sécurité :
- Volume : Illimité
- Performance :
- Fiabilité :
- Accessibilité :
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

## Réferences

À lire

- https://www.w3.org/TR/turingtest/
- https://design.numerique.gouv.fr/articles/2024-11-28-captcha-et-accessibilite/
