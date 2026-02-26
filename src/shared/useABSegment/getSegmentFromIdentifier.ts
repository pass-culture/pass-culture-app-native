export const getSegmentFromIdentifier = <T>(segments: T[], identifier?: number | string) => {
  if (!identifier || segments.length === 0) {
    return
  }

  let total = 0

  if (typeof identifier === 'number') {
    total = identifier
  } else {
    // Add the value of EACH letter of the identifier
    for (let i = 0; i < identifier.length; i++) {
      total += identifier.codePointAt(i) ?? 0
    }
  }

  // Math.abs guarantees that the index is always positive
  const index = Math.abs(total) % segments.length
  return segments[index]
}
