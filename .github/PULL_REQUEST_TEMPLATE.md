Link to JIRA ticket: https://passculture.atlassian.net/browse/PC-XXX

## Checklist

I have:

- [ ] Made sure the title of my PR follows the convention `[PC-XXX] <summary>`.
- [ ] Made sure my feature is working on the relevant real / virtual devices.
- [ ] Written **unit tests** for my feature.
- [ ] Added new reusable components to the AppComponents page and shared a topic to slack
- [ ] Added a **screenshot** for UI tickets.
- [ ] Explained my technical strategy below if feature is complex.

## Screenshots

| iOS - [Phone name ]                         |            Android - [Phone name]            |                        Tablet - [Phone name] |                        Little - [Phone name] |
| ------------------------------------------- | :------------------------------------------: | -------------------------------------------: | -------------------------------------------: |
| <img alt="image" src="XXX.png" width="170"> | <img alt="image" src="XXX.png"  width="170"> | <img alt="image" src="XXX.png"  width="170"> | <img alt="image" src="XXX.png"  width="170"> |

## Deploy hard

If native code (ios/android) was modified, **after** the PR is merged, on the master branch, upgrade the **app version** (+1 patch):

- if you want an hard deployment of the testing environment, use `yarn version:testing` (this will create a commit with a tag)
- then run `git push --follow-tags`

## Technical strategy

> _Insert technical strategy_
