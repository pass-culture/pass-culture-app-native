import { Text } from 'react-native'

export const EuropeanPlaylist = (offers) => {
  fetchEuroOffers().then((europeanOffers) => console.log('europeanOffers', europeanOffers))
  return <Text>Find me</Text>
}
