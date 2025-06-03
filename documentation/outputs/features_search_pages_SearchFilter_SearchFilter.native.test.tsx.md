SearchFilter
 should update the SearchState, but keep the query, when pressing the reset button, and position
- is not null
- is null


 <SearchFilter/>
- should render correctly
- should reset search when pressing reset button and use back button
- should setLocationMode to AROUND-ME in location context, when URI params contains AROUND-ME, and user has a geolocposition
- shouldn't setLocationMode to AROUND-ME in location context, when URI params contains AROUND-ME, and user has no geolocposition
- should log analytics when clicking on the reset button
- should display back button on header
- should display accessibility section
- should display date and hour section when wipTimeFilterV2 FF deactivated
- should display calendar section when wipTimeFilterV2 FF activated

