# Git aliases

## Best practices

```
pl() { git pull origin ${*:-HEAD}; }
p() { while ! git push origin ${*:-HEAD}; do sleep 1; done }
c() { git commit -m "$*"; }
a() { git add "${*:--A}"; }
s() { git status; }
ol() { git hs -30 || git log --oneline; }
rb() { git rebase -i ${*}; }
```
