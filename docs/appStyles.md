<!-- File _appStyles.scss
Developer: @yannick-leguennec - Yannick's GitHub ID -->

# Family Flow Global Styles

## Container global rules, integration manual

- **First** Import the globlaStyles.scss file into your componant file => `import '../../styles/globalStyles.scss';`
- **Then place your global style in a Mantinue UI componant `<Container>` with the `className="container"`.**.

## Responsive settings

- To integrate the responsive settings for the pages, you must integrate in the componant.module.scss file the `.mediaContainer` class as given below:

```scss
.mediaContainer {
  @media (max-width: $mantine-breakpoint-xs) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 50px 20px;
  }
}
```

- You then must impport your scss file into your component => `import classes from ./yourcomponant.module.scss`.
- Finally you must add the your new class to the `<Container>` componant the following way => `<Container className={`container ${classes.mediaContainer}`}>` in order to apply your personalized reactive rules.
- Adding this simple class should transform your container into a fully responsive one.

## Buttons

- The app uses the Mantine UI `Button` component => [https://mantine.dev/core/button/](https://mantine.dev/core/button/)
- `<Button>` must have a width of 100px => `<Button w={100}>`
- `<Button>` must have a margin of 10px => `<Button> m={10}`
- `<Button>` must have a responsive size => `Button size="responsive"`
- `<Button>` must have a "xl" radius => `<Button radius="xl"`
- Regarding the application of the proper styles to each `<Button>` the `buttons.scss` file must be imported in the componant => `import '../../styles/buttons.scss';`
- For validation `<Button>`, the following `className` would be applied => `className="gradientButton"`
- For come back buttons or unvalidation buttons, the following `className` would be applied => `className="outlineButton"`
- Example => `<Button w={100} m={10} size="responsive" radius="xl">Test</Button>`

```tsx
<Button type="submit" radius="xl" m={10} w={100} className="your class">
  Your button name
</Button>
```

-**All the customs buttons** can be found into the `buttons.scss` file inside the `styles` folder.

## Input

- All the inputs must have a `radius-"xl"`.

## Modal Style

```tsx
const headerColor = '#6bd3d4';

<Modal.Root opened={opened} onClose={onClose} centered size="auto">
  <Modal.Overlay style={{ backdropFilter: 'blur(10)' }} />
  <Modal.Content>
    <Modal.Header style={{ background: headerColor, color: 'white' }}>
      <Modal.Title fw={700}>Your Title</Modal.Title>
      <Modal.CloseButton style={{ color: 'white' }} />
    </Modal.Header>
    <Modal.Body>Your body</Modal.Body>
  </Modal.Content>
</Modal.Root>;
```

## Primary Title

- **First** Import the myComponant.module.scss file into your componant file => `import classes from '../../myComponant.module.scss`
- **Second**, put the following code inside the `myComponant.module.scss` file:

```scss
.primeTitle {
  color: $title-color;
  text-align: center;
}
```

- **Finally**, add the new created class to your `<Title>` like that => `<Title className={`${classes.title}`}`
- We recommand to always put a `margin-bottom` of `25px` in order to consistent style.

## Secondary Title

- **First** Import the myComponant.module.scss file into your componant file => `import classes from '../../myComponant.module.scss`
- **Second**, put the following code inside the `myComponant.module.scss` file:

```scss
.title {
  color: $title-color;
  text-align: center;
}
```

- **Finally**, add the new created class to your `<Title>` like that => `<Title className={`${classes.title}`}`

## Variables

- All the variables of the apps are within `_varaibles.scss` file inside the `styles` folder

## Icons and Photos

- All the graphic material employed inside the app can be found inside the `public/img` folder.
- The icon representaing the `task` category for the activities is named `FF_iconed-task.png`.
- The icon representing the `event` category for the activities is named `FF_icon.event.png`.
- The icon representing a `family` is named `FF_icon_family.png`.
- The icon representing a `member` is named `FF_icon_member.png`.

## Special Thanks

- A special thanks to **Violette Design** for its special contribution for the creation of our visual identity => [https://www.violettedesign.ca/](https://www.violettedesign.ca/).
