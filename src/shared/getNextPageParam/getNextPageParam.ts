// first page is 0
export const getNextPageParam = ({ page = 0, nbPages = 0 }: { page?: number; nbPages?: number }) =>
  page + 1 < nbPages ? page + 1 : undefined
