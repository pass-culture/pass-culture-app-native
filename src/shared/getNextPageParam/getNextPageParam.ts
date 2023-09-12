// first page is 0
export const getNextPageParam = ({ nbPages, page }: { nbPages: number; page: number }) =>
  page + 1 < nbPages ? page + 1 : undefined
