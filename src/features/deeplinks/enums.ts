export enum DeeplinkPath {
  DEFAULT = 'default',
  FAVORIS = 'favoris',
  FORGOTTEN_PASSWORD = 'mot-de-passe-perdu',
  HOME = 'home',
  LOGIN = 'login',
  NEXT_BENEFECIARY_STEP = 'id-check',
  OFFER = 'offre/:id',
  PROFILE = 'profil',
  SEARCH = 'recherche',
  SET_EMAIL = 'set-email',
  SIGNUP_CONFIRMATION = 'signup-confirmation',
  VENUE = 'venue/:id',
}

type PathWithPlaceholder = DeeplinkPath.OFFER | DeeplinkPath.VENUE

export class DeeplinkPathWithPathParams {
  pathWithPlaceholder: PathWithPlaceholder
  params: Record<string, string>

  constructor(pathWithPlaceholder: PathWithPlaceholder, params: Record<string, string>) {
    this.pathWithPlaceholder = pathWithPlaceholder
    this.params = params
  }

  getPathWithPlaceholder() {
    return this.pathWithPlaceholder
  }
  getFullPath() {
    let fullPath = this.pathWithPlaceholder as string
    for (const [name, value] of Object.entries(this.params)) {
      fullPath = fullPath.replace(`:${name}`, value)
    }
    return fullPath
  }
}
