# yt-man
Browser extension to enable time based skips in YouTube videos using the *next-track* and *previous-track* media keys. 

## Installation
Install all dependencies and build the project with

```bash
yarn && npx webpack
```

Upon success, the files for the extension will reside under `./dist/`. To install the extension in a Chromium based browser go to `chrome://extensions`, enable *Developer mode*, click *Load unpacked* and choose the `dist` folder.

## Development
To debug the extension during development, open `package.json` and modify the values for `--chromium-binary` and `--chromium-profile` inside the `debug` task in accordance with your environment. Next run

```bash
npx webpack -w
```

to automatically rebuild the project whenever changes to the source files are detected and invoke
```bash
yarn debug
```

in another terminal. This will launch a chromium executable with the extension pre-installed and upon a new build from Webpack, the extension will be automatically re-installed.

## Notes
The extension does not maintain separate states if there are several YouTube tabs, i.e. if you disable extension in one tab it will be disabled everywhere. Changes to the 'enabled' state and the numeric timeskip value thus send a signal to every tab instead of just affecting the active tab (see the `handle*` methods in `src/components/App.tsx`). 
