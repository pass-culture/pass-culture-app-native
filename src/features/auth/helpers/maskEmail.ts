export const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split('@')

  if (!localPart || !domain) throw new Error('Adresse email invalide')

  const length = localPart.length

  if (length <= 4) return `${localPart.slice(0, 1)}***@${domain}`
  if (length === 5) return `${localPart.slice(0, 2)}***@${domain}`
  return `${localPart.slice(0, 3)}${'*'.repeat(length - 3)}@${domain}`
}
