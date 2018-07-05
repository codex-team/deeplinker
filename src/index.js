/**
 * Helps to set link with custom protocol (to open apps) and usual link (for webpages) to a button
 *
 * @author Taly Guryn <https://github.com/talyguryn>
 * @license MIT
 */
const Deeplinker = (() => {
  /**
   * @public
   *
   * @description Add listeners for deeplinker elements
   *
   * @param {string} selector - find elements by target selector
   */
  const init = (selector = '.deeplinker') => {
    let links = document.querySelectorAll(selector);

    if (!links.length) {
      return;
    }

    Array.prototype.slice.call(links).forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        click(link);
      });
    });
  };

  /**
   * @public
   *
   * @description Wrapper for openAppOrLink for clickable elements as div buttons
   *
   * @example for non-link elements: add click listener, add data-link and data-app-link params
   *
   * <div onclick="deeplinker.click(this)"
   *      data-link="https://www.instagram.com/codex_team/"
   *      data-app-link="instagram://user?username=codex_team">Open Instagram</div>
   *
   * @example for <a> links
   *    add event.preventDefault() to click listener before processing click by deeplinker
   *    if data-link is null then deeplinker gets a link value from href param
   *    if JS is disabled then the link element will work as usual
   *
   * <a href="https://www.instagram.com/codex_team/"
   *      onclick="event.preventDefault(); deeplinker.click(this)"
   *      data-app-link="instagram://user?username=codex_team">Open Instagram</a>
   *
   * @see openAppOrLink
   *
   * @param {object} element
   *    clickable element
   * @param {string} element.dataset.appLink
   *    link with custom protocol
   * @param {string} element.dataset.link|element.href
   *    fallback page link from dataset-link or href params
   *
   * @throws Error
   */
  const click = (element) => {
    if (typeof element !== "object") {
      throwError('Passed element is not an object');
    }

    let link = element.dataset.link || element.href,
        appLink = element.dataset.appLink;

    openAppOrLink(appLink, link);
  };

  /**
   * @public
   *
   * @description Silently load a hidden iframe and try to open app if it exists
   *
   * @todo BUG: doesn't works on mobile devices
   *
   * @example may be useful on opening invitation page
   *    You can use it within function deeplinker.click on any button
   * <body onload="deeplinker.try('instagram://user?username=codex_team')">
   *
   * @param {string} appLink link with custom protocol
   */
  const tryToOpenApp = (appLink) => {
    if (!appLink) {
      throwError('Can not open app, because appLink is undefined');
    }

    /**
     * Create a new iframe element for link with custom protocol
     */
    let iframeEl = document.createElement('iframe');

    iframeEl.style.display = 'none';
    document.body.appendChild(iframeEl);

    /**
     * If the iframe element exists then we are going to set appLink
     * as it's source. Let's try to open app by appLink's protocol
     */
    if (iframeEl !== null) {
      iframeEl.src = appLink;
    }
  };

  /**
   * @private
   *
   * @description Open app by link with custom protocol or open fallback page with normal url.
   *    Uses hack when loaded iframe requests user to "open target app" if this app installed
   *    main browser's window will be blurred or hidden. Otherwise it will
   *
   * @param {string} appLink
   *    link with custom protocol
   *    "instagram://user?username=codex_team"
   * @param {string} link
   *    open this page if no app has had registered this protocol
   *    "https://www.instagram.com/codex_team/"
   */
  const openAppOrLink = (appLink, link) => {
    /**
     * Create pageHidden flag
     */
    let pageHidden = false;

    /**
     * Add "pagehide" listener to main window
     */
    window.addEventListener('pagehide', () => {
      pageHidden = true;
    }, false);

    /**
     * Add "blur" listener to main window
     */
    window.addEventListener('blur', () => {
      pageHidden = true;
    }, false);

    /**
     * Let's try to open link with custom protocol in the app
     */
    tryToOpenApp(appLink);

    /**
     * Check window's state in a 100 ms.
     * If window was not blurred or hidden then we need to open link.
     */
    setTimeout(() => {
      if (!pageHidden) {
        openPage(link);
      }
    }, 100);
  };

  /**
   * @private
   *
   * @description Wrapper for function to open page in a new tab
   *
   * @param {string} link
   *    webpage link to open in a new tab
   */
  const openPage = (link) => {
    if (!link) {
      throwError('Can not open page because link is undefined');
    }

    window.open(link, '_blank');
  };

  /**
   * @private
   *
   * @description Wrapper for throwing an error
   *
   * @param {string} message
   */
  const throwError = (message) => {
    throw Error('[Deeplinker] ' + message)
  };

  /**
   * Declare public functions
   */
  return {
    click,
    init,
    tryToOpenApp
  }
});

module.exports = Deeplinker();
