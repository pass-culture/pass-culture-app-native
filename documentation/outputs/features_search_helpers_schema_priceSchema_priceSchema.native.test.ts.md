priceSchema
 should fail
- when maxPrice exceeds initialCredit
- when maxPrice exceeds initialCredit with other currency
- when minPrice is greater than maxPrice
- when maxPrice has an invalid format
- when minPrice has an invalid format


 should validate
- when minPrice and maxPrice are within range
- when maxPrice is empty and minPrice is within range
- when both minPrice and maxPrice are empty


 priceSchema
- should validate correctly when minPrice and maxPrice are within range
- should invalidate when maxPrice exceeds initialCredit
- should invalidate when minPrice is greater than maxPrice
- should validate when maxPrice is empty and minPrice is within range
- should invalidate when minPrice has incorrect format
- should invalidate when maxPrice has incorrect format

