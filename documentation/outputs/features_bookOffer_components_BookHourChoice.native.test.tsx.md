BookHourChoice
 BookHourChoice when hour is already selected
- should change step to Hour


 BookHourChoice
- should display filtered stocks for selected Date
- should select an item when pressed
- should pass formatted hour and price props
- should show 'crédit insuffisant' if not enough credit


 BookHourChoice when there are several stocks
- should render only one hour choice with "dès" and the minimum price available when has several prices for an hour
- should render only one hour choice without "dès" and the minimum price when has only one price for an hour
- should display hour items with stock selection
- should not display hour item with stock selection
- should display "épuisé" when there are not stock bookable on hour item
- should set the hour selected when pressing hour item
- should set the stock selected when pressing hour item and there is only one stock
- should not set the stock selected when pressing hour item and there are several stock
- should set the quantity at 1 when pressing hour item and offer is not duo
- should not set the quantity at 1 when pressing hour item and offer is duo


 BookHourChoice when there is only one stock
- should render only one hour choice with the minimum price
- should display hour item with stock selection
- should not display hour item without stock selection
- should select the stock when pressing an hour item
- should display "épuisé" when there are not stock bookable on hour item

