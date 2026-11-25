# Remote illustrations

## Why

The new UI vision illustrations are PNG files hosted on Google Cloud Storage instead of SVG components bundled in the app. Adding or replacing an illustration therefore needs two things: the file in the buckets, and a reference to it in the code.

## How it works

- `buildCategoryIllustrationUrl(filename)` builds `${env.ILLUSTRATIONS_BASE_URL}/${filename}`.
- `ILLUSTRATIONS_BASE_URL` is set in each `.env.<environment>` file and points to one public bucket per environment:

| Environment | Bucket                                       |
| :---------- | :------------------------------------------- |
| testing     | `pass-culture-app-jeunes-assets-testing`     |
| staging     | `pass-culture-app-jeunes-assets-staging`     |
| integration | `pass-culture-app-jeunes-assets-integration` |
| production  | `pass-culture-app-jeunes-assets-production`  |

- Files are stored at the root of each bucket and served from `https://storage.googleapis.com/<bucket>/<filename>`.

There are three families of illustrations, each with its own file in this folder:

| Family                        | File                                | Used by                                                                |
| :---------------------------- | :---------------------------------- | :--------------------------------------------------------------------- |
| Screens (pages and modals)    | `remoteIllustrations.ts`            | `RemoteIllustration`, `GenericInfoPage`, `GenericErrorPage`, modals    |
| Cultural objects (categories) | `categoryButtonIllustrations.ts`    | `CategoryListModule`, `ArtistEditorialModule`, search categories       |
| Cultural themes (Contentful)  | `buildContentfulIllustrationUrl.ts` | Category thematic headers (`illustrationFilename` field in Contentful) |

All three families are listed in Storybook under `design system/Illustrations`, in the `Cultural objects`, `Cultural themes` and `Screens` stories.

## Add an illustration

### 1. Get the file

- Export the illustration as a PNG with a transparent background from the Figma illustrations file. The background color is added by the app.
- Screen illustrations are displayed in a square container: export them with a 1:1 ratio.
- Name the file in camelCase, without spaces, accents or special characters (for example `ringingBellSmall.png`). Screen illustrations use a `Small` or `Large` suffix matching their size.

### 2. Upload it to the 4 buckets

- In the Google Cloud console, open each of the 4 buckets above and drag and drop the file at the root.
- Use exactly the same filename in the 4 buckets. URLs are case sensitive.

### 3. Reference it in the code

**Screen illustration**: add the name to `RemoteIllustrationName` and the URL to `remoteIllustrationUrls` in `remoteIllustrations.ts`, keeping the alphabetical order.

```ts
export type RemoteIllustrationName =
  // ...
  'myNewIllustrationLarge'

export const remoteIllustrationUrls = {
  // ...
  myNewIllustrationLarge: buildCategoryIllustrationUrl('myNewIllustrationLarge.png'),
} as const satisfies Record<RemoteIllustrationName, string>
```

Then use it in a page or a modal:

```tsx
<GenericInfoPage
  remoteIllustration={{
    url: remoteIllustrationUrls.myNewIllustrationLarge,
    backgroundColor: 'positive01',
  }}
  // ...
/>
```

- `backgroundColor` is a key of `theme.designSystem.color.illustration` (`positive01`, `negative01`, `pending01`, `information01`...). Take it from the Figma design.
- `size` is `'xl'` (default, 200) or `'s'` (96). Use `RemoteIllustration` directly when the screen does not use `GenericInfoPage` or `GenericErrorPage`.

**Cultural object (category)**: add the name to `categoryButtonIllustrationNames` and the URL to `categoryButtonIllustrationUrls`. To link it to a search category, update `categoryIllustrationUrls` in `src/features/search/constants/categoryIllustrationUrls.ts`.

**Cultural theme (Contentful)**: add the filename without extension to `contentfulIllustrationNames`. The `illustrationFilename` value entered in Contentful must match it exactly.

### 4. Check

- Open the matching story in Storybook: the new illustration must be displayed.
- Run the tests of the screens you changed. Add an assertion on the illustration when the screen displays it conditionally.

## Replace or remove an illustration

- Do not delete or rename a file in the `production` bucket while a released app version still uses it: older versions keep requesting the old URL.
- Images are cached by the app (`FastImage`) and by the browser. To change the visual of an illustration, prefer a new filename over overwriting the existing file.

## Rename an illustration

Some older files have a `@3x` suffix (`book@3x.png`, referenced in the code as `book%403x.png` because `@` is URL-encoded). To rename one, copy the file instead of moving it:

1. In each of the 4 buckets, add a copy under the new name (for example `book.png`) and keep the old file. The GCP console "Rename" action copies then deletes, so use "Copy" or upload the file again.
2. In the code, replace the old filename with the new one (`'book%403x.png'` → `'book.png'`) and update the tests that assert on the URL.
3. After the release, new versions request the new file while older native versions keep requesting the old one. The web app is always up to date, so it only uses the new file.
4. Delete the old file from the buckets only once no supported version uses it anymore, that is when the minimal version required by the force update uses the new name. Until then, keeping both files costs almost nothing.

## Mistakes to avoid

- Uploading the file in only some buckets: the illustration then works in one environment and not in another.
- A filename that differs between the code and the bucket (case, extension, `@3x` suffix).
- Forgetting the code reference: a file in the buckets is not displayed anywhere on its own.

## Error handling

A missing file in a bucket does not crash the app, but the result depends on the family:

- Screens: `RemoteIllustration` displays the `ErrorServer` SVG instead.
- Cultural objects and cultural themes: the category button or the thematic header is displayed without illustration.
