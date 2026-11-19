output.links = {
  staging: {
    home: 'passculturestaging://accueil?from=deeplink&utm_gen=marketing',
    profile: 'passculturestaging://profil?from=deeplink&utm_gen=marketing',
    thematicSearch:
      'passculturestaging://recherche/thematique?from=deeplink&offerCategories=%5B%22CINEMA%22%5D&utm_gen=marketing',
    favorites: 'passculturestaging://favoris?from=deeplink&utm_gen=marketing',
    // Same home in both environments: the testing and staging builds both read the "testing" Contentful environment
    thematicHome: 'passculturestaging://accueil-thematique?homeId=3S4UGnN2tfPIV1ANpdUYs6&from=deeplink',
  },
  testing: {
    home: 'passculturetesting://accueil?from=deeplink&utm_gen=marketing',
    profile: 'passculturetesting://profil?from=deeplink&utm_gen=marketing',
    thematicHome: 'passculturetesting://accueil-thematique?homeId=3S4UGnN2tfPIV1ANpdUYs6&from=deeplink',
  },
}
