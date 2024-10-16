---
title: 'Tips for End to End Testing with Puppeteer'
description: 'Getting up to speed with Puppeteer!'
pubDate: 2020-06-08
tags: ['javascript', 'software-testing']
---

<b>
  <a
    href="https://ui.toast.com/weekly-pick/ko_20200630/"
    target="_blank"
    title="Puppeteer로 E2E 테스트하기 팁 - Puppeteer와 함께 속도 높이기! | TOAST UI :: Make Your Web Delicious!"
  >
    This article is available in Korean | 한국어 가능
  </a>
</b>

These are exciting times for _End to End (E2E)_ testing in the JavaScript world. In the last couple of years,
tools such as <a href="https://www.cypress.io/" target="_blank" title="JavaScript End to End Testing Framework | cypress.io">cypress</a> and <a href="https://pptr.dev/" target="_blank" title="Puppeteer Official Home">Puppeteer</a> have flooded the JavaScript community and gain a fast adoption.

Today I'm writing about Puppeteer. I want to share a pragmatic list of tips and resources that can help you get a fast overall understanding of things to
consider when using Puppeteer, and what it has to offer.

###### Topics I'll Cover

1. [Getting things running](#getting-things-running)
2. [Writing Tests](#writing-tests)
3. [Debugging](#debugging)
4. [Performance Automation](#performance-automation)
5. [Browser Support](#browser-support)

<br />

#### Getting things running

In this section, I discuss the main aspects of running a test with Puppeteer, including some interoperability
aspects that we should consider, such as the usage of an underlying testing library/framework such as Jest.

##### Running tests in parallel

To launch different browser instances to run your test suite, you can rely on your chosen test runner. For example, with <a href="https://jestjs.io/" target="_blank" title="Jest · 🃏 Delightful JavaScript Testing">Jest</a>, I leverage the config <a href="https://jestjs.io/docs/en/cli.html#--maxworkersnumstring" target="_blank" title="Max Workers Jest Documentation">maxWorkers</a> to define how many browser sessions I allow to run concurrently.

##### Be aware of the global timeout value

You want to increase the default global value for a test to timeout. E2E tests might take up several seconds to run. If you're using Jest, you can configure the timeout value with the property <a href="https://jestjs.io/docs/en/configuration#testtimeout-number" target="_blank" title="testTimeout Jest Documentation">testTimeout</a>, which for Jest 26.0 defaults to 5 seconds.

Here's an example of my `jest.config.js` with the mentioned configurations.

```javascript title="jest.config.js"
module.exports = {
  verbose: true,
  rootDir: '.',
  testTimeout: 30000,
  maxWorkers: 3,
}
```

If you're using (for example) <a href="https://jestjs.io/docs/en/configuration#testtimeout-number" target="_blank" title="Mocha - the fun, simple, flexible JavaScript test framework">mocha</a>, you can add `this.timeout(VALUE_IN_SECONDS);` at the top level of your `describe` block.

<br />

##### Abstracting puppeteer.launch

To bootstrap your test, you have to run <a href="https://pptr.dev/#?product=Puppeteer&version=v3.1.0&show=api-puppeteerlaunchoptions" target="_blank" title="puppeteer.launch Documentation">puppeteer.lauch</a>. I recommend
you to be abstract this call within a wrapper function. Doing so allows you to centralize
all your test environment customizations easily. I'm referring to making the following things **configurable**:

- Allow the client to specify what page the browser should open on.
- Allow the client to decide under what **network conditions** the test runs. I'll [also cover this in this article](#throttling-network-connection-speed).
- Allow the client to specify things like whether the <a href="https://pptr.dev/#?product=Puppeteer&version=v3.1.0&show=api-puppeteerlaunchoptions" target="_blank" title="puppeteer.launch Documentation">DevTools</a> are open etc.

```javascript title="boot.js"
import puppeteer from 'puppeteer'

export default async function boot(options = {}) {
  let page = null
  let browser = null

  const { goToTargetApp = true, headless = true, devtools = false, slowMo = false } = options

  browser = await puppeteer.launch({
    headless,
    devtools,
    ...(slowMo && { slowMo }),
  })

  if (goToTargetApp) {
    page = await browser.newPage()
    // I'm assuming there's some environment variable here
    // that points towards the app we're going to test
    await page.goto(process.env.APP_URL)
  }

  return { page }
}
```

I like to have my launch function just dealing with the bootstrap configuration aspects of my test environment and launch the application. I try to keep it as slimmer as possible, but sometimes I feel the urge to add more stuff here. There's a saying:

<br />

> "Functions should do one thing. They should do it well. They should do it only."

_source_: <a href="http://cleancoder.com/products" target="_blank" rel="nofollow" title="Uncle Bob Martin">Clean Code by Robert C. Martin</a>

<br />

##### Throttling Network Connection Speed

You can run your tests under different network speed conditions. Let me share the pattern I use <a href="https://gist.github.com/trungpv1601/2ccd3cc998149a84ba80ed7a4c9ef562" target="_blank" title="Network throttling in Puppeteer GitHub Gist">based on this gist that I luckily found</a>.

If you [abstract puppeteer.launch](#abstracting-puppeteerlaunch), your test could switch between network presets just by doing the following.

```javascript title="boot.js"
import puppeteer from 'puppeteer'
import NETWORK_PRESETS from './network-presets'

export default async function boot(options = {}) {
  let page = null
  let browser = null

  const { goToTargetApp = true, headless = true, devtools = false, slowMo = false } = options

  browser = await puppeteer.launch({
    headless,
    devtools,
    ...(slowMo && { slowMo }),
  })

  if (goToTargetApp) {
    page = await browser.newPage()
    // I'm assuming there's some environment variable here
    // that points towards the app we're going to test
    await page.goto(`${process.env.TARGET_APP_URL}${targetAppQueryParams}`)

    if (network && NETWORK_PRESETS[network]) {
      // setup custom network speed
      const client = await page.target().createCDPSession()
      await client.send('Network.emulateNetworkConditions', NETWORK_PRESETS[network])
    }
  }

  return { page }
}
```

<br />

<details>
<summary>network-presets.js</summary>

```javascript title="network-presets.js"
// source: https://gist.github.com/trungpv1601/2ccd3cc998149a84ba80ed7a4c9ef562
export default {
  GPRS: {
    offline: false,
    downloadThroughput: (50 * 1024) / 8,
    uploadThroughput: (20 * 1024) / 8,
    latency: 500,
  },
  Regular2G: {
    offline: false,
    downloadThroughput: (250 * 1024) / 8,
    uploadThroughput: (50 * 1024) / 8,
    latency: 300,
  },
  Good2G: {
    offline: false,
    downloadThroughput: (450 * 1024) / 8,
    uploadThroughput: (150 * 1024) / 8,
    latency: 150,
  },
  Regular3G: {
    offline: false,
    downloadThroughput: (750 * 1024) / 8,
    uploadThroughput: (250 * 1024) / 8,
    latency: 100,
  },
  Good3G: {
    offline: false,
    downloadThroughput: (1.5 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
    latency: 40,
  },
  Regular4G: {
    offline: false,
    downloadThroughput: (4 * 1024 * 1024) / 8,
    uploadThroughput: (3 * 1024 * 1024) / 8,
    latency: 20,
  },
  DSL: {
    offline: false,
    downloadThroughput: (2 * 1024 * 1024) / 8,
    uploadThroughput: (1 * 1024 * 1024) / 8,
    latency: 5,
  },
  WiFi: {
    offline: false,
    downloadThroughput: (30 * 1024 * 1024) / 8,
    uploadThroughput: (15 * 1024 * 1024) / 8,
    latency: 2,
  },
}
```

</details>

<br />
<br />

##### Loading a Browser Extension

Here's how you can load a browser extension.

```javascript
// 1. launch puppeeter pass along the EXTENSION_PATH within your project
// a relative path that points to the directory you output your extension assets
browser = await puppeteer.launch({
  // extension are allowed only in head-full mode
  headless: false,
  devtools,
  args: [`--disable-extensions-except=${process.env.EXTENSION_PATH}`, `--load-extension=${process.env.EXTENSION_PATH}`],
  ...(slowMo && { slowMo }),
})

// 2. find the extension by the title
// you might want to tackle this differently
// depending on your use case
const targets = await browser.targets()
const extensionTarget = targets.find(({ _targetInfo }) => {
  return _targetInfo.title === 'my extension page title'
})

// 3. getting the extensionId from the URL
// if you have a fixed extensionId you can just pass in an
// environment variable with that value, otherwise this works fine
const partialExtensionUrl = extensionTarget._targetInfo.url || ''
const [, , extensionID] = partialExtensionUrl.split('/')
// here the entry point of the extension is an html file called "popup.html"
const extensionPopupHtml = 'popup.html'

// 4. open the chrome extension in a new tab
// notice that to properly build the extension URL you need the
// extensionId and the entrypoint resource
extensionPage = await browser.newPage()
extensionUrl = `chrome-extension://${extensionID}/${extensionPopupHtml}`

await extensionPage.goto(extensionUrl)

// ... now use extensionPage to interact with the extension
```

<br />

If you want to read through about testing chrome extensions with Puppeteer, I
recommend this article: <a href="https://gokatz.me/blog/automate-chrome-extension-testing/" target="_blank" title="Automate the UI Testing of your chrome extension - Gokul Kathirvel">Automate the UI
Testing of your chrome extension</a> by <a href="https://gokatz.me/" target="_blank" title="Gokul Kathirvel">Gokul Kathirvel</a>.

<br />

#### Writing Tests

Apart from the [last subsection](#clearing-text-from-an-input-field), what I discuss next,
can be easily found in the official documentation. I'm just going to step on those topics that
I consider to be essential parts of the Puppeteer API.

##### Working with page.evaluate

You'll need to get used to the detail that when using <a href="https://pptr.dev/#?product=Puppeteer&version=v3.0.3&show=api-pageevaluatepagefunction-args" target="_blank" title="Puppeteer Docs page.evaluate">page.evaluate</a>, you run on the page context,
meaning even if you're using arrow functions as an argument to `page.evaluate`, you can't refer
to things out of the scope of that function. You need to provide all the data you'll need as the
third argument of `page.evaluate`. Keep this in mind.

```javascript
// extracting the "value" from an input element
const inputValue = await inputEl.evaluate((e) => e.value)
```

<br />

##### page.waitForSelector & page.waitForFunction

Quickly getting familiar with the APIs <a href="https://pptr.dev/#?product=Puppeteer&version=v3.1.0&show=api-pagewaitforselectorselector-options" target="_blank" title="page.waitForSelector Puppeteer Documentation">page.waitForSelector</a> and <a href="https://pptr.dev/#?product=Puppeteer&version=v3.1.0&show=api-pagewaitforfunctionpagefunction-options-args" target="_blank" title="page.waitForFunction Puppeteer Documentation">page.waitForFunction</a> can reveal itself very productive. If you have a couple of tests to write changes that you'll need to wait for some condition to be met in the UI before you allowing your test to proceed, are high. Suspend the test flow and wait for the UI is a common practice, not exclusive to Puppeteer. See the below examples for some basic usages.

```javascript
// this function waits for the menu to appear before
// proceeding, this way we can ensure that  we can interact
// with the list items in the menu
const getSmuiSelectOptions = async () => {
  const selector = '.mdc-menu-surface li'
  await page.waitForSelector(selector, { timeout: 1000 })
  return await page.$$(selector)
}
```

```javascript
// wait for a snackbar to appear when some item is deleted in the application
await extensionPage.waitForFunction(
  () => !!document.querySelector('*[data-testid="global-snackbar"]').innerText.includes('deleted'),
  {
    timeout: 2000,
  },
)
```

There's a decision you need to make. The choice is whereas you should have a higher or lower timeout. I usually try to advocate for lower as possible, because we want to keep our tests fast. Running E2E tests against systems where you need to perform (not mocked) network requests, means that you need to account for network instability, altough
usually you'll run under _perfect_ network conditions, you might want to cut some slack to the timeout value.

##### element.select

I like the way it's possible to select options <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select" target="_blank" title="<select> - HTML: Hypertext Markup Language | MDN">on a native HTML select element</a>. It works both for single and multiple selections, and it feels natural.

```javascript
// selecting an HTTP method in a select element with id "custom-http-method"
const selectEl = await page.$('#custom-http-method')

await selectEl.select('POST')
```

While `element.select` it's convenient, you'll probably have to approach this
differently for custom select fields built on a `div > ul > li` structure with a
hidden input field, for instance <a href="https://material-ui.com/components/selects/#select" target="_blank" title="Select React component - Material-UI">select Material UI components</a>.

##### Screenshots

For specific test cases, I like to output a collection of screenshots that build a
timeline of how my application looks throughout the test. Screenshotting in between
your test helps you get an initial pointer to what you
should be debugging in a failing test. Here's my small utility that wraps <a href="https://pptr.dev/#?product=Puppeteer&version=v3.1.0&show=api-pagescreenshotoptions" target="_blank" title="page.screenshot Puppeteer Documentation">page.screenshot</a>
API.

```javascript title="test-utils.js"
// wrapping the call to `page.screenshot` just to avoid it
// breaking my test in case the screenshot fails
export async function prtScn(page, path = `Screenshot ${new Date().toString()}`) {
  try {
    await page.screenshot({ path, type: 'png', fullPage: true })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    // eslint-disable-next-line no-console
    console.info('Failed to take screenshot but test will proceed...')
    return Promise.resolve()
  }
}
```

```javascript
import * as utils from 'test-utils'

// (...)

// Note: you can make this utility a Class and pass along the page
// as context so that you don't need to pass it in everytime you
// need to take a screenshot
await utils.prtScn(page)
```

<br />
<br />

##### Page Reloads

With the <a href="https://pptr.dev/#?product=Puppeteer&version=v3.1.0&show=api-pagereloadoptions" target="_blank" title="page.reload Puppeteer Documentation">page.reload</a> API. You can
specify a set of options that allow you to wait for specific underlying browser tasks to idle before proceeding.

```javascript
await page.reload({ waitUntil: ['networkidle0'] })
```

In this above example, we reload the page with `networkidle0`, which does not allow the test to proceed unless there are no HTTP requests within a half a second period.

##### Clearing Text from an Input Field

I was stunned not to find a very out-of-the-box way to clear an input field. A few developers <a href="https://github.com/puppeteer/puppeteer/issues/3094" target="_blank" title="Feature request: Add 'clear' option to the .type() function · Issue #3094 · puppeteer/puppeteer">have expressed interest in this feature</a>, but it seems there's no interest on the other end. I've found a way to do it:

```javascript title="test-utils.js"
/**
 * Clears an element
 * @param {ElementHandle} el
 */
export async function clear(el) {
  await el.click({ clickCount: 3 })
  await el.press('Backspace')
}
```

**It only works on Chrome** as it takes advantage of the functionality where three consecutive clicks in a text area/input field select the whole text. After that, you need to trigger a keyboard event to clear the entire field.

<br />

#### Debugging

I want to highlight some debugging techniques. Especially the `slowMo` option.

##### Debugging with slowMo

You'll want to use <a href="https://pptr.dev/#?product=Puppeteer&version=v3.1.0&show=api-puppeteerlaunchoptions" target="_blank" title="puppeteer.launch Documentation">slowMo</a> to debug individual tests. The option allows you to slow down the interactions (the steps) of your E2E test so that you can see what's going on, almost like seeing an actual human interacting with your application. I can't emphasize enough how valuable this is.

```javascript
page.launch({ slowMo: 50 })
```

In the following GIFs you can see the difference of running without and with the `slowMo` option respectively. E2E test on the tweak chrome extension <b>without slowMo</b>. You can't possibly understand what's going on.

![without slow motion](./assets/tips-end-to-end-testing-puppeteer/no-slowmo.gif 'without slow motion')

<br />

![with slow motion](./assets/tips-end-to-end-testing-puppeteer/slowmo.gif 'with slow motion')

In these examples I'm using the <a href="https://tweak-extension.com/" target="_blank" title="tweak browser extension, intercept and mock HTTP requests">tweak browser extension</a> to demo the different use cases.

For more awesome tips for debugging, I highly recommend this short article on Debugging Tips from Google.

##### Using debugger

I got this one from <a href="https://developers.google.com/web/tools/puppeteer/debugging" target="_blank" title="Debugging  |  Tools for Web Developers  |  Google Developers">Google debugging tips</a>. I had the habit of
throwing a `sleep` statement to stop my tests for _X_ seconds and inspect the application
to see why the tests were breaking. But now I completely shifted to this.

```javascript
await page.evaluate(() => {
  debugger
})
```

For more great debugging tips, I highly recommend <a href="https://developers.google.com/web/tools/puppeteer/debugging" target="_blank" title="Debugging  |  Tools for Web Developers  |  Google Developers">this short article on Debugging Tips</a> from Google.

<br />

#### Performance Automation

There's quite a _buzz_ going on about using Puppeteer to automate web performance
testing. I couldn't write this article without giving a shout out to <a href="https://addyosmani.com/" target="_blank" title="AddyOsmani.com">Addy Osmani</a> on the
work developed on <a href="https://github.com/addyosmani/puppeteer-webperf" target="_blank" title="Automating Web Performance testing with Puppeteer">addyosmani/puppeteer-webperf</a>, which I couldn't
recommend more. Within the project `README.md` you'll find the most organized
set of examples to tune your performance automation.

<br />

#### Browser Support

According to the <a href="https://pptr.dev/" target="_blank" title="Puppeteer Official Home">official documentation</a>, you can use Puppeteer with Firefox, with the caveat that you might encounter some issues since this capability is experimental at the time of this writing. You can specify which browser to run via `puppeteer.launch` options API that I've covered [in this section](#abstracting-puppeteerlaunch).

<br />
<br />

**What are your favorite bits of Puppeteer? What would you recommend me to learn next?**
