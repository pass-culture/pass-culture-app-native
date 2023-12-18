export const sanitizeTitle = (title?: string) => {
  const trimedTitle = title?.trim() ?? ''
  if (!trimedTitle) return ''
  const newTitle = trimedTitle[0].toUpperCase() + trimedTitle.slice(1)
  return newTitle
}
