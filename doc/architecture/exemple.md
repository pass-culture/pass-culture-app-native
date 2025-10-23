# Évolution d'un module Legacy : Application des principes ADR

Ce document illustre, étape par étape, comment un module React Native initialement "mal conçu" peut être refactorisé en appliquant progressivement les principes définis dans nos Architecture Decision Records (ADR).

---

## Étape 0 : Le module "mal fait" (Legacy)

Nous prenons comme exemple un composant simplifié de la page d'accueil (`GenericHome.tsx`). Ce composant gère manuellement la pagination des modules de la page d'accueil, mélangeant ainsi la gestion de l'état de l'UI (index de pagination, état de chargement) avec les données issues du serveur.

**Problèmes identifiés :**

- Mélange de l'état serveur et client (violation de DR011).
- Logique de pagination complexe directement dans le composant.
- Utilisation de `setInterval` pour la gestion du chargement, ce qui est impératif et difficile à maintenir.

```typescript
// exemple.md - Étape 0 : Le module "mal fait" (Legacy)

import React, { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, useWindowDimensions } from 'react-native';
import { useGetOffersDataQuery } from 'features/home/queries/useGetOffersDataQuery';
import { useGetVenuesData } from 'features/home/api/useGetVenuesData';
import { HomepageModule, isOffersModule, isVenuesModule } from 'features/home/types';
import { enrichModulesWithData } from 'features/home/helpers/enrichModulesWithData';
import { isCloseToBottom } from 'libs/analytics'; // Supposons que c'est une fonction pure
import { Spinner } from 'ui/components/Spinner';

// --- Définitions simplifiées pour l'exemple ---
type GenericHomeProps = {
  modules: HomepageModule[];
  homeId: string;
}
type Offer = { id: string; title: string; }; // Simplifié
type Venue = { id: string; name: string; }; // Simplifié
type OffersModulesData = { data: Offer[] }; // Simplifié
type VenuesModulesData = { data: Venue[] }; // Simplifié
// --- Fin définitions simplifiées ---

const initialNumToRender = 10;
const maxToRenderPerBatch = 6;
const MODULES_TIMEOUT_VALUE_IN_MS = 3000;

const OnlineHome: FunctionComponent<GenericHomeProps> = React.memo(function OnlineHome({ modules, homeId }) {
  const offersModulesData: OffersModulesData = useGetOffersDataQuery(modules.filter(isOffersModule));
  const { venuesModulesData }: { venuesModulesData: VenuesModulesData } = useGetVenuesData(modules.filter(isVenuesModule));

  const [maxIndex, setMaxIndex] = useState(initialNumToRender);
  const [isLoading, setIsLoading] = useState(false);
  const { height: screenHeight } = useWindowDimensions();
  const modulesIntervalId = useRef<NodeJS.Timeout | null>(null);

  const enrichedModules = useMemo(
    () => enrichModulesWithData(modules, offersModulesData, venuesModulesData).slice(0, maxIndex),
    [modules, offersModulesData, venuesModulesData, maxIndex]
  );

  const scrollListenerToThrottle = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isCloseToBottom({ ...event.nativeEvent, padding: screenHeight })) {
        if (maxIndex < modules.length) {
          setIsLoading(true);
          setMaxIndex(prevMaxIndex => prevMaxIndex + maxToRenderPerBatch);
        }
      }
    },
    [maxIndex, modules.length, screenHeight]
  );

  useEffect(() => {
    modulesIntervalId.current = setInterval(() => {
      if (maxIndex < modules.length && isLoading) {
        setMaxIndex(prevMaxIndex => prevMaxIndex + maxToRenderPerBatch);
      } else {
        setIsLoading(false);
      }
    }, MODULES_TIMEOUT_VALUE_IN_MS);

    return () => {
      if (modulesIntervalId.current) {
        clearInterval(modulesIntervalId.current);
        modulesIntervalId.current = null;
      }
    };
  }, [modules.length, isLoading, maxIndex]);

  const onContentSizeChange = () => setIsLoading(false);

  return (
    <FlatList
      data={enrichedModules}
      onScroll={scrollListenerToThrottle}
      onContentSizeChange={onContentSizeChange}
      ListFooterComponent={isLoading ? <Spinner /> : null}
      // ... autres props
    />
  );
});

export const GenericHome: FunctionComponent<GenericHomeProps> = (props) => {
  // ... logique de connexion/déconnexion simplifiée
  return <OnlineHome {...props} />;
};
```

---

## Étape 1 : Application de DR011 (Séparation des états Serveur vs Client)

**Principe DR011 :** Utiliser React Query pour l'état serveur et Zustand pour l'état client. Éviter de mélanger ces responsabilités dans les composants.

**Problème identifié dans l'Étape 0 :** La logique de pagination (`maxIndex`, `isLoading`, `setInterval`) est gérée manuellement dans le composant, alors qu'elle est intimement liée aux données serveur (`modules`). Cela viole le principe de séparation des états.

**Solution :** Utiliser `useInfiniteQuery` de React Query. Ce hook est spécifiquement conçu pour gérer la pagination des données serveur, encapsulant l'état de chargement, la gestion des pages et la récupération des données de manière déclarative.

**Code après application de DR011 :**

```typescript
// exemple.md - Étape 1 : Application de DR011

import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, useWindowDimensions } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query'; // Import de useInfiniteQuery
import { HomepageModule, isOffersModule, isVenuesModule, isVideoCarouselModule, ThematicHeader } from 'features/home/types';
import { enrichModulesWithData } from 'features/home/helpers/enrichModulesWithData';
import { isCloseToBottom } from 'libs/analytics';
import { Spinner } from 'ui/components/Spinner';
import { PageContent, Spacer, VideoCarouselModule } from 'src/features/home/pages/GenericHome'; // Imports simplifiés pour l'exemple
import { View, Text } from 'react-native'; // Imports simplifiés

// --- Définitions simplifiées pour l'exemple ---
type GenericHomeProps = {
  Header: React.JSX.Element;
  HomeBanner?: React.JSX.Element;
  modules: HomepageModule[]; // Ces modules seront maintenant gérés par useInfiniteQuery
  homeId: string;
  thematicHeader?: ThematicHeader;
}
type Offer = { id: string; title: string; };
type Venue = { id: string; name: string; };
type OffersModulesData = { data: Offer[] };
type VenuesModulesData = { venuesModulesData: { data: Venue[] } };

// Fonction pour simuler la récupération de modules par page
// En réalité, cette fonction ferait un appel API paginé.
const fetchHomepageModules = async (pageParam = 0, allModules: HomepageModule[]): Promise<{ modules: HomepageModule[], nextPage: number | undefined }> => {
  const pageSize = 10; // Nombre de modules par page
  const start = pageParam * pageSize;
  const end = start + pageSize;
  const paginatedModules = allModules.slice(start, end);
  const nextPage = end < allModules.length ? pageParam + 1 : undefined;
  return { modules: paginatedModules, nextPage };
};
// --- Fin définitions simplifiées ---

const OnlineHome: FunctionComponent<GenericHomeProps> = React.memo(function OnlineHome({ Header, HomeBanner, modules: initialModules, homeId, thematicHeader }) {
  const { height: screenHeight } = useWindowDimensions();

  // Utilisation de useInfiniteQuery pour gérer la pagination
  const { 
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['homepageModules', homeId],
    queryFn: ({ pageParam }) => fetchHomepageModules(pageParam, initialModules),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  // Aplatir les données de toutes les pages
  const allFetchedModules = useMemo(() => data?.pages.flatMap(page => page.modules) || [], [data]);

  // Enrichir les modules (cette logique pourrait être déplacée ou optimisée)
  const offersModulesData: OffersModulesData = { data: [] }; // Simplifié, en réalité viendrait d'autres queries
  const venuesModulesData: VenuesModulesData = { venuesModulesData: { data: [] } }; // Simplifié

  const enrichedModules = useMemo(
    () => enrichModulesWithData(allFetchedModules, offersModulesData, venuesModulesData),
    [allFetchedModules, offersModulesData, venuesModulesData]
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const scrollListenerToThrottle = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isCloseToBottom({ ...event.nativeEvent, padding: screenHeight })) {
        handleLoadMore();
      }
    },
    [screenHeight, handleLoadMore]
  );

  if (isLoading) {
    return <Spinner />; // Afficher un spinner initial
  }
  if (isError) {
    return <Text>Erreur de chargement des modules.</Text>;
  }

  const videoCarouselModules = enrichedModules.filter(isVideoCarouselModule); // Supposons que isVideoCarouselModule est pure

  const shouldDisplayVideoInHeader =
    !thematicHeader && enrichedModules[0]?.type === HomepageModuleType.VideoCarouselModule;

  const ListHeader = useMemo(
    () => (
      <View testID="listHeader">
        {Header}
        <Spacer.Column numberOfSpaces={6} />
        {shouldDisplayVideoInHeader && videoCarouselModules[0] ? (
          <VideoCarouselModule
            index={0}
            homeEntryId={homeId}
            {...videoCarouselModules[0]}
            autoplay
          />
        ) : null}
        <PageContent>{HomeBanner}</PageContent>
      </View>
    ),
    [Header, shouldDisplayVideoInHeader, videoCarouselModules, homeId, HomeBanner]
  );

  return (
    <FlatList
      data={enrichedModules}
      onScroll={scrollListenerToThrottle}
      ListFooterComponent={isFetchingNextPage ? <Spinner /> : null}
      onEndReached={handleLoadMore} // Utiliser onEndReached pour déclencher le chargement
      onEndReachedThreshold={0.5}
      ListHeaderComponent={ListHeader}
      // ... autres props
    />
  );
});

export const GenericHome: FunctionComponent<GenericHomeProps> = (props) => {
  return <OnlineHome {...props} />;
};
```

---

## Étape 2 : Application de DR012 (Extraire la logique métier dans des fonctions pures)

**Principe DR012 :** La logique métier complexe et les calculs d'états dérivés doivent être implémentés dans des fonctions pures. Les hooks servent ensuite de "connecteurs" pour utiliser ces fonctions pures au sein de l'écosystème React.

**Problème identifié dans l'Étape 1 :** Le calcul de la variable `shouldDisplayVideoInHeader` est effectué directement dans un `useMemo` au sein du composant. Bien que simple, c'est une logique de dérivation d'état qui peut être extraite dans une fonction pure pour améliorer la testabilité et la réutilisabilité.

**Solution :** Créer une fonction pure `shouldDisplayVideoCarouselInHeader` qui prend les dépendances nécessaires en entrée et retourne le booléen. Le `useMemo` dans le composant appellera ensuite cette fonction pure.

**Code après application de DR012 :**

```typescript
// exemple.md - Étape 2 : Application de DR012

// Fichier : src/features/home/helpers/shouldDisplayVideoCarouselInHeader.ts
import { HomepageModule, HomepageModuleType, ThematicHeader } from 'features/home/types';

export function shouldDisplayVideoCarouselInHeader(
  thematicHeader: ThematicHeader | undefined,
  enrichedModules: HomepageModule[]
): boolean {
  return !thematicHeader && enrichedModules[0]?.type === HomepageModuleType.VideoCarouselModule;
}

// Fichier : OnlineHome (extrait)
import React, { FunctionComponent, useCallback, useMemo } from 'react';
// ... autres imports
import { shouldDisplayVideoCarouselInHeader } from 'features/home/helpers/shouldDisplayVideoCarouselInHeader'; // Import de la fonction pure

const OnlineHome: FunctionComponent<GenericHomeProps> = React.memo(function OnlineHome({ Header, HomeBanner, modules: initialModules, homeId, thematicHeader }) {
  // ... (code de l'étape 1)

  const enrichedModules = useMemo(
    () => enrichModulesWithData(allFetchedModules, offersModulesData, venuesModulesData),
    [allFetchedModules, offersModulesData, venuesModulesData]
  );

  // Application de DR012 : Le calcul est maintenant dans une fonction pure
  const shouldDisplayVideoInHeader = useMemo(
    () => shouldDisplayVideoCarouselInHeader(thematicHeader, enrichedModules),
    [thematicHeader, enrichedModules]
  );

  const videoCarouselModules = enrichedModules.filter(isVideoCarouselModule); // Supposons que isVideoCarouselModule est pure

  const ListHeader = useMemo(
    () => (
      <View testID="listHeader">
        {Header}
        <Spacer.Column numberOfSpaces={6} />
        {/* Utilisation du booléen calculé par la fonction pure */}
        {shouldDisplayVideoInHeader && videoCarouselModules[0] ? (
          <VideoCarouselModule
            index={0}
            homeEntryId={homeId}
            {...videoCarouselModules[0]}
            autoplay
          />
        ) : null}
        <PageContent>{HomeBanner}</PageContent>
      </View>
    ),
    [Header, shouldDisplayVideoInHeader, videoCarouselModules, homeId, HomeBanner]
  );

  return (
    <FlatList
      data={enrichedModules}
      // ...
      ListHeaderComponent={ListHeader}
      // ...
    />
  );
});
```

---

## Étape 3 : Application de DR013 (Isolation des effets de bord)

**Principe DR013 :** Les effets de bord (analytics, storage, etc.) doivent être isolés dans des hooks dédiés. Ils ne doivent pas être mélangés avec la logique métier ou l'état de l'UI.

**Problème identifié dans l'Étape 2 :** Le composant `OnlineHome` contient des appels directs à des services d'analytics (`analytics.logAllModulesSeen`, `BatchProfile.trackEvent`) encapsulés dans des `useFunctionOnce`. Bien que `useFunctionOnce` aide à gérer l'exécution, la logique de tracking elle-même n'est pas isolée dans un hook *dédié à l'effet de bord*.

**Solution :** Créer un hook `useTrackAllModulesSeen` qui encapsule toute la logique de tracking liée à la vue de tous les modules. Cela rend l'intention explicite et centralise la gestion de cet effet de bord.

**Code après application de DR013 :**

```typescript
// exemple.md - Étape 3 : Application de DR013

// Fichier : src/features/home/hooks/useTrackAllModulesSeen.ts
import { useCallback } from 'react';
import useFunctionOnce from 'libs/hooks/useFunctionOnce';
import { analytics } from 'libs/analytics/provider';
import { BatchEvent, BatchEventAttributes, BatchProfile } from 'libs/react-native-batch';
import { ThematicHeader } from 'features/home/types';

export function useTrackAllModulesSeen(homeId: string, thematicHeader: ThematicHeader | undefined, modulesLength: number) {
  const track = useFunctionOnce(() => {
    analytics.logAllModulesSeen(modulesLength);
    const attributes = new BatchEventAttributes();
    attributes.put('home_id', homeId);
    attributes.put(
      'home_type',
      thematicHeader ? `thematicHome - ${thematicHeader.type}` : 'mainHome'
    );
    BatchProfile.trackEvent(BatchEvent.hasSeenAllTheHomepage, attributes);
  });
  return track;
}

// Fichier : OnlineHome (extrait)
import React, { FunctionComponent, useCallback, useMemo, useEffect } from 'react';
// ... autres imports
import { useTrackAllModulesSeen } from 'features/home/hooks/useTrackAllModulesSeen'; // Import du nouveau hook

const OnlineHome: FunctionComponent<GenericHomeProps> = React.memo(function OnlineHome({ Header, HomeBanner, modules: initialModules, homeId, thematicHeader }) {
  // ... (code de l'étape 2)

  // Application de DR013 : Isolation des effets de bord d'analytics
  const trackAllModulesSeen = useTrackAllModulesSeen(homeId, thematicHeader, initialModules.length);

  const scrollListenerToThrottle = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isCloseToBottom({ ...event.nativeEvent, padding: screenHeight })) {
        handleLoadMore();
      }
      // Ici, on pourrait aussi appeler un hook dédié pour le tracking du scroll si nécessaire
    },
    [screenHeight, handleLoadMore]
  );

  // Déclenchement de l'effet de bord quand tous les modules sont chargés
  useEffect(() => {
    if (allFetchedModules.length > 0 && allFetchedModules.length === initialModules.length) {
      trackAllModulesSeen();
    }
  }, [allFetchedModules.length, initialModules.length, trackAllModulesSeen]);

  return (
    <FlatList
      data={enrichedModules}
      onScroll={scrollListenerToThrottle}
      ListFooterComponent={isFetchingNextPage ? <Spinner /> : null}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={ListHeader}
      // ... autres props
    />
  );
});
```

---

## Étape 4 : Application de DR014 (Séparation UI / Logique / Navigation)

**Principe DR014 :** Séparer l'UI (Vue), la Logique (ViewModel/Controller) et la Navigation. Le composant de Vue doit être "bête", la logique dans un hook personnalisé, et la navigation gérée par des hooks dédiés.

**Problème identifié dans l'Étape 3 :** Le composant `OnlineHome` est encore un composant "intelligent" qui gère à la fois sa logique métier, son état et son rendu.

**Solution :** Extraire la logique dans un hook `useHomeViewModel` et créer un composant `HomeView` "bête" pour le rendu.

**Code après application de DR014 :**

```typescript
// exemple.md - Étape 4 : Application de DR014

// Fichier : src/features/home/hooks/useHomeViewModel.ts
import React, { useCallback, useEffect, useMemo } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, useWindowDimensions, View } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { HomepageModule, isOffersModule, isVenuesModule, isVideoCarouselModule, ThematicHeader } from 'features/home/types';
import { enrichModulesWithData } from 'features/home/helpers/enrichModulesWithData';
import { isCloseToBottom } from 'libs/analytics';
import { useTrackAllModulesSeen } from './useTrackAllModulesSeen';
import { shouldDisplayVideoCarouselInHeader } from 'features/home/helpers/shouldDisplayVideoCarouselInHeader';
import { Spinner } from 'ui/components/Spinner';
import { PageContent, Spacer, VideoCarouselModule } from 'src/features/home/pages/GenericHome'; // Imports simplifiés pour l'exemple

// --- Définitions simplifiées pour l'exemple ---
type HomeViewModel = {
  enrichedModules: HomepageModule[];
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  handleLoadMore: () => void;
  ListHeaderComponent: React.ReactElement; // Ou une fonction qui le retourne
  shouldDisplayVideoInHeader: boolean;
  videoCarouselModules: HomepageModule[];
  // ... autres données/callbacks nécessaires à la vue
}
// --- Fin définitions simplifiées ---

// Fonction pour simuler la récupération de modules par page (déjà définie à l'étape 1)
const fetchHomepageModules = async (pageParam = 0, allModules: HomepageModule[]): Promise<{ modules: HomepageModule[], nextPage: number | undefined }> => {
  const pageSize = 10;
  const start = pageParam * pageSize;
  const end = start + pageSize;
  const paginatedModules = allModules.slice(start, end);
  const nextPage = end < allModules.length ? pageParam + 1 : undefined;
  return { modules: paginatedModules, nextPage };
};

export function useHomeViewModel(initialModules: HomepageModule[], homeId: string, thematicHeader: ThematicHeader | undefined, Header: React.JSX.Element, HomeBanner?: React.JSX.Element): HomeViewModel {
  const { height: screenHeight } = useWindowDimensions();

  const { 
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['homepageModules', homeId],
    queryFn: ({ pageParam }) => fetchHomepageModules(pageParam, initialModules),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  const allFetchedModules = useMemo(() => data?.pages.flatMap(page => page.modules) || [], [data]);

  const offersModulesData: OffersModulesData = { data: [] }; // Simplifié
  const venuesModulesData: VenuesModulesData = { venuesModulesData: { data: [] } }; // Simplifié

  const enrichedModules = useMemo(
    () => enrichModulesWithData(allFetchedModules, offersModulesData, venuesModulesData),
    [allFetchedModules, offersModulesData, venuesModulesData]
  );

  const trackAllModulesSeen = useTrackAllModulesSeen(homeId, thematicHeader, initialModules.length);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const scrollListenerToThrottle = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isCloseToBottom({ ...event.nativeEvent, padding: screenHeight })) {
        handleLoadMore();
      }
    },
    [screenHeight, handleLoadMore]
  );

  useEffect(() => {
    if (allFetchedModules.length > 0 && allFetchedModules.length === initialModules.length) {
      trackAllModulesSeen();
    }
  }, [allFetchedModules.length, initialModules.length, trackAllModulesSeen]);

  const shouldDisplayVideoInHeader = useMemo(
    () => shouldDisplayVideoCarouselInHeader(thematicHeader, enrichedModules),
    [thematicHeader, enrichedModules]
  );

  const videoCarouselModules = enrichedModules.filter(isVideoCarouselModule);

  const ListHeaderComponent = useMemo(
    () => (
      <View testID="listHeader">
        {Header}
        <Spacer.Column numberOfSpaces={6} />
        {shouldDisplayVideoInHeader && videoCarouselModules[0] ? (
          <VideoCarouselModule
            index={0}
            homeEntryId={homeId}
            {...videoCarouselModules[0]}
            autoplay
          />
        ) : null}
        <PageContent>{HomeBanner}</PageContent>
      </View>
    ),
    [Header, shouldDisplayVideoInHeader, videoCarouselModules, homeId, HomeBanner]
  );

  return {
    enrichedModules,
    isFetchingNextPage,
    isLoading,
    isError,
    handleScroll: scrollListenerToThrottle,
    handleLoadMore,
    ListHeaderComponent,
    shouldDisplayVideoInHeader,
    videoCarouselModules,
  };
}

// Fichier : src/features/home/components/HomeView.tsx
import React, { FunctionComponent } from 'react';
import { FlatList, View, Text, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Spinner } from 'ui/components/Spinner';
import { HomepageModule } from 'features/home/types';

// --- Définitions simplifiées pour l'exemple ---
type HomeViewProps = {
  enrichedModules: HomepageModule[];
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  handleLoadMore: () => void;
  ListHeaderComponent: React.ReactElement; // Ou une fonction qui le retourne
  // ... other props from ViewModel
}
// --- Fin définitions simplifiées ---

export const HomeView: FunctionComponent<HomeViewProps> = ({
  enrichedModules,
  isFetchingNextPage,
  isLoading,
  isError,
  handleScroll,
  handleLoadMore,
  ListHeaderComponent,
}) => {
  if (isLoading) {
    return <Spinner />;
  }
  if (isError) {
    return <Text>Erreur de chargement des modules.</Text>;
  }

  return (
    <FlatList
      data={enrichedModules}
      onScroll={handleScroll}
      ListFooterComponent={isFetchingNextPage ? <Spinner /> : null}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={ListHeaderComponent}
      // ... autres props
    />
  );
};

// Fichier : src/features/home/pages/GenericHome.tsx (composant principal)
import React, { FunctionComponent } from 'react';
import { useHomeViewModel } from 'features/home/hooks/useHomeViewModel'; // Import ViewModel hook
import { HomeView } from 'features/home/components/HomeView'; // Import View component

// ... (GenericHomeProps et autres types)

const OnlineHome: FunctionComponent<GenericHomeProps> = React.memo(function OnlineHome(props) {
  const { Header, HomeBanner, modules, homeId, thematicHeader } = props;

  // Utilisation du ViewModel pour obtenir toutes les données et callbacks
  const {
    enrichedModules,
    isFetchingNextPage,
    isLoading,
    isError,
    handleScroll,
    handleLoadMore,
    ListHeaderComponent,
  } = useHomeViewModel(modules, homeId, thematicHeader, Header, HomeBanner);

  return (
    <HomeView
      enrichedModules={enrichedModules}
      isFetchingNextPage={isFetchingNextPage}
      isLoading={isLoading}
      isError={isError}
      handleScroll={handleScroll}
      handleLoadMore={handleLoadMore}
      ListHeaderComponent={ListHeaderComponent}
    />
  );
});

export const GenericHome: FunctionComponent<GenericHomeProps> = (props) => {
  return <OnlineHome {...props} />;
};
```

---

## Étape 5 : Application de DR022 (Principe de Responsabilité Unique)

**Principe DR022 :** Chaque composant, hook ou fonction doit avoir une unique et bien définie responsabilité. Un module ne doit pas connaître les détails d'implémentation de ses dépendances, mais seulement leur intention.

**Problème identifié dans l'Étape 4 :** Bien que le composant `OnlineHome` ait été décomposé en `useHomeViewModel` (Logique) et `HomeView` (UI), le `useHomeViewModel` est encore responsable de la *création* du `ListHeaderComponent` (un élément de rendu complexe). Cela viole le SRP du ViewModel, qui devrait se concentrer sur la logique et les données, et non sur la composition de l'UI.

**Solution :** Extraire le `ListHeaderComponent` dans son propre composant `HomeListHeader`. Le `useHomeViewModel` fournira alors les *props* nécessaires à ce composant, et le `HomeView` se chargera de l'instancier et de le rendre.

**Code après application de DR022 :**

```typescript
// exemple.md - Étape 5 : Application de DR022

// Fichier : src/features/home/components/HomeListHeader.tsx
import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import { Spacer, PageContent, VideoCarouselModule } from 'src/features/home/pages/GenericHome'; // Imports simplifiés
import { HomepageModule } from 'features/home/types';

type HomeListHeaderProps = {
  Header: React.JSX.Element;
  HomeBanner?: React.JSX.Element;
  shouldDisplayVideoInHeader: boolean;
  videoCarouselModules: HomepageModule[];
  homeId: string;
}

export const HomeListHeader: FunctionComponent<HomeListHeaderProps> = ({
  Header,
  HomeBanner,
  shouldDisplayVideoInHeader,
  videoCarouselModules,
  homeId,
}) => {
  return (
    <View testID="listHeader">
      {Header}
      <Spacer.Column numberOfSpaces={6} />
      {shouldDisplayVideoInHeader && videoCarouselModules[0] ? (
        <VideoCarouselModule
          index={0}
          homeEntryId={homeId}
          {...videoCarouselModules[0]}
          autoplay
        />
      ) : null}
      <PageContent>{HomeBanner}</PageContent>
    </View>
  );
};

// Fichier : src/features/home/hooks/useHomeViewModel.ts (extrait)
import React, { useCallback, useEffect, useMemo } from 'react';
// ... autres imports
import { HomeListHeader, HomeListHeaderProps } from 'features/home/components/HomeListHeader'; // Import du nouveau composant

export function useHomeViewModel(initialModules: HomepageModule[], homeId: string, thematicHeader: ThematicHeader | undefined, Header: React.JSX.Element, HomeBanner?: React.JSX.Element): HomeViewModel {
  // ... (logique précédente)

  // Le ViewModel prépare les props pour le HomeListHeader, mais ne le rend pas.
  const homeListHeaderProps = useMemo(() => ({
    Header,
    HomeBanner,
    shouldDisplayVideoInHeader,
    videoCarouselModules,
    homeId,
  }), [Header, HomeBanner, shouldDisplayVideoInHeader, videoCarouselModules, homeId]);

  return {
    // ...
    homeListHeaderProps, // On retourne les props pour le composant d'en-tête
  };
}

// Fichier : src/features/home/components/HomeView.tsx (extrait)
import React, { FunctionComponent } from 'react';
import { FlatList, View, Text, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Spinner } from 'ui/components/Spinner';
import { HomepageModule } from 'features/home/types';
import { HomeListHeader, HomeListHeaderProps } from './HomeListHeader'; // Import du nouveau composant

// --- Définitions simplifiées pour l'exemple ---
type HomeViewProps = {
  enrichedModules: HomepageModule[];
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  handleLoadMore: () => void;
  homeListHeaderProps: HomeListHeaderProps; // Nouvelle prop
  // ... other props from ViewModel
}
// --- Fin définitions simplifiées ---

export const HomeView: FunctionComponent<HomeViewProps> = ({
  enrichedModules,
  isFetchingNextPage,
  isLoading,
  isError,
  handleScroll,
  handleLoadMore,
  homeListHeaderProps, // Utilisation de la nouvelle prop
}) => {
  if (isLoading) {
    return <Spinner />;
  }
  if (isError) {
    return <Text>Erreur de chargement des modules.</Text>;
  }

  return (
    <FlatList
      data={enrichedModules}
      onScroll={handleScroll}
      ListFooterComponent={isFetchingNextPage ? <Spinner /> : null}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={<HomeListHeader {...homeListHeaderProps} />} // Rendu du nouveau composant
      // ... autres props
    />
  );
};

// Fichier : src/features/home/pages/GenericHome.tsx (composant principal)
import React, { FunctionComponent } from 'react';
import { useHomeViewModel } from 'features/home/hooks/useHomeViewModel';
import { HomeView } from 'features/home/components/HomeView';

// ... (GenericHomeProps et autres types)

const OnlineHome: FunctionComponent<GenericHomeProps> = React.memo(function OnlineHome(props) {
  const { Header, HomeBanner, modules, homeId, thematicHeader } = props;

  const {
    enrichedModules,
    isFetchingNextPage,
    isLoading,
    isError,
    handleScroll,
    handleLoadMore,
    homeListHeaderProps,
  } = useHomeViewModel(modules, homeId, thematicHeader, Header, HomeBanner);

  return (
    <HomeView
      enrichedModules={enrichedModules}
      isFetchingNextPage={isFetchingNextPage}
      isLoading={isLoading}
      isError={isError}
      handleScroll={handleScroll}
      handleLoadMore={handleLoadMore}
      homeListHeaderProps={homeListHeaderProps}
    />
  );
});

export const GenericHome: FunctionComponent<GenericHomeProps> = (props) => {
  return <OnlineHome {...props} />;
};
```

---

## Étape 6 : Application de DR015 (Injection de Dépendances via Context)

**Principe DR015 :** Context doit être utilisé pour l'injection de dépendances de services stables et mémoïsés, et non comme un store global pour l'état.

**Problème identifié :** Le `AuthContext` est utilisé comme un store global pour l'état de connexion (`isLoggedIn`) et les données utilisateur (`user`), ce qui viole DR015. Le `AuthWrapper` est un composant monolithique qui gère cet état, des effets de bord complexes et la logique de connexion/déconnexion.

**Solution :**

1. **Extraire l'état client (`isLoggedIn`) dans un store Zustand (`useAuthStore`).**
2. **Extraire l'état serveur (`user`) dans un hook React Query (`useUserQuery`).**
3. **Simplifier `AuthContext` :** Il ne contiendra plus d'état.
4. **Refactorer `AuthWrapper` :** Il utilisera les nouveaux store et hook, et se concentrera sur l'orchestration des services et des effets de bord liés à l'authentification.

**Code pour `exemple.md` (Étape 6) :**

**Avant (Simplified `AuthWrapper.tsx`):**

```typescript
// exemple.md - Étape 6 : Avant application de DR015 (Simplified AuthWrapper.tsx)

import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { AuthContext, IAuthContext } from 'features/auth/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { api } from 'api/api';
import { QueryKeys } from 'libs/queryKeys';
import { getTokenStatus, computeTokenRemainingLifetimeInMs } from 'libs/jwt/jwt';
import { getRefreshToken, clearRefreshToken } from 'libs/keychain/keychain';
import { navigateFromRef } from 'features/navigation/navigationRef';
import { eventMonitoring } from 'libs/monitoring/services';
import { UserProfileResponseWithoutSurvey } from 'features/share/types';

const NAVIGATION_DELAY_FOR_EXPIRED_REFRESH_TOKEN_IN_MS = 1000;
const MAX_AVERAGE_SESSION_DURATION_IN_MS = 60 * 60 * 1000;

const navigateToLoginWithHelpMessage = () =>
  navigateFromRef('Login', { displayForcedLoginHelpMessage: true });

// Hook interne pour récupérer le profil utilisateur (déjà un useQuery)
const useUserProfileInfo = (isLoggedIn: boolean) => {
  return useQuery<UserProfileResponseWithoutSurvey>({
    queryKey: [QueryKeys.USER_PROFILE],
    queryFn: () => api.getNativeV1Me(),
    enabled: isLoggedIn, // Dépend de l'état isLoggedIn du Context
  });
};

export const AuthWrapper = memo(function AuthWrapper({ children }: { children: React.JSX.Element }) {
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const navigationTimeoutRef = useRef<NodeJS.Timeout>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // État client dans le Context

  const {
    data: user,
    refetch: refetchUser,
    isLoading: isUserLoading,
  } = useUserProfileInfo(isLoggedIn); // État serveur dans le Context

  const readTokenAndConnectUser = useCallback(async () => {
    try {
      const refreshToken = await getRefreshToken();
      const refreshTokenStatus = getTokenStatus(refreshToken);

      switch (refreshTokenStatus) {
        case 'expired':
          setIsLoggedIn(false);
          navigationTimeoutRef.current = setTimeout(async () => {
            navigateToLoginWithHelpMessage();
            await clearRefreshToken();
          }, NAVIGATION_DELAY_FOR_EXPIRED_REFRESH_TOKEN_IN_MS);
          return;
        case 'valid':
          setIsLoggedIn(true);
          // ... logique de gestion de timeout pour le refresh token
          return;
        default:
          setIsLoggedIn(false);
      }
    }
    catch (err) {
      eventMonitoring.captureException(err);
      setIsLoggedIn(false);
    }
    finally {
      setLoading(false);
    }
  }, []); // Dépendances simplifiées pour l'exemple

  useEffect(() => {
    readTokenAndConnectUser();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current);
    };
  }, [readTokenAndConnectUser]);

  const value: IAuthContext = useMemo(
    () => ({ isLoggedIn, setIsLoggedIn, user, refetchUser, isUserLoading }),
    [isLoggedIn, setIsLoggedIn, user, refetchUser, isUserLoading]
  );

  if (loading) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
});
```

**Après (Application de DR015) :**

```typescript
// exemple.md - Étape 6 : Après application de DR015

// Fichier : src/features/auth/store/useAuthStore.ts (Zustand Store pour l'état client)
import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
}));

// Fichier : src/features/auth/queries/useUserQuery.ts (React Query Hook pour l'état serveur)
import { useQuery, QueryObserverResult } from '@tanstack/react-query';
import { api } from 'api/api';
import { QueryKeys } from 'libs/queryKeys';
import { UserProfileResponseWithoutSurvey } from 'features/share/types';
import { useAuthStore } from '../store/useAuthStore'; // Utilise le store Zustand

export function useUserQuery(): QueryObserverResult<UserProfileResponseWithoutSurvey, unknown> {
  const { isLoggedIn } = useAuthStore(); // Dépend de l'état de connexion du store Zustand

  return useQuery<UserProfileResponseWithoutSurvey>({
    queryKey: [QueryKeys.USER_PROFILE],
    queryFn: () => api.getNativeV1Me(),
    enabled: isLoggedIn, // La query n'est activée que si l'utilisateur est connecté
    staleTime: 5 * 60 * 1000, // Exemple de staleTime
    meta: { persist: true },
  });
}

// Fichier : src/features/auth/context/AuthContext.ts (Simplifié - si encore nécessaire pour des services)
// Si aucun service n'est injecté, ce fichier et le Provider peuvent être supprimés.
// Pour l'exemple, nous le laissons vide pour montrer qu'il ne contient plus d'état.
import React from 'react';
export const AuthContext = React.createContext({}); // Contexte vide ou pour services

// Fichier : src/features/auth/context/AuthWrapper.tsx (Refactorisé)
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { AuthContext } from 'features/auth/context/AuthContext'; // Contexte simplifié
import { useAuthStore } from 'features/auth/store/useAuthStore'; // Import du store Zustand
import { useUserQuery } from 'features/auth/queries/useUserQuery'; // Import du hook React Query
import { getTokenStatus, computeTokenRemainingLifetimeInMs } from 'libs/jwt/jwt';
import { getRefreshToken, clearRefreshToken } from 'libs/keychain/keychain';
import { navigateFromRef } from 'features/navigation/navigationRef';
import { eventMonitoring } from 'libs/monitoring/services';

const NAVIGATION_DELAY_FOR_EXPIRED_REFRESH_TOKEN_IN_MS = 1000;
const MAX_AVERAGE_SESSION_DURATION_IN_MS = 60 * 60 * 1000;

const navigateToLoginWithHelpMessage = () =>
  navigateFromRef('Login', { displayForcedLoginHelpMessage: true });

export const AuthWrapper = memo(function AuthWrapper({ children }: { children: React.JSX.Element }) {
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const navigationTimeoutRef = useRef<NodeJS.Timeout>(null);
  const [loading, setLoading] = useState(true); // État de chargement initial du wrapper

  const { isLoggedIn, setIsLoggedIn } = useAuthStore(); // Utilisation du store Zustand
  const { data: user, refetch: refetchUser, isLoading: isUserLoading } = useUserQuery(); // Utilisation du hook React Query

  const readTokenAndConnectUser = useCallback(async () => {
    try {
      const refreshToken = await getRefreshToken();
      const refreshTokenStatus = getTokenStatus(refreshToken);

      switch (refreshTokenStatus) {
        case 'expired':
          setIsLoggedIn(false);
          navigationTimeoutRef.current = setTimeout(async () => {
            navigateToLoginWithHelpMessage();
            await clearRefreshToken();
          }, NAVIGATION_DELAY_FOR_EXPIRED_REFRESH_TOKEN_IN_MS);
          return;
        case 'valid':
          setIsLoggedIn(true);
          // ... logique de gestion de timeout pour le refresh token
          return;
        default:
          setIsLoggedIn(false);
      }
    }
    catch (err) {
      eventMonitoring.captureException(err);
      setIsLoggedIn(false);
    }
    finally {
      setLoading(false);
    }
  }, [setIsLoggedIn]); // Dépendances simplifiées pour l'exemple

  useEffect(() => {
    readTokenAndConnectUser();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current);
    };
  }, [readTokenAndConnectUser]);

  // Le AuthContext ne fournit plus d'état, seulement des services si nécessaire.
  // Pour cet exemple, il est vide.
  const value = useMemo(() => ({}), []);

  if (loading || isUserLoading) return null; // Attendre que le wrapper et le user soient chargés

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
});
```
