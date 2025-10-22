
/* eslint-disable */
// @ts-nocheck
// prettier-ignore
// doc/strangler-fig-pattern-example/libs/tanstack/react-query.ts

import React from 'react';

// Mock très simplifié de useInfiniteQuery pour l'exemple
export const useInfiniteQuery = ({ queryKey, queryFn, getNextPageParam, initialPageParam }) => {
  const [pageParam, setPageParam] = React.useState(initialPageParam);
  const [data, setData] = React.useState({ pages: [], pageParams: [] });
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = React.useState(false);
  const [hasNextPage, setHasNextPage] = React.useState(true);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await queryFn({ pageParam });
        setData(prev => ({
          pages: [...prev.pages, result],
          pageParams: [...prev.pageParams, pageParam]
        }));
        setHasNextPage(getNextPageParam(result) !== undefined);
      } catch (e) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [queryKey[0], pageParam]); // Dépendance simplifiée

  const fetchNextPage = () => {
    if (hasNextPage) {
      setIsFetchingNextPage(true);
      const nextPageParam = getNextPageParam(data.pages[data.pages.length - 1]);
      setPageParam(nextPageParam);
      setIsFetchingNextPage(false);
    }
  };

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  };
};
