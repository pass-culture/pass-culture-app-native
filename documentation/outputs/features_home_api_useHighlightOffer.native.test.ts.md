useHighlightOffer
 geolocation
- should return offer when isGeolocated is true and the distance to the offer is within the radius
- should not return offer when isGeolocated is true and the distance to the offer is beyond radius
- should not return offer when isGeolocated is true and the user position is not defined
- should return offer when isGeolocated is true and around radius is not defined


 useHighlightOffer
- should return offer when offerId is provided
- should return offer when offerTag is provided
- should return offer when offerEan is provided
- should return undefined when no offer id or tag or ean is provided

