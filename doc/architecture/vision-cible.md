# Architecture Vision Cible

## Grossomodo maintenant

Aujourd'hui, nos pages ressemblent +/- à ça

```mermaid
flowchart TB
  OfferPage
  -->|get offer id from URL| OfferDetails["OfferDetails ({ offerId?: number })"]
  -->|load offer| useGetOfferQuery{{"useGetOfferQuery(offerId)"}}

  useGetOfferQuery
  -->|loading| null["rien : la plupart du temps, on return null"]

  useGetOfferQuery
  -->|has no offer or error| ErrorNotFound

  useGetOfferQuery
  -->|has offer| OfferDetail["Display offer details"]

  OfferDetails
  -->|load recommanded offers| useRecommandedOffersQuery{{"useRecommandedOffersQuery(offerId: number)"}}

  useRecommandedOffersQuery
  -->|loading| PlaceholderPlaylists

  useRecommandedOffersQuery
  -->|has no recommanded offers or error| DisplayNothing

  useRecommandedOffersQuery
  -->|has recommanded offers| RecommandedOffers
```

##### Intermédiaire

Découpage en

- Page
- Container
- Dumb Component

Parfois une information détermine si on doit en charger une autre

-> découpage en sous container pour avoir un bon typage et éviter les `offer?.id` partout

```mermaid
flowchart TB
  OfferPage
  --> parseOfferIdFromURL{{"parseOfferIdFromURL ({ offerId?: number })"}}
  -->|has no offer or error| ErrorNotFound

  parseOfferIdFromURL
  -->|get offer id from URL| MaybeOfferContainer["MaybeOfferContainer ({ offerId: number })"]
  -->|load offer| useGetOfferQuery{{"useGetOfferQuery(offerId)"}}

  useGetOfferQuery
  -->|loading| LoadingPage

  useGetOfferQuery
  -->|has no offer or error| ErrorNotFound

  useGetOfferQuery
  -->|has offer| OfferContainer["OfferContainer ({ offer: Offer })"]
  --> OfferDetail

  OfferContainer
  -->|load recommanded offers| useRecommandedOffersQuery{{"useRecommandedOffersQuery(offerId: number)"}}

  useRecommandedOffersQuery
  -->|loading| PlaceholderPlaylists

  useRecommandedOffersQuery
  -->|has no recommanded offers or error| DisplayNothing

  useRecommandedOffersQuery
  -->|has recommanded offers| RecommandedOffers
```

##### Archi cible

Avec `ErrorBoundary` et `Suspense`

Cold start

```mermaid
flowchart TB
  subgraph errorboundaryWrapper
  direction TB
  ErrorBoundary
  --> OfferPage
  --> parseOfferIdFromURL{{"parseOfferIdFromURL ({ offerId?: number })"}}

  ErrorBoundary
  -->|invalid offer id| ErrorNotFound

  parseOfferIdFromURL
  -->|get offer id from URL| MaybeOfferContainer

  MaybeOfferContainer["MaybeOfferContainer ({ offerId: number })"]
  --> Suspense
  -->|loading| LoadingPage

  Suspense
  -->|load offer| useGetOfferQuery{{"useGetOfferQuery(offerId)"}}
  -->|has offer| OfferContainer

  OfferContainer["OfferContainer ({ offer: Offer })"]
  --> OfferDetail

  OfferContainer
  --> ErrorBoundary2[ErrorBoundary]
  subgraph ErrorBoundary2Wrapper
  ErrorBoundary2
  -->|has no recommanded offers or error| DisplayNothingAndIgnoreSilently["Display nothing and ignore silently"]

  ErrorBoundary2
  --> Suspense2[Suspense]
  -->|loading| PlaceholderPlaylists

  Suspense2
  -->|load recommanded offers| useRecommandedOffersQuery{{"useRecommandedOffersQuery(offerId: number)"}}

  useRecommandedOffersQuery
  -->|has recommanded offers| RecommandedOffers

  end
  MaybeOfferContainer -..->|"prefetch (si on veut améliorer les perfs)"| useRecommandedOffersQuery
  end
```
