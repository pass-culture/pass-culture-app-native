const allowedDomains = [
  'https://educonnect.education.gouv.fr',
  // environnement hors production
  'https://pr4.educonnect.phm.education.gouv.fr',
]

export const logoutFromEduConnectIfAllowed = (logoutUrl: string | undefined) => {
  if (logoutUrl && allowedDomains.find((domain) => new RegExp(`^${domain}`, 'i').test(logoutUrl))) {
    globalThis.window.open(logoutUrl)
  }
}
