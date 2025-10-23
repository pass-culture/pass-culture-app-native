# DR011 : Séparation des états (Serveur vs Client)

> Statut : Adopté

## Décision

Nous utiliserons systématiquement **React Query** pour gérer l'état serveur (données API) et **Zustand** pour l'état client (état de l'UI). L'usage de React Context sera limité à l'injection de dépendances simples et stables.

### **React Query pour l'état serveur**

- **Responsabilité** : Gérer cache, synchronisation, et états de chargement des données distantes
- **Colocation** : Queries dans le dossier `queries/` de chaque feature
- **Utilisation typique** : API calls, cache automatique, revalidation en arrière-plan

**Sélecteurs pour éviter les re-renders :**

Un sélecteur permet d’encapsuler la logique de retrait d’une valeur spécifique d’un state (une dérivée) pour améliorer les performances.

```tsx
 // ✅ Bon pattern avec sélecteur
 const selectArtistsNb = (artists: Artists) => artists.length
 
 const ArtistContainer = () => {
   const { data: artistsNb } = useArtistsQuery({ select: selectArtistsNb })
   return <Text>{artistsNb}</Text>
 }
```

**Contrat de query complet :**

```tsx
 // ✅ Retourner l'intégralité de la query
 const useArtistsQuery = () => useQuery({ queryFn: fetchArtists, queryKey: ['artists'] })
```

**Gestion d'état déclarative avec Suspense :**

[**https://react.dev/reference/react/Suspense**](https://react.dev/reference/react/Suspense)

[**https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary**](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

```tsx
 // Au niveau navigation - erreurs dures
 <ErrorBoundary fallback={<PageNotFound />}>
   <Suspense fallback={<LoadingPage />}>
     <SomePage />
   </Suspense>
 </ErrorBoundary>
 
 // Au niveau container - erreurs souples
 <ErrorBoundary fallback={null}>
   <Suspense fallback={<LoadingContainer />}>
     <OptionalContainer />
   </Suspense>
 </ErrorBoundary>
```

### **Zustand pour l'état client**

- **Responsabilité** : Gérer l'état "client" (état de l'UI, préférences, processus multi-écrans). "Client" ou "local" signifie ici "local au téléphone de l'utilisateur", par opposition à l'état "serveur".
- **Colocation** : Stores dans `stores/` par domaine métier.
- **Utilisation typique** : Éviter le "prop drilling" et partager un état entre plusieurs composants ou écrans sans complexité.

### **Cas d'usage typique : Formulaire en plusieurs étapes**

Un store Zustand est idéal pour gérer un état qui doit persister sur plusieurs écrans. Par exemple, pour un formulaire d'inscription en 3 étapes :

1. On crée un `useSignupFormStore` pour stocker les données du formulaire.
2. Chaque écran du formulaire lit et écrit dans ce même store.
3. À la dernière étape, un composant récupère l'état complet du store et l'envoie au serveur via une mutation React Query.

Cela évite de passer des données complexes via les paramètres de navigation.

```tsx
 interface SignupFormState {
   firstName: string;
   email: string;
   // ... autres champs
   setField: (field: keyof SignupFormState, value: string) => void;
 }
 
 export const useSignupFormStore = create<SignupFormState>((set) => ({
   firstName: '',
   email: '',
   setField: (field, value) => set({ [field]: value }),
 }))
```

Pour des exemples concrets d'application de ce principe, y compris un refactoring pas à pas d'un module legacy, veuillez consulter le document [exemple.md](../architecture/exemple.md).

## Contexte

Nos `Context Wrappers` legacy, comme `LocationWrapper` (113 usages, 20+ propriétés) et `AuthWrapper`, sont surdimensionnés. Ils mélangent état serveur, état client, et logique métier. Cela provoque des re-renders inutiles, une complexité de dépendances élevée et rend le code difficile à suivre et à tester.

## Alternatives considérées

- **Continuer avec React Context pour tout :** Rejeté en raison des problèmes de performance bien connus liés aux re-renders en cascade lorsque l'état change fréquemment.
- **Utiliser Redux :** Rejeté car considéré comme trop verbeux pour nos besoins d'état client, et React Query est bien plus adapté que Redux Toolkit Query pour la gestion de l'état serveur.

## Justification

- **React Query** est le standard de l'industrie pour l'état serveur. Il gère nativement le cache, la synchronisation en arrière-plan, les retries, et l'invalidation, ce qui simplifie énormément notre code.
- **Zustand** est une solution légère, rapide et simple pour gérer l'état de l'UI sans "provider hell". Il permet des sélections optimisées pour éviter les re-renders inutiles.
- Cette séparation clarifie l'intention de chaque état.

### **Pain points adressés**

- **✅ 28 createContext identifiés** : React Query + Zustand remplacent la prolifération de contexts
- **✅ 22 providers actifs App.tsx** : État serveur/local séparé pour réduire drastiquement les providers
- **✅ Performance P95 ~4s** : Cache intelligent et re-renders optimisés pour améliorer les temps de chargement

## Diagramme

Extrait de code

```mermaid
graph LR
    subgraph Legacy
        LegacyContext["LocationWrapper (Context)"]
        LegacyContext --> Data("Données serveur (geoloc)")
        LegacyContext --> UIState("État UI (mode sélectionné)")
        LegacyContext --> Logic("Logique métier")
    end

    subgraph Moderne
        ModernArch("Composant")
        ModernArch --> RQ["React Query (useGeolocationQuery)"]
        ModernArch --> ZS["Zustand (useLocationUIStore)"]
        RQ --> ServerData("Données serveur")
        ZS --> ClientState("État UI")
    end
```

## Actions à implémenter (non exhaustif)

1. Lors de la migration du `LocationWrapper`, l'état de géolocalisation et de permissions ira dans React Query.
2. L'état des modes de localisation et des rayons ira dans un store Zustand `useLocationUIStore`.
3. Le `FavoritesWrapper` (quick win) sera migré vers Zustand.
4. Définir et documenter des standards d'utilisation pour React Query (création des queries, mutations, gestion des clés, etc.) afin d'assurer une implémentation homogène dans tout le projet.

## Décisions associées

- **[DR016 : Logiques portées par le Backend](./DR016%20%20Logiques%20portées%20par%20le%20Backend.md)** : Ce principe de séparation des états est complété par la décision de déplacer les logiques métier complexes et les orchestrations d'appels côté backend, afin de garder le client léger.

- **[DR020 : Méthodologie de Refactorisation Legacy (Strangler Fig)](./DR020%20%20Méthodologie%20de%20Refactorisation%20Legacy%20(Strangler%20Fig).md)** : La migration des anciens `Context Wrappers` (qui mélangent les états) vers la nouvelle architecture définie ici se fera en suivant le pattern Strangler Fig, comme décrit dans cet ADR.

- **[DR022 : Principe de Responsabilité Unique (SRP)](./DR022%20%20Principe%20de%20Responsabilité%20Unique%20(SRP).md)** : Le SRP est le principe fondamental qui sous-tend la séparation des responsabilités (états serveur/client, logique/UI, effets de bord) définie dans cet ADR.

## Output

Des règles claires pour la gestion de l'état, menant à une meilleure performance et une plus grande maintenabilité.
