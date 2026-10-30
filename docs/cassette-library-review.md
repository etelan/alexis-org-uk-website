# Cassette library: suggested changes

## Fix

- Update progress text through the element’s `textContent`; `style.setProperty` cannot change text.
- Handle image-loading failures so the loading screen does not stay up indefinitely.
- Stop resizing the loaded image in `createCassetteTexture`; size it when drawing to the canvas instead.

## Tidy up

- Include texture settings in the `useMemo` dependency list so changes regenerate materials.
- Remove unused `Suspense` and `OrbitControls` imports and the extra canvas `save()`.
- Move repeated cassette settings into a data list to make assets and values easier to maintain.
- Scope the stylesheet to this page instead of styling global `body` and ID selectors.
