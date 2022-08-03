## Web


### Analyze production build

Set `BUNDLE_ANALYZER` environment variable to visualize what's bundled in production:

```bash
BUNDLE_ANALYZER=true yarn build:testing
```

This will open a Web page with a visualization of all the sources and dependencies builded, with size en gzipped size, ex:

![Example of webpack-bundle-analyzer](https://user-images.githubusercontent.com/77674046/182584538-e0554a55-5f8f-4282-b3a2-aebfce5ec9d6.png)

This can help to understand if you are building, optimizing and tree shaking correctly.

Read more about tree shaking : [MDN](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) | [How To Make Tree Shakeable Libraries](https://blog.theodo.com/2021/04/library-tree-shaking/)
