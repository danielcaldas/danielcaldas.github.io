---
title: 'Unrevealed tips for unit testing with Jest'
description: 'Unrevealed tips for unit testing with Jest'
pubDate: 2019-07-26
tags: ['javascript', 'software-testing']
---

As a front-end engineer by profession, and having a few JavaScript open source projects myself, I've faced some challenges around unit testing, in my particular case, with <a href="https://jestjs.io/en/" target="_blank" title="jest is a delightful javascript testing framework with a focus on simplicity">Jest</a>.

For several times I question myself: "How did the test get to the point in which it's so much more complex to implement than the feature itself?" - It's usually like that, don't take me wrong here, I'm just referring to extreme cases, where 3rd party libraries or even architectural decisions, make your code super hard to test.

Nevertheless, I wanted to share with you a super pragmatic and short list of tips that might help you get that tricky stubborn mock to work.

### 1. Mocking defaults

In this example, I mock a 3rd party dependency called <a href="https://github.com/ScottHamper/Cookies" target="_blank" title="javascript client-side cookie manipulation library">ScottHamper/Cookies</a>. This 3rd party exports only a default property that is a wrapper to all the cookie operations that one can perform. Internally it's actually implemented as a <a href="https://en.wikipedia.org/wiki/Singleton_pattern" target="_blank" title="wikipedia singleton pattern is a software design pattern that restricts the instantiation of a class to one single instance">singleton</a>. The trick is to use `__esModule: true` flag within the `jest.mock` call.

```javascript title="code.js"
import Cookie from 'cookies-js'

Cookie.get('key')
// ...
Cookie.set('key')
```

```javascript title="code.spec.js"
let mockGetCookie = jest.fn()
let mockSetCookie = jest.fn()

jest.mock('cookies-js', () => ({
  __esModule: true, // mock the exports
  default: {
    set: jest.fn().mockImplementation((...args) => {
      mockSetCookie(...args)
    }),
    get: jest.fn().mockImplementation((...args) => {
      mockGetCookie(...args)
    }),
  },
}))
// ...
it('should call Cookie.set', () => {
  expect(mockSetCookie).toHaveBeenCalledWith('key')
})
```

<br />

### 2. Mocking files that don't exist in the file system! 🤯

If you depend on a file that is generated at runtime, or a file that only exists in the context of the client (e.g., a runtime configuration file), this file it's not most likely in your filesystem when you trigger the test, but your program depends on it to run. There's a way to mock this nonexistent file with Jest, one just needs to make use of the mock configuration flag <a href="https://jestjs.io/docs/en/jest-object.html#jestmockmodulename-factory-options" target="_blank" title="jest docs mocks a module with jest.mock">virtual</a>.

```javascript
// runtimeConfig.json does not exist on the filesystem, but your test
// will still execute and your code will use this runtimeConfig.json file
jest.mock('./runtimeConfig.json', () => ({ env: 'QA1' }), { virtual: true })
```

<br />

### 3. Complex/large assertions on function calls

Consider the following scenario where you have a set of star wars characters
and you can fetch them according to different kinds of sorting options.

```javascript title="code.js"
const starWarsCharacters = [
  { name: 'Luke Skywalker', height: '172', mass: '77' },
  { name: 'C-3PO', height: '167', mass: '75' },
  { name: 'R2-D2', height: '96', mass: '32' },
  { name: 'Darth Vader', height: '202', mass: '136' },
  { name: 'Leia Organa', height: '150', mass: '49' },
  { name: 'Owen Lars', height: '178', mass: '120' },
  { name: 'Beru Whitesun lars', height: '165', mass: '75' },
  { name: 'R5-D4', height: '97', mass: '32' },
  { name: 'Biggs Darklighter', height: '183', mass: '84' },
  { name: 'Obi-Wan Kenobi', height: '182', mass: '77' },
]

function getCharacters(options) {
  if (options.sortedByName) {
    return sortedByName(starWarsCharacters)
  }

  if (options.sortedByHeight) {
    return sortByHeight(starWarsCharacters)
  }

  return starWarsCharacters
}
```

(**Note!** let's ignore the return value, let's say we were only interested in knowing whether or not
`sortedByName` function was called).

You might have seen the following testing code somewhere:

```javascript title="code.spec.js"
it('should call sortedByName with all the star wars characters', () => {
  const options = { sortedByName: true }

  getCharacters(options)

  // I'm exaggerating to prove a point, hope nobody actually does this
  expect(mockSortedByName).toHaveBeenCalledWith([
    { name: 'Luke Skywalker', height: '172', mass: '77' },
    { name: 'C-3PO', height: '167', mass: '75' },
    { name: 'R2-D2', height: '96', mass: '32' },
    { name: 'Darth Vader', height: '202', mass: '136' },
    { name: 'Leia Organa', height: '150', mass: '49' },
    { name: 'Owen Lars', height: '178', mass: '120' },
    { name: 'Beru Whitesun lars', height: '165', mass: '75' },
    { name: 'R5-D4', height: '97', mass: '32' },
    { name: 'Biggs Darklighter', height: '183', mass: '84' },
    { name: 'Obi-Wan Kenobi', height: '182', mass: '77' },
  ])
})
```

![morpheus alternative meme](./assets/tips-jest-unit-testing/morpheus.jpg 'morpheus alternative meme')

<cite>source: https://imgflip.com/memegenerator/31952703/morpheus</cite>

In this cases, you can make use of <a href="https://jestjs.io/docs/en/mock-function-api#mockfnmockcalls" target="_blank" title="jest docs mockFn.mock.calls">mockFn.mock.calls</a> to assert on the arguments that were passed into the function call, and you can use <a href="https://jestjs.io/docs/en/snapshot-testing#snapshot-testing-with-jest" target="_blank" title="jest docs snapshot tests are a very useful tool whenever you want to make sure your UI does not change unexpectedly">snapshot testing</a> in order to keep your test case gracefully thin.

```javascript
it('should call sortedByName with all the star wars characters', () => {
  const options = { sortedByName: true }

  getCharacters(options)

  expect(mockSortedByName.mock.calls[0]).toMatchSnapshot()
})
```

<br />

### 4. Inline require to mock large datasets

In the event of facing the ideal scenario where you need to mock a full JSON API response, you might want to place your JSON separate file and then use an inline require statement to mimic a response for a particular method.

Let's again make use of the previous example with data from the <a href="https://swapi.dev/" target="_blank" title="the star wars api all the Star Wars data you've ever wanted">SWAPI (The Star Wars API)</a>.

If you would have a static list of all characters in you program, or a mock of a response that you would
want to use within your test case, you case use an inline `require` statement (in alternative of importing the mock on the top of the file).

```javascript
it('should get sort characters', () => {
  const result = sortedByName(require('./starWarsCharacters.json'))

  expect(result).toMatchSnapshot()
})
```

<br />

### 5. Make use of async/await

It might also come the time where you need to perform some asynchronous work inside your test case, in that case, don't hesitate in recurring to <a href="https://jestjs.io/docs/en/tutorial-async#async-await" target="_blank" title="jest docs using async await">async/await</a>.

```javascript
it('get all star wars characters', async () => {
  const data = await fetchStarWarsCharacters()

  expect(data).toMatchSnapshot()
})
```

Oh, and there's also <a href="https://jestjs.io/docs/en/tutorial-async#resolves" target="_blank" title="jest docs resolves">.resolves</a>.

```javascript
it('get all star wars characters (with resolves)', () => {
  const promise = fetchStarWarsCharacters()

  return expect(promise).resolves.toMatchSnapshot()
})
```

Do you have more tips that in your opinion, fit nicely in this list? I would love to hear them.

### Updates

- I talked about this on the _JavaScript Jabber Podcast_, you can listen to the episode here: <a href="https://topenddevs.com/podcasts/javascript-jabber/episodes/jsj-411-unit-testing-jest-with-daniel-caldas" target="_blank" alt="JSJ 411: Unit Testing Jest with Daniel Caldas">JSJ 411: Unit Testing Jest with Daniel Caldas</a>
- My friend <a href="https://twitter.com/ayusharma_" target="_blank" title="Ayush Sharma twitter profile">@ayusharma\_</a> told me that I should mention <a href="https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options" target="_blank" title="The Jest Object · Jest">jest.doMock</a> in this article. So here it is:

> When using babel-jest, calls to mock will automatically be hoisted to the top of the code block. Use this method if you want to explicitly avoid this behavior.

Think of `jest.doMock` as a resource for you to mock differently the same module in various test cases that live under the same test file.

Cheers!
