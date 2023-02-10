export const TEST_HTML = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <title>pass Culture</title>
    <meta name="title" content="pass Culture"/>
    <meta name="description"
          content="Dispositif porté par le ministère de la Culture, a pour but de faciliter l’accès des jeunes de 18 ans à la culture en leur offrant un crédit de 300€ à dépenser sur l’application pass Culture."/>
    <meta name="author" content="pass Culture"/>
    <meta property="og:type" content="website"/>
    <meta property="og:url" content="https://app.testing.passculture.team"/>
    <meta property="og:title" content="pass Culture"/>
    <meta property="og:description"
          content="Dispositif porté par le ministère de la Culture, a pour but de faciliter l’accès des jeunes de 18 ans à la culture en leur offrant un crédit de 300€ à dépenser sur l’application pass Culture."/>
    <meta property="og:image" content="https://app.testing.passculture.team/images/app-icon-512px.png"/>
    <meta property="og:image:alt" content="pass Culture"/>
    <meta property="og:locale" content="fr_FR"/>
    <meta property="og:site_name" content="pass Culture"/>
    <meta name="twitter:card" content="app"/>
    <meta name="twitter:url" content="https://app.testing.passculture.team"/>
    <meta name="twitter:title" content="pass Culture"/>
    <meta name="twitter:description"
          content="Dispositif porté par le ministère de la Culture, a pour but de faciliter l’accès des jeunes de 18 ans à la culture en leur offrant un crédit de 300€ à dépenser sur l’application pass Culture."/>
    <meta name="twitter:image" content="https://app.testing.passculture.team/images/app-icon-512px.png"/>
    <meta name="twitter:image:alt" content="pass Culture"/>
    <meta name="twitter:site" content="@pass_Culture"/>
    <meta name="twitter:app:country" content="FR"/>
    <meta name="twitter:app:name:iphone" content="pass Culture"/>
    <meta name="twitter:app:id:iphone" content="1557887412"/>
    <meta name="twitter:app:url:iphone" content="passculture://https://app.testing.passculture.team"/>
    <meta name="twitter:app:name:ipad" content="pass Culture"/>
    <meta name="twitter:app:id:ipad" content="1557887412"/>
    <meta name="twitter:app:url:ipad" content="passculture://https://app.testing.passculture.team"/>
    <meta name="twitter:app:name:googleplay" content="pass Culture"/>
    <meta name="twitter:app:id:googleplay" content="app.passculture.testing"/>
    <meta name="twitter:app:url:googleplay" content="passculture://https://app.testing.passculture.team"/>
    <meta property="al:ios:app_name" content="pass Culture"/>
    <meta property="al:ios:app_store_id" content="1557887412"/>
    <meta property="al:ios:url" content="passculture://https://app.testing.passculture.team"/>
    <meta property="al:android:url" content="passculture://https://app.testing.passculture.team">
    <meta property="al:android:app_name" content="pass Culture"/>
    <meta property="al:android:package" content="app.passculture.testing"/>
  </head>
  <body>
    <p>Hello world</p>
  </body>
</html>`

export const OFFER_RESPONSE_SNAPSHOT = {
  id: 116656,
  accessibility: {
    audioDisability: true,
    mentalDisability: true,
    motorDisability: false,
    visualDisability: false,
  },
  description:
    '<img src="data:image/gif;base64 onerror="javascript:alert("hack")" />Depuis de nombreuses années, Christine vit sous un pont, isolée de toute famille et amis. Par une nuit comme il n’en existe que dans les contes, un jeune garçon de 8 ans fait irruption devant son abri. Suli ne parle pas français, il est perdu, séparé de sa mère…\nTous les détails du film sur AlloCiné: https://www.allocine.fr/film/fichefilm_gen_cfilm=199293.html',
  expenseDomains: ['all'],
  isDigital: false,
  isDuo: true,
  isEducational: false,
  name: '<img src="data:image/gif;base64 onerror="javascript:alert("hack")" />Sous les étoiles de Paris - VF',
  subcategoryId: 'CINE_PLEIN_AIR',
  isReleased: true,
  isExpired: false,
  isForbiddenToUnderage: false,
  isSoldOut: false,
  stocks: [
    {
      id: 118929,
      beginningDatetime: '2021-01-04T13:30:00',
      price: 500,
      isBookable: true,
      isExpired: false,
      isForbiddenToUnderage: false,
      isSoldOut: false,
    },
    {
      id: 118928,
      beginningDatetime: '2021-01-03T18:00:00',
      price: 500,
      isBookable: true,
      isExpired: false,
      isForbiddenToUnderage: false,
      isSoldOut: false,
    },
  ],
  image: {
    url: 'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/products/CHSYS',
    credit: 'Author: photo credit author',
  },
  venue: {
    id: 1664,
    address: '2 RUE LAMENNAIS',
    city: 'PARIS 8',
    offerer: { name: 'PATHE BEAUGRENELLE' },
    name: 'PATHE BEAUGRENELLE',
    postalCode: '75008',
    publicName: 'PATHE BEAUGRENELLE',
    coordinates: { latitude: 20, longitude: 2 },
    isPermanent: true,
  },
  withdrawalDetails: 'How to withdraw, https://test.com',
}

export const VENUE_WITH_BANNER_RESPONSE_SNAPSHOT = {
  id: 5543,
  name: '<img src="data:image/gif;base64 onerror="javascript:alert("hack")" />Le Petit Rintintin 1',
  latitude: 48.87004,
  longitude: 2.3785,
  city: 'Paris',
  publicName:
    '<img src="data:image/gif;base64 onerror="javascript:alert("hack")" />Le Petit Rintintin 1',
  isVirtual: false,
  isPermanent: true,
  withdrawalDetails: 'How to withdraw, https://test.com',
  address: '1 boulevard Poissonnière',
  postalCode: '75000',
  bannerMeta: {
    image_credit: 'https://image.png',
  },
  description:
    '<img src="data:image/gif;base64 onerror="javascript:alert("hack")" />https://pass.culture.fr/ lorem ipsum consectetur adipisicing elit. Debitis officiis maiores quia unde, hic quisquam odit ea quo ipsam possimus, labore nesciunt numquam. Id itaque in sed sapiente blanditiis necessitatibus. consectetur adipisicing elit. Debitis officiis maiores quia unde, hic quisquam odit ea quo ipsam possimus, consectetur adipisicing elit. Debitis officiis maiores quia unde, hic quisquam odit ea quo ipsam possimus,',
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
export const VENUE_WITHOUT_BANNER_RESPONSE_SNAPSHOT = {
  id: 5544,
  name: 'Le Petit Rondoudou 2',
  latitude: 48.77004,
  longitude: 2.2785,
  city: 'Paris',
  isVirtual: false,
  isPermanent: true,
  withdrawalDetails: 'How to withdraw, https://test.com',
  address: '1 boulevard pasteur',
  postalCode: '75000',
  description:
    'https://pass.culture.fr/ lorem ipsum consectetur adipisicing elit. Debitis officiis maiores quia unde, hic quisquam odit ea quo ipsam possimus, labore nesciunt numquam. Id itaque in sed sapiente blanditiis necessitatibus. consectetur adipisicing elit. Debitis officiis maiores quia unde, hic quisquam odit ea quo ipsam possimus, consectetur adipisicing elit. Debitis officiis maiores quia unde, hic quisquam odit ea quo ipsam possimus,',
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
