Link to JIRA ticket: https://passculture.atlassian.net/browse/PC-XXX

## Checklist

I have:

- [ ] Made sure the title of my PR follows the convention `[PC-XXX] <summary>`.
- [ ] Made sure my feature is working on the relevant real / virtual devices.
- [ ] Written **unit tests** for my feature.
- [ ] Added a **screenshot** for UI tickets.
- [ ] Explained my technical strategy below if feature is complex.

If native code (ios/android) was modified, after the PR is merged go to master and upgrade the **app version** (+1 patch):

(later there will be a script to embed these commands)

- use `yarn version --patch` (it will create a commit and a tag)
  - if you want an hard deployment of the testing environment, use `yarn version:testing` instead.
- then `git push && git push origin <tag_name>`
- then use the deploy script (temporary -> waiting for CI/CD to be ready)

## Technical strategy

> _Insert technical strategy_
