# Adding an icon

To add a new icon to the app, please use the script:

```sh
yarn generate:svg <path/to/svg> <componentName>
```

It will generate the corresponding React SVG component in `src/ui/svg/icons` folder.

Then, you can use this component, giving it a size (default is 32px), a color (default is black) or a testID, if needed.
