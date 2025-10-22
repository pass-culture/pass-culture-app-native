---
status: draft
# date: {YYYY-MM-DD when the decision was last updated}
decision-makers: { list everyone involved in the decision }
# consulted: {list everyone whose opinions are sought (typically subject-matter experts); and with whom there is a two-way communication}
# informed: {list everyone who is kept up-to-date on progress; and with whom there is a one-way communication}
---

# Remplacer reCAPTCHA

## Context and Problem Statement

Problème : On dépense 1200€ chaque mois juste pour vérifier que nos utilisateurs ne sont pas des robots

Objectif : Économiser plus de 1000€ par mois sans perdre en sécurité

## Decision Drivers

- Coût : Facture de moins de 150€ / mois
- Sécurité : Taux de détection de bots identique ou meilleur
- Volume : 1.3 million vérifications / mois
- Performance : Temps de réponse équivalent ou plus rapide
- Fiabilité : Pas de panne ou bug pendant 1 mois après migration
- Accessibilité : 🤷
- Hébergement : self hosted / monde / europe / france
- Licence : Open Source / Closed Source

## Considered Options

Listes provenant de :

- [AlternativeTo](https://alternativeto.net/software/recaptcha/)
- [European Alternative](https://european-alternatives.eu/category/captcha-services)

Options :

- [Captcha](#captcha)
- [CaptchaText](#captcha-text)
- [Captcheck](#captcheck)
- [Sblam](#sblam)
- [EU Captcha](#eu-captcha)
- [InputGuard](#inputguard)
- [TrustCaptcha](#trustcaptcha)

## Decision Outcome

Chosen option: "{title of option 1}", because {justification. e.g., only option, which meets k.o. criterion decision driver | which resolves force {force} | … | comes out best (see below)}.

<!-- This is an optional element. Feel free to remove. -->

### Consequences

- Good, because {positive consequence, e.g., improvement of one or more desired qualities, …}
- Bad, because {negative consequence, e.g., compromising one or more desired qualities, …}
- … <!-- numbers of consequences can vary -->

<!-- This is an optional element. Feel free to remove. -->

### Confirmation

{Describe how the implementation of/compliance with the ADR can/will be confirmed. Are the design that was decided for and its implementation in line with the decision made? E.g., a design/code review or a test with a library such as ArchUnit can help validate this. Not that although we classify this element as optional, it is included in many ADRs.}

<!-- This is an optional element. Feel free to remove. -->

## Pros and Cons of the Options

### Captcha

[Forfait avancé](https://www.captcha.eu/fr/#pricing)

- Coût : 179,90€ / mois
- Volume : Jusqu'à 100 000 demandes/mois ❌

### Captcha Text

[Site](https://www.captchatext.com/)

- Coût : $300 / an ✅
- Sécurité :
- Volume : Unlimited Traffic Handling | Unlimited Evals/Assessments ✅
- Performance :
- Fiabilité :
- Accessibilité : WCAG 2.2 AAA | [VPAT Report](https://www.captchatext.com/VPAT.html) ✅

### Captcheck

[Site](https://captcheck.netsyms.com/)

- Coût : gratuit ✅
- Hébergement : self hosted / monde
- Licence : Open Source

En anglais uniquement ❌

### Sblam

[Site](https://sblam.com/en.html)

Solution uniquement pour du [PHP](https://sblam.com/install.html) ❌

### EU Captcha

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
- Hébergement : self hosted
- Licence : Open Source : EUPL 1.2

App faite en java -> nécessite de savoir déployer une app en Java

### InputGuard

[Site](https://zenofx.com/inputguard/)

- Coût : besoin de les contacter
- Sécurité :
- Volume :
- Performance :
- Fiabilité :
- Accessibilité : "User friendly, accessible interface"
- Hébergement : self hosted / monde
- Licence : Closed Source

### TrustCaptcha

[Site](https://www.trustcomponent.com/en/products/captcha)

- Coût : [290€ / mois](https://www.trustcomponent.com/en/products/captcha/pricing)
- Sécurité :
- Volume : 150K / mois
- Performance :
- Fiabilité :
- Accessibilité :
- Hébergement : self hosted / monde / europe / france
- Licence : Open Source / Closed Source

Possibilité de les contacter pour dépasser les plans prévus

###

- Coût :
- Sécurité :
- Volume :
- Performance :
- Fiabilité :
- Accessibilité :
- Hébergement : self hosted / monde / europe / france
- Licence : Open Source / Closed Source

## More Information

À lire

- https://www.w3.org/TR/turingtest/
- https://design.numerique.gouv.fr/articles/2024-11-28-captcha-et-accessibilite/
