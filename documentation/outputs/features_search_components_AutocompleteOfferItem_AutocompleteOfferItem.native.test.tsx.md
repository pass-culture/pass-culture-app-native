AutocompleteOfferItem
 when a category is specified
- should display a suggested native category if it is relevant
- should display the search group if it is irrelevant
- should redirect to the specified category page


 when item is not in the first three suggestions
- should execute a search with the query suggestion on hit click
- should not display the most popular native category of the query suggestion
- should not execute the search with the category, native category and genre of the previous search on hit click


 most popular category
- should be sorted by the higher count


 should execute a search with the query suggestion and
- its most popular native category when it associated to only one category on hit click
- its most popular native category is associated to several categories and is associated to the most popular category
- its most popular category when native category associated to several categories and not associated to the most popular category
- the most popular category when the suggestion has not native category
- without the most popular category and native category when there are unknown in the app
- without the most popular category when it is unknown in the app
- without the most popular native category but the most popular category when native category is unknown in the app


 should display the most popular native category of the query suggestion
- when it associated to only one category
- when it associated to the most popular category


 should not display the most popular category or native category of the query suggestion
- when it does not return by Algolia
- when there are unknown in the app


 should not display the most popular native category of the query suggestion
- when it is not associated to the most popular category
- when it is unknown in the app


 should not display the most popular category of the query suggestion
- when native category associated to only one category
- when native category associated to the most popular category
- when category is unknown in the app


 should display the most popular category of the query suggestion when
- is not associated to the most popular category
- has not native category associated to the suggestion
- native category is unknown in the app
- native category is Livres Papier


 when item is in the first three suggestions
- should not display category suggestion when not native category suggested and searchGroup is unavailable
- should display native category suggestion on search landing


 AutocompleteOfferItem component
- should not display `CINEMA` searchGroup
- should create a suggestion clicked event when pressing a hit

