# Deeplinker

Tiny script that helps you upgrade links to open apps directly if it is possible.

You can use deeplinking system to open apps by links with custom schemes. [Instagram's deeplinks docs](https://www.instagram.com/developer/mobile-sharing/iphone-hooks/) as an example. 

## Install

You can install script via package managers or download it to your server. 

### NPM and Yarn

Install package

```shell
npm install @codexteam/deeplinker --save 
```

```shell
yarn add @codexteam/deeplinker
```

Then require `deeplinker` module

```js
const deeplinker = require('@codexteam/deeplinker');
``` 

### Local script

Download [dist/deeplinker.js](dist/deeplinker.js) file to your server and add it to your webpage.

```html
<script src="dist/deeplinker.js" async></script>
```

## Usage

### On click

Call `deeplinker.click(element)` function. Element should contains the following params:

- `data-link` or `href` with a usual link
- `data-app-link` with a deep link (with custom protocol) to an application

Upgrade your link element by adding a listener with preventing default action. Set up `data-app-link` param.

```html
<a href="https://www.instagram.com/codex_team/"
   onclick="event.preventDefault(); deeplinker.click(this)"
   data-app-link="instagram://user?username=codex_team">Follow us on Instagram</a>
```

Or add listener to any element. Set up `data-link` and `data-app-link` params.

```html
<div onclick="deeplinker.click(this)"
     data-link="https://t.me/codex_team"
     data-app-link="tg://resolve?domain=codex_team">Join our Telegram-channel</div>
```

### Run automatically

If you want to try open app silently then call `deeplinker.tryToOpenApp(deepLink)`.

Could be useful for redirection or invitation pages.

> Doesn't works on mobile devices.

```html
<body onload="deeplinker.tryToOpenApp('tg://user?username=codex_team')">
```

## License

MIT
