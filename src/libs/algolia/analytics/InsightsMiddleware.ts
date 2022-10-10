import { createInsightsMiddleware } from 'instantsearch.js/es/middlewares'
import { useLayoutEffect } from 'react'
import { useInstantSearch } from 'react-instantsearch-hooks'
import AlgoliaSearchInsights from 'search-insights'

// Code sample from: https://www.algolia.com/doc/guides/building-search-ui/going-further/send-insights-events/react-hooks/#connecting-instantsearch-with-the-insights-middleware
// Usage example: https://www.algolia.com/doc/api-reference/widgets/middleware/react-hooks/#examples
export const InsightsMiddleware = () => {
  const { use } = useInstantSearch()

  useLayoutEffect(() => {
    const middleware = createInsightsMiddleware({
      insightsClient: AlgoliaSearchInsights,
    })

    return use(middleware)
  }, [use])

  return null
}
