# Architecture de l'app native

## Introduction

Ce document a pour vocation de donner des principes et lignes directrices pour les développeurs front-end de l'app native au sein du pass Culture.

La base de code ayant plus de 4 ans, il est important de consacrer un temps à la réflexion pour une maintenabilité sur le long terme.

Il sera amené à évoluer avec le temps et l'évolution des technologies utilisées.

L'objectif est d'appliquer des principes approuvés par le consensus des développeurs sans entrer dans le dogmatisme, ce qui ralentirait les développements avec pour seules raisons des arguments d'autorité et non pour le bien fondé de la base de code.

### Pourquoi une architecture ?

Faire en sorte que les développeurs, quelque soit leur niveau, puissent écrire du code en sachant à l'avance où chaque partie de son code devra aller, ainsi, moins de temps sera perdu aux interrogations quant aux problématiques redondantes.

### Qu'est-ce qu'une bonne architecture ?

#### Tester les comportements de l'app sans tester l'implémentation

Un test ne devrait pas casser si le comportement métier testé ne change pas, ainsi, si un test est déplacé, l'UI change, un nom ou une signature de fonction modifié.

#### Un environnement de test stable

Un simple test comme celui-ci devrait fonctionner dans n'importe quel fichier de test :

```tsx
render(<ComplexComponent />)
expect(true).toBeTruthy()
```

Ce test serait là pour vérifier l'environnement de test mais devrait être effacé avant le commit.

Si il faut déjà mocker des librairies pour que ce test passe, qu'il faut trigger plusieurs rendus utiliser des `act` ou des `waitFor` sans comprendre pourquoi, c'est qu'il y a un problème dans le setup de test.

Si tel est le cas (et tel est le cas), la mise en place de pratiques comme le TDD restent compromises sur les tests.

#### Un contrôle total des dépendances externes

Que ce soit par l'utilisation de mocks, injection de dépendances ou recréations de bases de données, il faut avoir un contrôle total des dépendances externes pour avoir des tests stables.

#### Un bon découplage entre le métier et l'UI

Quand tel est le cas, il est possible de tester l'application à des niveaux plus contrôlables (au niveau de fonctions pures ou de hooks).

## Les principes

### Structure

```txt
src/
  features/
    NOM_DE_LA_FEATURE/
      pages/
        UnePage.tsx
      containers/
        UnContainer/
          UnContainer.tsx
      components/
        Component/
          Component.tsx
      queries/
        useUneQuery.ts
        useUneMutation.ts
      stores/
        unStore.ts
      selectors/
        unSelector.ts
      fixtures/
        uneFixture.ts
      constants.ts
      types.ts
  queries/
    NOM_DE_LA_FEATURE_PRINCIPALE/
      useUneQuery.ts
  selectors/
    NOM_DE_LA_FEATURE_PRINCIPALE/
      unSelector.ts
```

En cas de doute, prévenir la guilde archi ⚠️ (ça signifie qu'il manque peut être un truc).

### La gestion d'état réseau avec React Query

React Query est au cœur de notre application et n'est pas utilisé à sa pleine capacité.

Voici quelques règles pour mieux l'utiliser.

#### Selecteurs

Utiliser des sélecteurs pour filtrer / formater les données plutôt que d'écrire un hook custom.

```ts
// ❌
const useArtistsNumberQuery = () => {
  const { data, ...rest } = useArtistsQuery()
  return { data: data.length, ...rest }
}
```

```tsx
// ✅
// dans feature/artist/selectors/selectArtistsNb.ts
const selectArtistsNb = (artists: Artists) => artists.length
// dans feature/artist/containers/ArtistContainer/ArtistContainer.tsx
const ArtistContainer = () => {
  const { data: artistsNb } = useArtistsQuery({ select: selectArtistsNb })
  return <Text>{artistsNb}</Text>
}
```

`selectArtistsNb` est une fonction pure et testable très facilement.

```tsx
// ✅
// dans feature/artist/selectors/selectArtistById.ts
const selectArtistById = (artistID: ArtistId) => (artists: Record<ArtistId, Artist>) =>
  artists[artistID]
// dans feature/artist/containers/ArtistContainer/ArtistContainer.tsx
const ArtistContainer: FunctionComponent<{ artistID: ArtistId }> = ({ artistID }) => {
  const { data: artist } = useArtistsQuery({ select: selectArtistById(artistID) })
  return <Text>{artist.name}</Text>
}
```

Lorsque un `selector` a de la logique (comme au moins une condition `if`, `switch`), il faut le séparer dans le dossier `../selectors/` et le tester unitairement.

#### Contrat

La query doit être entièrement retournée.

```ts
// ❌
const useArtistsQuery = () => {
  const { data, isLoading } = useQuery({ queryFn: fetchArtists, queryKeys: ['artists'] })
  return { data, isLoading }
}
```

```ts
// ✅
const useArtistsQuery = () => useQuery({ queryFn: fetchArtists, queryKeys: ['artists'] })
```

#### Conventions de nommage

- la fonction et le fichier se terminent respectivement par `Query` ou `Mutation` pour les différencier des autres hooks
- se situe dans un dossier `queries` qui est au niveau de la feature si utilisé seulement dans la feature ou situé dans `src/queries` si il est appelé par plusieurs features

Pour une query:

```ts
// ❌
// src/features/hooks/useArtists.ts
const useArtists = () => useQuery({ queryFn: fetchArtists, queryKeys: ['artists'] })
```

```ts
// ✅
// src/features/queries/useArtistsQuery.ts
const useArtistsQuery = () => useQuery({ queryFn: fetchArtists, queryKeys: ['artists'] })
```

Pour une mutation :

```ts
// ❌
// src/features/hooks/useArtists.ts
const useArtists = () => useMutation({ queryFn: fetchArtists, queryKeys: ['artists'] })
```

```ts
// ✅
// src/features/queries/useArtistsMutation.ts
const useArtistsMutation = () => useMutation({ queryFn: fetchArtists, queryKeys: ['artists'] })
```

#### State des queries

La gestion des états des queries (RQ) dans l'app est primordiale pour s'assurer d'avoir un rendu cohérent.
Une fois la version de RQ ≥ 4, nous pouvons utiliser :

- `Suspense`: pour gérer le loading des composants -> `Suspense` se charge d'afficher un composant de chargement tant que la data n'est pas présente et le composant désiré le cas échéant.

```jsx
// au niveau de la navigation
const navigation = () => (
  <ErrorBoundary onReset={reset} FallbackComponent={ErrorView}>
    <React.Suspense fallback={<LoadingPage />}>
      <SomePage />
    </React.Suspense>
  </ErrorBoundary>
)

// au niveau de la page
const SomePage = () => {
  const { data } = useSuspenseQuery({ queryKey, queryFn })
  return <SomeComponent data={data} />
}
```

- `ErrorBoundary` :
  - au niveau page les erreurs sont gérées de façon dure: si une erreur arrive lors du chargement de la donnée principale pour la page, la page doit afficher un `PageNotFound`

```jsx
const navigation = () => (
  <ErrorBoundary onReset={reset} FallbackComponent={<PageNotFound />}>
    <React.Suspense fallback={<LoadingContainer />}>
      <SomeContainer />
    </React.Suspense>
  </ErrorBoundary>
)
```

- au niveau container, les erreurs seront généralement (mais pas systématiquement) gérées de façon souple, par exemple si une playlist de recommandation ne se charge pas dans une page, on ne doit pas empêcher l'affichage de la page mais plutôt échouer de façon silencieuse et ne pas afficher la playlist

```jsx
const SomeContainer = () => (
  <ErrorBoundary onReset={reset} FallbackComponent={null}>
    <React.Suspense fallback={<LoadingContainer />}>
      <SomeContainer />
    </React.Suspense>
  </ErrorBoundary>
)
```

### La gestion des composants avec React

Notre architecture de composants est constituée de `pages`, de `containers` et de `presentational` composants.

#### Séparation of concern `page`, `containers` et `presentational` components

Une `page` est un `container` qui a accès à la navigation.

Une `page` ne contient pas forcément de `containers` et peut n'appeler que des composants `presentational`.

La `page` doit appeler la requête principale conditionnant l'affichage de la page (ex: l'objet `artist` dans la page Artiste).

Si la `page` appelle une seule requête, il n'est pas nécessaire d'avoir des `containers`.

Le découpage de la page en `container` peut venir de plusieurs contraintes :

- **plusieurs requêtes** entraînant plusieurs `containers`
- chaque `container` peut être **lié à un contexte** (SOC)
- si les tests sont simplifiés par la mise en place de `containers` multiples : la séparation en `container` peut diminuer la combinatoire des tests en isolant les logiques et en ne les combinant pas
- les `containers` seront testés dans la `page` pour leur cas nominal et dans leurs propres fichiers de tests pour les cas complexes

#### L'organisation des composants

##### Les `pages`

Contiennent la `navigation` et envoient ces informations via les `props` aux `containers`.

Les `pages` se trouvent dans `src/features/<feature>/pages/<nom de la page>Page/<nom de la page>Page.tsx`

Les noms des composants sont suffixé de `Page`

```tsx
const ArtistsPage: FunctionComponent = () => {
  const route = useRoute<UseRouteType<'Artists'>>()
  return (
    <>
      <Container1 artistId={route.params.artistId} />
      <Container2 from={route.params.from} />
    </>
  )
}
```

##### Les `containers`

Contiennent les `hooks` et les `queries`, ainsi ils sont modulaires.

Les containers sont des composants React chargés de gérer les données et la logique. Ils sont généralement utilisés pour récupérer des données depuis une source externe, gérer l'état, et transmettre les données aux composants de présentation.

Les `containers` se trouvent dans `src/features/<feature>/containers/<nom du container>Container/containers/<nom du container>Container.tsx`

Les noms des composants sont suffixé de `Container`

```tsx
type Props = {
  artistId: string
}

const ArtistsContainer: FunctionComponent<Props> = ({ artistId }) => {
  const { data: artist, status } = useGetArtistQuery(artistId)

  switch (status) {
    case 'idle':
    case 'loading':
      return <Skeleton />

    case 'success':
      return (
        <View>
          <ArtistHeader artist={artist.name} />
          <ArtistInfos
            name={artist.name}
            description={artist.description || undefined}
            imageURL={artist.image || undefined}
          />
        </View>
      )

    case 'error':
      return <NotFound />
  }
}
```

##### Les `presentational` components

Ce sont des composants contenant uniquement des logiques de présentation (pas de logique métier), ils ne doivent afficher que ce qui est passé en `props`.

Les `presentational` components se trouvent dans `src/features/<feature>/components/<nom du composant>/<nom du composant>.tsx`

Les noms des composants n'ont pas de suffix particulier

```tsx
// ❌
const Component: FunctionComponent = () => {
  return (
    <Pressable
      title="Bouton"
      onPress={() => {
        analytics.logConsultOffer()
      }}
    />
  )
}
```

```tsx
// ✅
const Container: FunctionComponent = () => {
  const onPress = () => {
    analytics.logConsultOffer()
  }

  return <Component title="Bouton" onPress={onPress} />
}

const Component: FunctionComponent<{ title: string; onPress: () => void }> = ({
  title,
  onPress,
}) => {
  return <Pressable title={title} onPress={onPress} />
}
```

Ainsi `onPress` et `title` sont utilisés au niveau du container rendant `Component` réutilisable.

#### Type spécifique pour les composants

Les `props` des composants devraient éviter d'être couplées à l'API.

```tsx
// ❌
type Props = {
  artist: ArtistResponse | null | undefined
}

const ArtistImage: FunctionComponent<Props> = ({ artist }) => {
  if (!artist) return null
  return <Image url={artist.image} />
}
```

```tsx
// ✅
type Props = {
  artistImageURL: string
}

const ArtistImage: FunctionComponent<Props> = ({ artistImageURL }) => {
  return <Image url={artistImageURL} />
}
```

#### La composition

La composition évite principalement le props drilling (passage de props en cascade) et donne plus de visibilité sur le composant.

Sans composition on aura un container qui sera plus concis et plus propre à première vue, mais sera très difficile à débugger pour 2 raisons :

- un fichier de test par composant, donc les tests sont difficiles à maintenir et à bouger
- un manque de vue d'ensemble du composant

```tsx
// ❌
const Container: FunctionComponent<{ subtitle: string }> = ({ subtitle }) => {
  return (
    <View>
      <Component1 />
    </View>
  )
}

const Component1: FunctionComponent<{ subtitle: string }> = ({ subtitle }) => {
  return (
    <>
      <Component2 subtitle={subtitle} />
      <Component3 />
    </>
  )
}

const Component2: FunctionComponent<{ subtitle: string }> = ({ subtitle }) => {
  const title = useGetTitle()

  return (
    <>
      <Title>{title}</Title>
      {!!subtitle ? <Text>{subtitle}</Text> : null}
    </>
  )
}

const Component3 = () => {
  const onPress = useOnPress()

  return <Button title="button" onPress={onPress} />
}
```

```tsx
// ✅
const Container: FunctionComponent<{ subtitle: string }> = ({ subtitle }) => {
  const onPress = useOnPress()
  const title = useGetTitle()

  return (
    <View>
      <Title>{title}</Title>
      {!!subtitle ? <Text>{subtitle}</Text> : null}
      <Button title="button" onPress={onPress} />
    </View>
  )
}
```

### Les tests unitaires

Pour nos tests unitaires, nous devons isoler le SUT ([System Under Test](https://en.wikipedia.org/wiki/System_under_test)) du code que l'on n'édite pas dans ce repo et qui pourrait faire des effets de bord.

Exemple :

- mocker la lib `algoliasearch`
  - pas le hook qui l'appel
  - pas l'appel réseau qui est fait par la lib
- mocker notre backend en simulant une réponse réseau via MSW
  - pas le hook qui l'appel

### La gestion d'états locaux avec Zustand

Zustand est le state global de l'app, il permet de partager et modifier des variables entre plusieurs vues.
Il évite le props drilling et l'utilisation de contextes qui sont néfastes à l'app (en terme de maintenance et d'optimisation de rendus)

Il ne doit être utilisé que pour les états qui ne proviennent pas du serveur (ex : localisation).

Un seul store doit être créé pour un contexte

### Logiques portées par le backend

Nous nous efforcerons dans le futur de déplacer un maximum de logiques métiers dans le backend (routes natives de l'API), ceci afin :

- de soulager le frontend de calculs qui peuvent parfois être complexes
- de tester plus facilement ces logiques dans le backend (pas de notion d'UI donc pas de couplage)
- de pouvoir consommer une donnée dans le frontend qui soit déjà au format d'affichage

Cette logique est possible car nous maintenons le code de l'API, et que les routes natives ne sont utilisées que par notre app.
Nous pouvons introduire des breakings changes grâce au versioning des routes (`/v1`, `/v2`, ...).

## TODO

- à creuser plus tard

  - navigation
  - analytics
  - API `null` `undefined`
  - Les données provenant de l'URL/API/User doivent être parsées avant d'être utilisées dans l'application.

    > never trust user input

    - Type Primitif -> Value object (ex : Price)

- faire des règles ESLint pour enforce nos principes
