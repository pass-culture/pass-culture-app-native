// See https://github.com/Slashgear/action-check-pr-title/blob/main/src/run.js#L17

const REGEX = new RegExp(
  /^(\((PC-[0-9]+|BSR)\) )?(build|ci|docs|feat|fix|perf|refactor|test|chore)\(\w+\): \w+/i
)

const invalidPullRequestTitles: string[] = [
  '(PC-1234) tech(home): add color to button', // invalid type
  '(PC-1234) add color to button', // no scope nor type
  '(PC-1234) feat: add color to button', // no scope
  'feat: add color to button [PC-1234]', // jira ticket at the end
  '[PC-1234] feat(home): add color to button', // crochet instead of parentheses
  'PC-1234 feat(home): add color to button', // no parentheses
  '(BSR): add a lib', //no scope nor type
  '(BSR)chore(lib): add a lib', //no space between BSR and scope
]

const validPullRequestTitles: string[] = [
  '(PC-1234) feat(home): add color to button',
  'feat(home): add color to button', // jira ticket is optional, although better to have it
  '(BSR) chore(lib): update lib version',
]

describe('pr-title-checker', () => {
  it.each(invalidPullRequestTitles)('should not allow invalid PR titles: "%s"', (title) => {
    expect(REGEX.test(title)).toBeFalsy()
  })

  it.each(validPullRequestTitles)('should allow valid PR titles: "%s"', (title) => {
    expect(REGEX.test(title)).toBeTruthy()
  })
})
