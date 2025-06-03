PriceModal
 without previous value in the search state
- should reset minimum price when pressing reset button
- should reset maximum price when pressing reset button
- should reset limit credit search toggle when pressing reset button
- should reset only free offers search toggle when pressing reset button


 with previous value in the search state
- should reset minimum price when pressing reset button
- should call dispatch with default search when pressing reset button
- should preserve minimum price when closing the modal
- should reset maximum price when pressing reset button
- should preserve maximum price when closing the modal
- should reset limit credit search toggle when pressing reset button
- should preserve limit credit search toggle when closing the modal
- should reset only free offers search toggle when pressing reset button
- should preserve only free offers search toggle when closing the modal


 should close the modal
- when pressing the search button
- when pressing previous button


 when user is not logged in
- should not display limit credit search toggle
- should not display credit banner
- should display the credit given to 18 year olds in maximum price input placeholder
- should display the credit given to 18 year olds in right label maximum price input


 when user is not a beneficiary
- should not display limit credit search toggle
- should not display credit banner
- should display the credit given to 18 year olds in maximum price input placeholder
- should display the credit given to 18 year olds in right label maximum price input


 with "Appliquer le filtre" button
- should display alternative button title
- should update search state when pressing submit button


 should set search state view on results
- when pressing button with minimum and maximum prices entered
- when pressing button with minimum and maximum prices entered at 0
- when pressing button with only free offers search toggle activated
- with only free offers when pressing button with only free offers search toggle desactivated and only maximum price entered at 0
- with only a minimum price


 with "Rechercher" button


 Modal header buttons
- should close the modal and general filter page when pressing close button when the modal is opening from general filter page
- should only close the modal when pressing close button when the modal is opening from search results


 <PriceModal/>
- should render modal correctly after animation and with enabled submit
- should update the maximum price when activate limit credit search toggle
- should disable the maximum price input when activate limit credit search toggle
- should reset the maximum price when desactivate limit credit search toggle and no max price entered in the current search
- should reset the maximum price when desactivate limit credit search toggle if max price entered in the current search is the available credit
- should update the maximum price by the max price entered in the current search if different from avaiable credit when desactivate limit credit search toggle
- should desactivate limit credit search toggle when only free offers search toggle activated
- should desactivate only free offers search toggle when limit credit search toggle activated
- should update the minimum price by 0 when pressing only free offers search toggle
- should update the minimum price by empty value when desactivate only free offers search toggle if minimum price in the current search is 0
- should update the minimum price by minimum price in the current search when desactivate only free offers search toggle if minimum price in the current search is not 0
- should update the maximum price by empty value when desactivate only free offers search toggle if maximum price in the current search is 0
- should update the maximum price by maximum price in the current search when desactivate only free offers search toggle if maximum price in the current search is not 0
- should disable the minimum price input when pressing only free offers search toggle
- should update the maximum price by 0 when pressing only free offers search toggle
- should disable the maximum price input when pressing only free offers search toggle
- should display credit banner with remaining credit of the user
- should display an error when the expected format of minimum price is incorrect
- should display an error when the expected format of maximum price is incorrect
- should display the initial credit in maximum price input placeholder
- should display the initial credit in right label maximum price input
- should hide minPrice error when onlyFreeOffers is pressed
- should hide maxPrice error when onlyFreeOffers is pressed
- should hide maxPrice error when limitCreditSearch is pressed

