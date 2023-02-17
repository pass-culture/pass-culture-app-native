export function isPhoneNumberValid(number: string) {
  // 9 digits, 10 if the first is a "0" that can be separated by whitespace, "." or "-".
  return Boolean(number.match(/^(?:0)?\s*[1-9](?:[\s.-]*\d{2}){4}$/))
}
