import { VenueResponse, VenueTypeCodeKey } from 'api/gen'

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
  venueTypeCode: VenueTypeCodeKey.BOOKSTORE,
  address: '1 boulevard Poissonnière',
  postalCode: '75000',
  description:
    ' https://pass.culture.fr/ lorem ipsum consectetur adipisicing elit. Debitis officiis maiores quia unde, hic quisquam odit ea quo ipsam possimus, labore nesciunt numquam. Id itaque in sed sapiente blanditiis necessitatibus. consectetur adipisicing elit. Debitis officiis maiores quia unde, hic quisquam odit ea quo ipsam possimus, consectetur adipisicing elit. Debitis officiis maiores quia unde, hic quisquam odit ea quo ipsam possimus,',
  accessibility: {
    audioDisability: false,
    mentalDisability: false,
    motorDisability: false,
    visualDisability: true,
  },
  contact: {
    email: 'contact@venue.com',
    phoneNumber: '+33102030405',
    website: 'https://my@website.com',
  },
}
