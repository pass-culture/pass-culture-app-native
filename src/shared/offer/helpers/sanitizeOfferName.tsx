export const sanitizeOfferName = (name: string) => {
  const trimedName = name.trim() ?? ''
  const newName = trimedName[0].toUpperCase() + trimedName.slice(1)
  return newName
}
