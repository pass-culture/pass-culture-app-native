# Architecture Vision Cible

Exemple d'une page offre où on charge les données de l'offre puis on charge des offres recommandées associées

S'il n'y a pas d'offres recommandées ou s'il y a une erreur lors de leur chargement, on n'affiche rien

## Maintenant

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

<small>Ce schéma ne représente pas réellement la page Offer actuelle mais représente les patterns qui apparaissent souvent</small>

## Intermédiaire

Découpage en

- Page
- Container
- Presentational Component

Pour plus d'information, [voir l'organisation des composants](./principes.md#lorganisation-des-composants)

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

## Archi cible

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

### Schéma généralisé

#### 2 données

Graphique montrant une page avec 2 données récupérées en parallèle

```mermaid
flowchart TB
  subgraph ErrorBoundary1Wrapper["ErrorBoundary"]
    direction TB

    ErrorBoundary1["ErrorBoundary"]
    --> Page
    --> parseArgumentsFromURL{{"parseArgumentsFromURL ({ resource1Id?: number, resource2Name?: string })"}}
    -->|invalid arguments| ErrorNotFound

    parseArgumentsFromURL
    -->|get arguments from URL| Container1
    parseArgumentsFromURL
    -->|get arguments from URL| Container2

    subgraph Container1Wrapper["Container1"]
      Container1
      --> Suspense1
      -->|loading| Skeleton1
      Suspense1
      -->|load resource| useGetResource1Query{{"useGetResource1Query(resource1Id)"}}
      -->|has resource| Presentational1
    end

    subgraph Container2Wrapper["Container2"]
      Container2
      --> Suspense2
      -->|loading| Skeleton2
      Suspense2
      -->|load resource| useGetResource2Query{{"useGetResource2Query(resource2Name)"}}
      -->|has resource| Presentational2
    end
  end
```

#### Donnée optionnelle

Graphique montrant une ressource principale nécessaire à la page et une ressource optionnelle

```mermaid
flowchart TB
  subgraph ErrorBoundaryWrapper["ErrorBoundary"]
  direction TB

    ErrorBoundary
    --> Page
    --> parseArgumentsFromURL{{"parseArgumentsFromURL ({ argument1?: number, argument2?: string })"}}

    ErrorBoundary
    -->|invalid arguments| ErrorNotFound

    parseArgumentsFromURL
    -->|get arguments from URL| Suspense
    -->|loading| LoadingPage

    Suspense
    -->|load resource| useGetResourceQuery{{"useGetResourceQuery(ResourceId)"}}
    -->|has resource| Container

    Container["Container ({ resource: Resource })"]
    --> ResourceDetail

    Container
    --> ErrorBoundary2[ErrorBoundary]

    subgraph ErrorBoundary2Wrapper["ErrorBoundary"]
      ErrorBoundary2
      -->|has no OptionalResources or error| DisplayNothingAndIgnoreSilently["Display nothing and ignore silently"]

      ErrorBoundary2
      --> Suspense2[Suspense]
      -->|loading| Placeholder

      Suspense2
      -->|load OptionalResources| useOptionalResourcesQuery{{"useOptionalResourcesQuery(ResourceId: number)"}}

      useOptionalResourcesQuery
      -->|has recommanded Resources| OptionalResources
    end

    Page -..->|"prefetch (si on veut améliorer les perfs)"| useOptionalResourcesQuery
  end
```
