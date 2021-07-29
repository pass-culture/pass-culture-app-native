import { VenueResponse } from 'api/gen'

export const venueResponseSnap: VenueResponse = {
  id: 5543,
  name: 'Le Petit Rintintin 1',
  latitude: 48.87004,
  longitude: 2.3785,
  city: 'Paris',
  publicName: 'Le Petit Rintintin 1',
  isVirtual: false,
  isPermanent: true,
  withdrawalDetails: 'How to withdraw, https://test.com',
  address: '1 boulevard Poissonnière',
  postalCode: '75000',
}

export const venueWithNoAddressResponseSnap: VenueResponse = {
  id: 5454,
  name: 'Le Petit Rintintin 3',
  latitude: 41.82004,
  longitude: 12.3785,
  city: 'Milan',
  publicName: 'Le Petit Rintintin 3',
  isVirtual: false,
  isPermanent: true,
  withdrawalDetails: null,
  postalCode: '15000',
}
