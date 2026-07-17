# Progress Design System — App Implementation Guide

## Source

Based on the UX-provided `progress-design-system-guide.md`.

This file is the current visual design authority for the Progress List Upload Formatter.

---

## 1. Fonts

Use Progress variable fonts with fallbacks:

```css
--font-display: "Progress Sans Display VF", Inter, "Segoe UI", system-ui, Arial, sans-serif;
--font-text: "Progress Sans Text VF", Inter, "Segoe UI", system-ui, Arial, sans-serif;
```

At `max-width: 590px`, fall back to Arial.

---

## 2. Color primitives

### Blues

```css
--pw-dark-blue-w1: #00122c;
--pw-dark-blue-w2: #001f4b;
--pw-dark-blue-w3: #151950;
--pw-blue-p1: #00216b;
--pw-blue-p2: #2b2bb2;
--pw-blue-p3: #4b4bf7;
--pw-blue-p4: #5777ea;
--pw-blue-p5: #dcecff;
--pw-blue-w1: #0037cb;
--pw-blue-w2: #054bff;
```

### Reds

```css
--pw-red-w1: #b90138;
--pw-red-w2: #eb0249;
```

### Greens

```css
--pw-green-p1: #008963;
--pw-green-p2: #00b563;
--pw-green-p4: #62de7f;
--pw-logo-green: #5ce500;
```

### Neutrals

```css
--pw-dark-grey-w2: #383f55;
--pw-dark-grey-s4: #9eaec3;
--pw-light-grey-w1: #f5f6f7;
--pw-light-grey-w2: #f4f7fd;
--pw-light-grey-s2: #dde9f7;
--pw-light-grey-s3: #eef5ff;
--pw-white: #ffffff;
--pw-black: #000000;
```

---

## 3. Semantic colors

Use semantic tokens in component styles:

```css
--color-primary: #eb0249;
--color-primary-hover: #b90138;
--color-secondary: #054bff;
--color-secondary-hover: #0037cb;
--color-dark-navy: #001f4b;
--color-dark-navy-hover: #00122c;
--color-success: #008963;
--color-success-light: #ebf7f3;
--color-warning: #ffbb26;
--color-warning-light: #fff8e6;
--color-danger: #eb0249;
--color-danger-light: #ffeef3;
--color-text-heading: #060606;
--color-text-body: #383f55;
--color-text-link: #054bff;
--color-text-link-hover: #0037cb;
--color-text-muted: #9eaec3;
--color-bg: #ffffff;
--color-bg-subtle: #f5f6f7;
--color-bg-light: #f4f7fd;
--color-bg-blue: #eef5ff;
--color-border: #dde9f7;
--color-border-form: rgba(158,174,195,0.80);
--color-separator: rgba(158,174,195,0.40);
```

---

## 4. Typography

The web design system uses large marketing typography, but this app is a dense internal workflow. Use a practical app scale derived from the system:

- Page title: 40px Display, regular.
- Section title: 26px Display, semibold.
- Body: 18px Text where practical.
- Dense table/body: 15px Text.
- Labels: 13px Text, uppercase/bold where used as form labels.
- Microcopy: never below 12px.

---

## 5. Spacing

Use fixed Progress spacing tokens:

```css
--space-5: 5px;
--space-10: 10px;
--space-20: 20px;
--space-30: 30px;
--space-40: 40px;
--space-50: 50px;
--space-60: 60px;
--space-70: 70px;
--space-80: 80px;
--space-90: 90px;
--space-100: 100px;
```

Grid gutter is always 30px.

---

## 6. Radius

```css
--radius-none: 0;
--radius-xs: 2px;
--radius-sm: 5px;
--radius-md: 10px;
--radius-lg: 20px;
```

Usage:

- Buttons and inputs: 5px.
- Cards, modals, dropdowns, tables: 10px.
- Pills, badges, labels: 20px.

---

## 7. Elevation

```css
--shadow-xs: 0 3px 6px rgba(4,20,43,0.06);
--shadow-sm: 0 8px 13px rgba(4,20,43,0.07);
--shadow-md: 0 10px 15px rgba(4,20,43,0.10);
--shadow-lg: 0 12px 20px rgba(4,20,43,0.12);
```

Do not use hover scale on dense operational form cards or Review tables. Hover scale is reserved for interactive marketing/resource cards.

---

## 8. Buttons

All buttons are uppercase.

Primary:

- Background: `#EB0249`
- Hover: `#B90138`
- Text: white

Secondary:

- Background: `#054BFF`
- Hover: `#0037CB`
- Text: white

Ghost:

- Background: transparent
- Border: `#054BFF`
- Text: black on light backgrounds
- Hover: `#0037CB`

Default app button size:

- Height: 43px
- Font: 15px
- Border radius: 5px

---

## 9. Forms

Inputs and selects:

- Background: white.
- Border: `rgba(158,174,195,0.80)`.
- Hover border: `#383F55`.
- Focus border: `#054BFF`.
- Focus ring: `rgba(5,75,255,0.25)`.
- Radius: 5px.
- Height: 43px.

---

## 10. Tables

Review tables follow the Progress table standard:

- Header background: `#EEF5FF`.
- Header text: heading color `#060606`.
- Odd rows: white.
- Even rows: `#F4F7FD`.
- Separators: `rgba(158,174,195,0.40)`.
- Font: 15px.
- Cell padding: 12px 16px.
- Wrapper has 10px radius and hidden/auto overflow.

Status states:

- Error: `#FFEEF3` background, `#EB0249` text/accent.
- Warning: `#FFF8E6` background, amber text/accent.
- Resolved: `#EBF7F3` background, `#008963` text/accent.

---

## 11. Cards

Cards use:

- White background.
- 10px radius.
- `#DDE9F7` border.
- `--shadow-xs` or `--shadow-sm`.
- 20px or 30px padding.

---

## 12. App-specific notes

- Primary app navigation Continue buttons use the primary red CTA style.
- Secondary/back actions use secondary blue or ghost style.
- Resolved Review rows use success green treatment but primary CTAs remain red.
- Logo green `#5CE500` is for logo/accent only, not primary CTAs.
- Do not reintroduce old Progress Green primary button behavior.
