export const FIRST_PRO_ADVICES_PAGE = 1
export const PRO_ADVICES_RESULTS_PER_PAGE = 10

type ProAdvicesPage = {
  nbResults: number
  proAdvices: unknown[]
}

export const getNextProAdvicesPageParam = (
  lastPage: ProAdvicesPage,
  allPages: ProAdvicesPage[]
) => {
  const nbLoadedResults = allPages.reduce(
    (nbResults, page) => nbResults + page.proAdvices.length,
    0
  )

  if (lastPage.proAdvices.length === 0 || nbLoadedResults >= lastPage.nbResults) {
    return undefined
  }

  return FIRST_PRO_ADVICES_PAGE + allPages.length
}
