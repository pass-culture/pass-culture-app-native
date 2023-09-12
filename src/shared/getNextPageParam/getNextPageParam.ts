// first page is 0
export const getNextPageParam = ({ page, nbPages }: { page: number; nbPages: number }) =>
  page + 1 < nbPages ? page + 1 : undefined
