# Application du Pattern Strangler Fig : Refactoring du module `GenericHome`

Ce document illustre l'application du pattern Strangler Fig (DR020) pour refactorer progressivement le module `GenericHome`, en s'assurant que la nouvelle architecture respecte les principes des ADRs 011 à 016 et 022.

---

## Étape 0 : Le module "mal fait" (Legacy)

Nous reprenons le module `GenericHome.tsx` tel qu'il est décrit dans `exemple.md` à l'Étape 0. C'est notre "stranglee" (le code à remplacer).

**Problèmes identifiés :**

- Mélange de l'état serveur et client (violation de DR011).
- Logique de pagination complexe directement dans le composant.
- Utilisation de `setInterval` pour la gestion du chargement, ce qui est impératif et difficile à maintenir.
- Logique métier et effets de bord non isolés (violations de DR012, DR013).
- UI, Logique et Navigation fortement couplées (violation de DR014).
- Manque de SRP (violation de DR022).

```typescript
// exemple-sf.md - Étape 0 : Le module "mal fait" (Legacy)

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

## Étape 1 : Mise en place du "Bridge" (ACL) et du Feature Flag

**Principe DR020 :** La transition se fait via un Anti-Corruption Layer (ACL) et est contrôlée par des feature flags.

**Action :** Nous allons créer un point d'entrée unique pour le module `GenericHome` qui, basé sur un feature flag, décidera d'utiliser l'ancienne ou la nouvelle implémentation.

```typescript
// exemple-sf.md - Étape 1 : Mise en place du Bridge et du Feature Flag

// Fichier : src/features/home/pages/GenericHome.tsx (Point d'entrée principal)

import React, { FunctionComponent } from 'react';
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'; // Supposons un hook pour les feature flags
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'; // Supposons les types de feature flags

// --- Imports du module Legacy (Étape 0) ---
import { OnlineHome as LegacyOnlineHome } from './GenericHomeLegacy'; // Renommé pour l'exemple
// --- Fin Imports du module Legacy ---

// --- Imports du futur module Moderne (sera créé progressivement) ---
import { OnlineHome as ModernOnlineHome } from './GenericHomeModern'; // Sera créé plus tard
// --- Fin Imports du futur module Moderne ---

type GenericHomeProps = {
  // ... props
}

export const GenericHome: FunctionComponent<GenericHomeProps> = (props) => {
  // Le feature flag contrôle quelle implémentation est utilisée
  const useModernHome = useFeatureFlag(RemoteStoreFeatureFlags.USE_MODERN_HOME_MODULE);

  if (useModernHome) {
    // Si le flag est activé, on utilise le nouveau module
    return <ModernOnlineHome {...props} />;
  } else {
    // Sinon, on continue d'utiliser l'ancien module
    return <LegacyOnlineHome {...props} />;
  }
};

// Le code de l'Étape 0 est déplacé dans GenericHomeLegacy.tsx
// Le code de GenericHomeModern.tsx est initialement vide ou une version minimale
```

---

## Étape 2 : Construction du "Strangler" (Nouveau module) - Application de DR011

**Principe DR011 :** Utiliser React Query pour l'état serveur et Zustand pour l'état client.

**Action :** Nous allons commencer à construire le `ModernOnlineHome` en appliquant DR011 pour gérer la pagination des modules avec `useInfiniteQuery`.

```typescript
// exemple-sf.md - Étape 2 : Construction du "Strangler" - Application de DR011

// Fichier : src/features/home/pages/GenericHomeModern.tsx (Nouveau module)

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
  modules: HomepageModule[];
  homeId: string;
  thematicHeader?: ThematicHeader;
}
type Offer = { id: string; title: string; };
type Venue = { id: string; name: string; };
type OffersModulesData = { data: Offer[] };
type VenuesModulesData = { venuesModulesData: { data: Venue[] } };

// Fonction pour simuler la récupération de modules par page
const fetchHomepageModules = async (pageParam = 0, allModules: HomepageModule[]): Promise<{ modules: HomepageModule[], nextPage: number | undefined }> => {
  const pageSize = 10;
  const start = pageParam * pageSize;
  const end = start + pageSize;
  const paginatedModules = allModules.slice(start, end);
  const nextPage = end < allModules.length ? pageParam + 1 : undefined;
  return { modules: paginatedModules, nextPage };
};
// --- Fin définitions simplifiées ---

export const OnlineHome: FunctionComponent<GenericHomeProps> = React.memo(function OnlineHome({ Header, HomeBanner, modules: initialModules, homeId, thematicHeader }) {
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

  const offersModulesData: OffersModulesData = { data: [] };
  const venuesModulesData: VenuesModulesData = { venuesModulesData: { data: [] } };

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
    return <Spinner />;
  }
  if (isError) {
    return <Text>Erreur de chargement des modules.</Text>;
  }

  const videoCarouselModules = enrichedModules.filter(isVideoCarouselModule);

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
    />
  );
});
```

---

## Étape 3 : Construction du "Strangler" - Application de DR012

**Principe DR012 :** Extraire la logique métier dans des fonctions pures.

**Action :** Extraire le calcul de `shouldDisplayVideoInHeader` dans une fonction pure.

```typescript
// exemple-sf.md - Étape 3 : Construction du "Strangler" - Application de DR012

// Fichier : src/features/home/helpers/shouldDisplayVideoCarouselInHeader.ts
import { HomepageModule, HomepageModuleType, ThematicHeader } from 'features/home/types';

export function shouldDisplayVideoCarouselInHeader(
  thematicHeader: ThematicHeader | undefined,
  enrichedModules: HomepageModule[]
): boolean {
  return !thematicHeader && enrichedModules[0]?.type === HomepageModuleType.VideoCarouselModule;
}

// Fichier : src/features/home/pages/GenericHomeModern.tsx (extrait)
import { shouldDisplayVideoCarouselInHeader } from 'features/home/helpers/shouldDisplayVideoCarouselInHeader'; // Import de la fonction pure

export const OnlineHome: FunctionComponent<GenericHomeProps> = React.memo(function OnlineHome({ Header, HomeBanner, modules: initialModules, homeId, thematicHeader }) {
  // ... (code précédent)

  const enrichedModules = useMemo(
    () => enrichModulesWithData(allFetchedModules, offersModulesData, venuesModulesData),
    [allFetchedModules, offersModulesData, venuesModulesData]
  );

  // Application de DR012 : Le calcul est maintenant dans une fonction pure
  const shouldDisplayVideoInHeader = useMemo(
    () => shouldDisplayVideoCarouselInHeader(thematicHeader, enrichedModules),
    [thematicHeader, enrichedModules]
  );

  const videoCarouselModules = enrichedModules.filter(isVideoCarouselModule);

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
      onScroll={scrollListenerToThrottle}
      ListFooterComponent={isFetchingNextPage ? <Spinner /> : null}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={ListHeader}
    />
  );
});
```

---

## Étape 4 : Construction du "Strangler" - Application de DR013

**Principe DR013 :** Isoler les effets de bord dans des hooks dédiés.

**Action :** Extraire la logique de tracking analytics dans un hook `useTrackAllModulesSeen`.

```typescript
// exemple-sf.md - Étape 4 : Construction du "Strangler" - Application de DR013

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

// Fichier : src/features/home/pages/GenericHomeModern.tsx (extrait)
import React, { FunctionComponent, useCallback, useMemo, useEffect } from 'react';
// ... autres imports
import { useTrackAllModulesSeen } from 'features/home/hooks/useTrackAllModulesSeen'; // Import du nouveau hook

export const OnlineHome: FunctionComponent<GenericHomeProps> = React.memo(function OnlineHome({ Header, HomeBanner, modules: initialModules, homeId, thematicHeader }) {
  // ... (code précédent)

  // Application de DR013 : Isolation des effets de bord d'analytics
  const trackAllModulesSeen = useTrackAllModulesSeen(homeId, thematicHeader, initialModules.length);

  const scrollListenerToThrottle = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isCloseToBottom({ ...event.nativeEvent, padding: screenHeight })) {
        handleLoadMore();
      }
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
    />
  );
});
```

---

## Étape 5 : Construction du "Strangler" - Application de DR014

**Principe DR014 :** Séparer l'UI (Vue), la Logique (ViewModel/Controller) et la Navigation.

**Action :** Extraire la logique dans un hook `useHomeViewModel` et créer un composant `HomeView` "bête" pour le rendu.

```typescript
// exemple-sf.md - Étape 5 : Construction du "Strangler" - Application de DR014

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

  const offersModulesData: OffersModulesData = { data: [] };
  const venuesModulesData: VenuesModulesData = { venuesModulesData: { data: [] } };

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
    />
  );
};

// Fichier : src/features/home/pages/GenericHomeModern.tsx (composant principal du nouveau module)
import React, { FunctionComponent } from 'react';
import { useHomeViewModel } from 'features/home/hooks/useHomeViewModel';
import { HomeView } from 'features/home/components/HomeView';

// ... (GenericHomeProps et autres types)

export const OnlineHome: FunctionComponent<GenericHomeProps> = React.memo(function OnlineHome(props) {
  const { Header, HomeBanner, modules, homeId, thematicHeader } = props;

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
```

---

## Étape 6 : Construction du "Strangler" - Application de DR022

**Principe DR022 :** Chaque composant, hook ou fonction doit avoir une unique et bien définie responsabilité.

**Action :** Extraire le `ListHeaderComponent` dans son propre composant `HomeListHeader`.

```typescript
// exemple-sf.md - Étape 6 : Construction du "Strangler" - Application de DR022

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
    />
  );
};

// Fichier : src/features/home/pages/GenericHomeModern.tsx (composant principal du nouveau module)
import React, { FunctionComponent } from 'react';
import { useHomeViewModel } from 'features/home/hooks/useHomeViewModel';
import { HomeView } from 'features/home/components/HomeView';

// ... (GenericHomeProps et autres types)

export const OnlineHome: FunctionComponent<GenericHomeProps> = React.memo(function OnlineHome(props) {
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
```

---

## Étape 7 : Construction du "Strangler" - Application de DR015

**Principe DR015 :** Context doit être utilisé pour l'injection de dépendances de services stables et mémoïsés, et non comme un store global pour l'état.

**Action :** Refactorer le module d'authentification pour respecter DR015.

```typescript
// exemple-sf.md - Étape 7 : Construction du "Strangler" - Application de DR015

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
import { useAuthStore } from '../store/useAuthStore';

export function useUserQuery(): QueryObserverResult<UserProfileResponseWithoutSurvey, unknown> {
  const { isLoggedIn } = useAuthStore();

  return useQuery<UserProfileResponseWithoutSurvey>({
    queryKey: [QueryKeys.USER_PROFILE],
    queryFn: () => api.getNativeV1Me(),
    enabled: isLoggedIn,
    staleTime: 5 * 60 * 1000,
    meta: { persist: true },
  });
}

// Fichier : src/features/auth/context/AuthContext.ts (Simplifié - ne contient plus d'état)
import React from 'react';
export const AuthContext = React.createContext({});

// Fichier : src/features/auth/context/AuthWrapper.tsx (Refactorisé)
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { AuthContext } from 'features/auth/context/AuthContext';
import { useAuthStore } from 'features/auth/store/useAuthStore';
import { useUserQuery } from 'features/auth/queries/useUserQuery';
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
  const [loading, setLoading] = useState(true);

  const { isLoggedIn, setIsLoggedIn } = useAuthStore();
  const { data: user, refetch: refetchUser, isLoading: isUserLoading } = useUserQuery();

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
  }, [setIsLoggedIn]);

  useEffect(() => {
    readTokenAndConnectUser();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current);
    };
  }, [readTokenAndConnectUser]);

  const value = useMemo(() => ({}), []); // AuthContext ne fournit plus d'état

  if (loading || isUserLoading) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
});
```

---

## Étape 8 : Construction du "Strangler" - Application de DR016

**Principe DR016 :** Toute logique métier complexe, orchestration de multiples appels API, ou traitement de données sensibles doit être portée par le backend.

**Action :** Identifier une logique métier complexe dans le frontend qui devrait être déplacée vers le backend. Pour l'exemple `GenericHome`, l'enrichissement des modules (`enrichModulesWithData`) pourrait être une logique qui, si elle devenait plus complexe, serait un bon candidat pour le backend.

```typescript
// exemple-sf.md - Étape 8 : Construction du "Strangler" - Application de DR016

// Fichier : src/features/home/helpers/enrichModulesWithData.ts (Avant DR016)
// Cette fonction est actuellement côté frontend.
export function enrichModulesWithData(
  modules: HomepageModule[],
  offersData: ModuleData[],
  venuesData: ModuleData[]
): HomepageModule[] {
  return modules.map((module) => {
    if (isOffersModule(module)) {
      return {
        ...module,
        data: offersData.find((mod) => mod.moduleId === module.id),
      };
    }
    if (isVenuesModule(module)) {
      return {
        ...module,
        data: venuesData.find((mod) => mod.moduleId === module.id),
      };
    }
    return module;
  });
}

// Fichier : src/features/home/queries/useHomepageModulesQuery.ts (Après DR016)
// Le backend fournit directement les modules enrichis.
import { useQuery } from '@tanstack/react-query';
import { api } from 'api/api';
import { QueryKeys } from 'libs/queryKeys';
import { HomepageModule } from 'features/home/types';

// Supposons que le backend expose un endpoint qui retourne les modules déjà enrichis
const fetchEnrichedHomepageModules = async (homeId: string): Promise<HomepageModule[]> => {
  return api.getNativeV1HomepageEnrichedModules(homeId); // Nouvel appel API
};

export function useHomepageModulesQuery(homeId: string) {
  return useQuery<HomepageModule[]>({n    queryKey: [QueryKeys.HOMEPAGE_MODULES, 'enriched', homeId],
    queryFn: () => fetchEnrichedHomepageModules(homeId),
  });
}

// Fichier : src/features/home/hooks/useHomeViewModel.ts (extrait après DR016)
// Le ViewModel utilise maintenant la query qui retourne des modules déjà enrichis.
import { useHomepageModulesQuery } from 'features/home/queries/useHomepageModulesQuery'; // Nouvelle query

export function useHomeViewModel(initialModules: HomepageModule[], homeId: string, thematicHeader: ThematicHeader | undefined, Header: React.JSX.Element, HomeBanner?: React.JSX.Element): HomeViewModel {
  // ... (logique précédente)

  // Plus besoin d'enrichir les modules côté client, le backend le fait.
  // allFetchedModules viendrait directement de useHomepageModulesQuery si elle était paginée.
  // Pour cet exemple, nous simplifions en supposant que useHomepageModulesQuery retourne la liste complète.
  const { data: enrichedModulesData, isLoading: isLoadingModules } = useHomepageModulesQuery(homeId);
  const enrichedModules = enrichedModulesData || [];

  // ... (le reste du ViewModel s'adapte pour utiliser enrichedModules)

  return {
    enrichedModules,
    // ...
  };
}
```

---

## Étape Finale : Suppression du code Legacy

Une fois que le feature flag `USE_MODERN_HOME_MODULE` est activé à 100% et que le nouveau module a prouvé sa stabilité, le code `GenericHomeLegacy.tsx` et toutes ses dépendances peuvent être supprimés.

```typescript
// exemple-sf.md - Étape Finale : Suppression du code Legacy

// Fichier : src/features/home/pages/GenericHome.tsx (Point d'entrée principal)

import React, { FunctionComponent } from 'react';
// Le feature flag n'est plus nécessaire si l'ancien code est supprimé
// import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag';
// import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types';

// --- Le module Legacy est supprimé ---
// import { OnlineHome as LegacyOnlineHome } from './GenericHomeLegacy';
// --- Fin suppression ---

import { OnlineHome as ModernOnlineHome } from './GenericHomeModern'; // Seul le nouveau module reste

type GenericHomeProps = {
  // ... props
}

export const GenericHome: FunctionComponent<GenericHomeProps> = (props) => {
  // On utilise directement le nouveau module
  return <ModernOnlineHome {...props} />;
};

// Le fichier GenericHomeLegacy.tsx est supprimé.
```
