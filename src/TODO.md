# TODO

## Links

- [PC-TicketNumber](https://passculture.atlassian.net/browse/PC-TicketNumber)
- [MobTime](https://mobtime.hadrienmp.fr/mob/pass-culture)

---

## Tasks

- [ ] CAS 0 : Utilisation de `formatToFrenchDecimal()`
    - [ ] Modifier `formatToFrenchDecimal()` pour qu'il fasse la conversion en XPF


- [ ] CAS 1 : Prix en dur dans le code :
    - [ ] 1.1 : Crédits par âges
        - [ ] Utiliser `useDepositAmountsByAge()` lorsque le crédit est marqué en dur car il utilise directement `formatToFrenchDecimal()`: 
            - [ ] `300\u00a0€`
            - [ ] `30\u00a0€`
            - [ ] `20\u00a0€`
    - [ ] 1.2 : Crédit par seuil comme la part pour les offres numériques (plus tard le spectacle vivant)
        - [ ] Utiliser `formatToFrenchDecimal(NUMERIC_AMOUNT)`
        - [ ] Créer une constante la part du crédit pour les offres numériques. ex: const NUMERIC_AMOUNT = 10.000.


- [ ] CAS 2 : Utilisation de `useMaxPrice()` (ex `${maxPrice}\u00a0€ ...`)
    - [ ] Utiliser des centimes plutôt que des euros dans `useMaxPrice()` ?


- [ ] CAS 3 : Utilisation de `getDisplayPrice()` (ex: `dès 15,60\u00a0€` (tableau de prix))


- [ ] CAS 4 : Utilisation de `formatPriceInEuroToDisplayPrice()`


- [ ] CAS 5 : Mention de "€" (ex: `en&nbsp;€`)
    - [ ] Créer une fonction qui ne gère pas les crédits mais juste les devises

- [ ] Utiliser Intl > Voir si pour la NC > Voir si gestion du taux de change

---

## Tasks for another US

- [ ] 