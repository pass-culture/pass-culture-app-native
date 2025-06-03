CategoriesModal
 should close the modal
- when pressing the search button
- when pressing previous button


 With categories view
- should render correctly
- should display arrows
- should show all categories
- should not show categories when the backend returns no category
- should show only categories exisiting in categories return from backend
- should set the selected category filter when search button is pressed and a category was already set
- should set the selected category filter when search button is pressed and no category was already set
- should select default filter when pressing the reset button


 When wipDisplaySearchNbFacetResults feature flag is activated
- should display number of results on each category


 When wipDisplaySearchNbFacetResults feature flag is not activated
- should not display number of results on each category


 With native categories view
- should render native categories
- should go back to categories view
- should set search state when search button is pressed
- should remove offerNativeCategories filter when none is set
- should reset filters and come back on categories view
- should execute search when pressing reset button


 new book native categories section
- should display the new book native categories section
- should go back to native categories view
- should set search state when search button is pressed
- should remove offerGenreTypes filter when none is set
- should reset filters and come back on categories view
- should keep initial parameters when pressing close button
- should filter on category, native category and genre/type then only on category with all native categories


 with "Appliquer le filtre" button
- should display alternative button title
- should update search state when pressing submit button


 Modal header buttons
- should display back button on header when the modal is opening from general filter page
- should close the modal and general filter page when pressing close button when the modal is opening from general filter page
- should only close the modal when pressing close button when the modal is opening from search results


 <CategoriesModal/>

