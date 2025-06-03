bookingHelpers
 should return false
- when step is date selection & date not selected
- when step is hour selection & hour & stock not selected
- when step is price selection & stock not selected
- when step is quantity selection & quantity not selected


 when step is hour selection
- & hour selected
- & stock selected
- & hour & stock selected


 should return true
- when step is date selection & date selected
- when step is price selection & stock selected
- when step is quantity selection & quantity selected


 getButtonState


 getButtonWording
- should return "Valider la date" when step is date selection
- should return "Valider lʼhoraire" when step is hour selection
- should return "Valider le prix" when step is price selection
- should return "Finaliser ma réservation" when step is quantity selection
- should return an empty string when step is confirmation


 getHourWording
- should return "crédit insuffisant" when user has not enough credit
- should return "dès 20 €" when offer is bookable, its price is 20 and has several prices
- should return "20 €" when offer is bookable, its price is 20 and has not several prices
- should return "épuisé" when offer is not bookable


 bookingHelpers


 getPriceWording
- should return "Épuisé" when stock is sold out
- should return "Crédit insuffisant" when offer price > user credit
- should return an empty string when stock is not sold out


 should return to hour step
- when current step is price
- when current step is duo and has not several stock
- when current step is confirmation, offer is not duo and has not several stock


 should return to price step
- when current step is duo and has several stocks
- when current step is confirmation, offer is not duo and has several stocks


 getPreviousStep
- should return to date step when current step is hour
- should return to duo step when current step is confirmation and offer is duo


 getSortedHoursFromDate
- should return an array of sorted hours from date


 getStockSortedByPriceFromHour
- should return an array of stocks from highest to lowest price from hour


 sortByDateStringPredicate
- should return -1 when dates not defined


 getDistinctPricesFromAllStock
- should return only one price when several stocks have the same price
- should not return several prices when several stocks have the same price


 getStockWithCategory
- should return an empty array when stock not defined
- should return all stock with category when stock defined and hour and date not defined
- should return stock with category from hour when stock, hour and date defined
- should return stock with category from date when stock and date defined and hour not defined

