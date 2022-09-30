# Achievements

UI component used to display one or many achievements

## Features

- Includes tracking analytics of page view
  - Automatically generated or customizable achievement card name
- Skip achievement
  - Automatically display a button `Skip` (for single achievement) or `Skip all` (for many achievement)

## Usage

You must create achievement card and pass them as a children to an achievement.

This is an example of card with all the `props`:

```jsx
import React from 'react'

import TutorialPassLogo from 'ui/animations/tutorial_pass_logo.json'
import {
  AchievementCardKeyProps,
  GenericAchievementCard,
} from 'ui/components/achievements/components/GenericAchievementCard'

export function FirstCard(props: AchievementCardKeyProps) {
  function onButtonPress() {
    props.swiperRef?.current?.goToNext()
  }

  return (
    <GenericAchievementCard
      animation={TutorialPassLogo}
      buttonCallback={onButtonPress}
      buttonText="Continuer"
      pauseAnimationOnRenderAtFrame={62}
      subTitle="c’est..."
      text="une initiative financée par le Ministère de la Culture."
      title="Le pass Culture"
      swiperRef={props.swiperRef}
      name={props.name}
      index={props.index}
      activeIndex={props.activeIndex}
    />
  )
}
```

> - `props.swiperRef` is automatically passed by the `GenericAchievement` component and are used to control the `activeIndex`
> - `props.index` and `props.activeIndex` are automatically passed by the `GenericAchievement` component and are used to detect when the animation should play
>   and when the analytics should trigger a screen view
> - `props.name` is automatically passed by the `GenericAchievement` component and is used as screen view name for analtyics. It is possible to override it, see section [Analytics](#analytics) below.
> - `props.lastIndex` is automatically passed by the `GenericAchievement` and is only used internally to decide if `Skip` button should be displayed in the card
> - `props.swiperRef` is automatically passed by the `GenericAchievement` and give fine control over the `activeIndex`

### Use with one achievement card:

```typescript jsx
import { GenericAchievement, GenericAchievementCard, AchievementCardKeyProps } from 'ui/components/achievements'
const MyAchievement = (props) => <GenericAchievement {...props} name="MonTutorial />
const MaCarteUnique = (props: AchievementCardKeyProps) => <GenericAchievementCard  {...props} />

export default () => (
  <MyAchievement>
    <MaCarteUnique />
  </MonTutorial>
)
```

**Result**

![image](https://user-images.githubusercontent.com/1866564/107704033-e5ccfc80-6cbc-11eb-982d-2bd631a751fd.png)

### Use with many achievements cards:

```jsx
import { GenericAchievement, GenericAchievementCard, AchievementCardKeyProps } from 'ui/components/achievements'

const MaCarteUn = (props: AchievementCardKeyProps) => <GenericCard  {...props} />
const MaCarteDeux = (props: AchievementCardKeyProps) => <GenericCard  {...props} />
const MonTutorial = (props) => <GenericTutorial {...props} name="MonTutorial />

export default () => (
  <MonTutorial>
    <MaCarteUn />
    <MaCarteDeux />
  </MonTutorial>
)
```

**Result**

![image](https://user-images.githubusercontent.com/1866564/107508236-fee08b00-6ba0-11eb-991d-e786ff0cca3e.png)

## Analytics

We use `name` on the `GenericAchievement` as a unique identifier.

This unique identifier will be used for analytics, each card will suffix `${props.name}${index + 1}`.

You can manually override the card name used for analytics by specifying `name` to the card :

```jsx
import { GenericAchievement, GenericAchievementCard, AchievementCardKeyProps } from 'ui/components/achievements'

const MaCarteUn = (props: AchievementCardKeyProps) => <GenericCard  {...props} />
const MaCarteDeux = (props: AchievementCardKeyProps) => <GenericCard  {...props} />
const MonTutorial = (props) => <GenericTutorial {...props} name="MonTutorial />

export default () => (
  <MonTutorial>
    <MaCarteUn name="SpecialName" />
    <MaCarteDeux />
  </MonTutorial>
)
```

## On Skip Event with `props.skip`

You can pass a custom on skip event which will be called when user press the `Skip all` or `Skip` button as follow:

```jsx
import { GenericAchievement, GenericAchievementCard, AchievementCardKeyProps } from 'ui/components/achievements'

const MaCarteUn = (props: AchievementCardKeyProps) => <GenericCard  {...props} />
const MaCarteDeux = (props: AchievementCardKeyProps) => <GenericCard  {...props} />
const MonTutorial = (props) => <GenericTutorial {...props} name="MonTutorial />

export default () => {
  const skip = () => storage.setItem('has_view_birthday_eighteen', true)
  return (
    <MonTutorial skip={skip}>
      <MaCarteUn />
      <MaCarteDeux />
    </MonTutorial>
  )
}
```
