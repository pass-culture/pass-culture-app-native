import { useRoute } from '@react-navigation/native'
import algoliasearch from 'algoliasearch'
import React, { useEffect, useState } from 'react'
import { InstantSearch } from 'react-instantsearch-hooks'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useAppSettings } from 'features/auth/settings'
import { UseRouteType } from 'features/navigation/RootNavigator'
import { CategoriesButtons } from 'features/search/components/CategoriesButtons'
import { SearchDetails } from 'features/search/components/SearchDetails'
import { SearchHeaderRework } from 'features/search/components/SearchHeaderRework'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { useShowResults } from 'features/search/pages/useShowResults'
import { useShowResultsForCategory } from 'features/search/pages/useShowResultsForCategory'
import { env } from 'libs/environment'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { Form } from 'ui/web/form/Form'

const searchClient = algoliasearch(env.ALGOLIA_APPLICATION_ID, env.ALGOLIA_SEARCH_API_KEY)

export function SearchRework() {
  const { params } = useRoute<UseRouteType<'Search'>>()
  const { dispatch } = useSearch()
  const showResults = useShowResults()
  const searchInputID = uuidv4()
  const offersIndex = env.ALGOLIA_OFFERS_INDEX_NAME
  const { data: appSettings } = useAppSettings()
  const appEnableAutocomplete = appSettings?.appEnableAutocomplete ?? false
  const [isShowAutocomplete, isSetShowAutocomplete] = useState(false)
  const [autocompleteValue, setAutocompleteValue] = useState<string>('')
  const showResultsForCategory = useShowResultsForCategory()

  useEffect(() => {
    if (params) {
      dispatch({ type: 'SET_STATE_FROM_NAVIGATE', payload: params })
      dispatch({ type: 'SHOW_RESULTS', payload: true })
    }
  }, [dispatch, params])

  const bodySearch = () => {
    // SearchDetails will integrate recent searches and suggestions
    if (showResults || isShowAutocomplete)
      return (
        <SearchDetails
          isShowAutocomplete={isShowAutocomplete}
          appEnableAutocomplete={appEnableAutocomplete}
          isSetShowAutocomplete={isSetShowAutocomplete}
        />
      )
    const categoriesTitle = 'Explore les catégories'
    return (
      <Categories>
        <CategoriesTitle>{categoriesTitle}</CategoriesTitle>
        <CategoriesButtons onPressCategory={showResultsForCategory} />
        <Spacer.TabBar />
      </Categories>
    )
  }

  return (
    <Container>
      <Form.Flex>
        {appEnableAutocomplete ? (
          <InstantSearch searchClient={searchClient} indexName={offersIndex}>
            <SearchHeaderRework
              searchInputID={searchInputID}
              appEnableAutocomplete={appEnableAutocomplete}
              isShowAutocomplete={isShowAutocomplete}
              isSetShowAutocomplete={isSetShowAutocomplete}
              setAutocompleteValue={setAutocompleteValue}
              autocompleteValue={autocompleteValue}
            />
            {bodySearch()}
          </InstantSearch>
        ) : (
          <React.Fragment>
            <SearchHeaderRework
              searchInputID={searchInputID}
              appEnableAutocomplete={appEnableAutocomplete}
              isShowAutocomplete={isShowAutocomplete}
              isSetShowAutocomplete={isSetShowAutocomplete}
              setAutocompleteValue={setAutocompleteValue}
              autocompleteValue={autocompleteValue}
            />
            {bodySearch()}
          </React.Fragment>
        )}
      </Form.Flex>
    </Container>
  )
}

const Container = styled.View({ flex: 1 })

const Categories = styled.ScrollView({
  flex: 1,
  paddingTop: getSpacing(11),
  paddingBottom: getSpacing(6),
  paddingHorizontal: getSpacing(5),
})

const CategoriesTitle = styled(Typo.Title4)({
  paddingHorizontal: getSpacing(1),
  paddingBottom: getSpacing(4),
})
