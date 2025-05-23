---
title: Functional bits
description: Functional bits
pubDate: 2020-03-30
tags: ['functional-programming', 'javascript']
---

Here are some of my top favorite personal utilities to make your programming style more functional. They increase the readability of my code and help me transforming those less pretty pieces of logic into something that I'm proud of and that I can confidently change by merely modifying a line of code (or maybe less).

### The bits

I list below a series of utilities together with a short background/motivation followed by an example where I demonstrate both the imperative and functional approaches, where the functional approach makes use of the respective utility. You can also find a rough implementation of the utility by the end of its section.

#### tap

Inspired by the <a href="https://rxjs-dev.firebaseapp.com/api/operators/tap" target="_blank" title="RxJS tap operator">RxJS tap operator</a>. With `tap`, you can perform non-intrusive side effects. By non-intrusive, I mean that you can leverage the power of a functional style of coding to perform a task, and simultaneously deliver a side effect (e.g., `console.log`) within your approach. Let's have a look.

##### Imperative

```javascript
let agesSum = 0
const totalNumberOfUsers = users.length

for (const user of users) {
  const birthdate = user.birthdate * 1000 // convert to milliseconds
  console.log(birthdate)
  const userAge = new Date().getFullYear() - new Date(birthdate).getFullYear()
  agesSum += userAge
}

const meanAge = agesSum / totalNumberOfUsers

console.log(`Users are in average ${meanAge} years old.`)
```

<br />

##### Functional with `tap`

```javascript
const sum = (arr) => arr.reduce((s, n) => s + n, 0)
const mean = (arr) => sum(arr) / arr.length
const meanAge = mean(
  users
    .map((user) => user.birthdate * 1000) // convert to milliseconds
    .tap((birthdates) => console.log(birthdates)) // logs array of birthdates
    .map((birthdate) => new Date().getFullYear() - new Date(birthdate).getFullYear()),
)

console.log(`Users are in average ${meanAge} years old.`)
```

I give you that right now, it's far more understandable how you would log something in between your imperative approach. You can inspect each age individually as the code progresses. But as you can see in the functional approach analyzing the birthdates at a particular stage of your data transformations is also possible! Below the implementation of `tap`. Warning, this approach extends the `Array.prototype`, use at your own risk.

##### Implementing `tap`

```javascript
Object.defineProperty(Array.prototype, 'tap', {
  value: function (fn) {
    fn(this)
    return this
  },
  writable: true,
})
```

<br />

#### and &amp; or

Did it ever happen to you ending up with an `if` statement that needs to be broken down into several LOC <small>(<i>Lines Of Code</i>)</small> because it is too long, and the linter starts crying about it? There's an elegant solution for that, and it's pure composition, let me share it with you.

##### Imperative

```javascript
const usersEligibleForSurvey = []

for (const user of users) {
  const age = getAgeFromUnixTimestamp(user.birthdate)

  if (user.gender === 'female' && age < 33 && user.location.country === 'denmark') {
    usersEligibleForSurvey.push(user)
  }
}
```

<br />

##### Functional with `and`

```javascript
const isFemale = (user) => user.gender === 'female'
const isBelowAge = (age) => (user) => getAgeFromUnixTimestamp(user.birthdate) < age
const isFromCountry = (country) => (user) => user.location.country === country
const isUserEligibleForSurvey = and(isFemale, isBelowAge(33), isFromCountry('denmark'))

const usersEligibleForSurvey = users.filter(isUserEligibleForSurvey)
```

Instead of a single if statement, you now have a reusable function. More than that, you can easily plugin and out any criteria to exclude users from the survey! Let's say you had a very complex function that, given a specific user would check some rules against the postcode to exclude certain areas of the country. Given you have that function, append it into the `and` arguments. That's all! `isUserEligibleForSurvey` is now checking for the postcode as well, you're good to go.
`and` is an excellent example of why we describe this kind of approach as declarative programming, **you're expressing the logic without describing its control flow**.

<br />

##### Implementing `and`

```javascript
function and(...fns) {
  const n = fns.length

  return (...args) => {
    for (let i = 0; i < n; i++) {
      const fn = fns[i]
      const result = fn(...args)
      if (!result) {
        return false
      }
    }

    return true
  }
}
```

More functional, less efficient, since it executes all the predicates.

```javascript
const and =
  (...fns) =>
  (...args) =>
    fns.reduce((prev, fn) => prev && fn(...args))
```

<br />

#### select &amp; drop

RxJS has <a href="https://rxjs-dev.firebaseapp.com/api/operators/pluck" target="_blank" title="RxJS operators, pluck">pluck</a>, lodash has <a href="https://rxjs-dev.firebaseapp.com/api/operators/pluck" target="_blank" title="Lodash pick">pick</a>. I find `select` a more concise and name. Projecting properties from objects is a prevalent task. The fact that JavaScript has destructuring built-in is a live proof of that. You could use destructuring to project properties; <a href="https://danielcaldas.github.io/posts/destructuring-not-so-good-parts/" target="_blank" title="Destructuring in JavaScript: the not so good parts">it's often more tedious, and it's not suitable for every occasion</a> to use within a chain of operations.

##### Imperative

```javascript
let countries = new Set()

for (const user of users) {
  countries.add(user.location.country)
}

console.log(Array.from(countries).join(', '))
```

<br />

##### Functional with `select`

```javascript
const countries = new Set(users.map(select('location.country')))

console.log(Array.from(countries).join(', '))
```

In the functional approach, `select` extracts from each user the `country` field located within the `location` object.

Again, with the functional approach, we shift towards a more declarative style.
There's also an "opposite" of `select`, which is `drop`. In short, instead of picking up the properties of an object, you declare which properties you want to drop.

##### Implementing `select`

```javascript
// something similar to lodash/get
function get(o, query, defaultValue = undefined) {
  if (!query) return defaultValue
  const path = query.split('.')
  let pointer = o

  for (const k of path) {
    pointer = pointer[k]
    if (!pointer) return defaultValue
  }

  return pointer
}

/**
 * When there's only a single property in `keys` the value is not wrapped in an object e.g.
 * > const city = select('location.city')(users[0])
 * > console.log(city)
 * > 'staphorst'
 *
 * Nested paths are flatten at the top level e.g.
 * > const cityCountry = select('location.city', 'location.country')(users[0])
 * > console.log(cityCountry)
 * > { 'location.city': 'staphorst', 'location.country': 'netherlands' }
 */
const select =
  (...keys) =>
  (o) =>
    keys.length === 1
      ? get(o, keys[0])
      : keys.reduce((acc, k) => {
          acc[k] = get(o, k)
          return acc
        }, {})
```

<br />

#### pipe

`pipe` would be something like <a href="https://lodash.com/docs/4.17.15#flow" target="_blank" title="lodash flow">lodash/flow</a> where you can take _N_ functions where each performs a unique task and combine them in chain where data flows from left to right. The output of a function within the pipe is the input to the next one (and so on). It's good to use something like `pipe` when you need to perform a series of data transformations on a given input. Let's look at the following example, where we want to format our `users` data in a way that is friendly to be consumed by the UI, but first, there are some requirements that need to be met in terms of the shape of each user Object individually.
The goal is to render a table with the name (first name + last name), age, and country (with the first character capitalized) so that the Marketing department of the company _X_ can have a look at their users' data nicely formatted.

First let me introduce some shared utilities to do some work on our user Object, we use them in both the imperative and functional approach for ease of comparison.

```javascript
// returns number representable of the user age
function getUserAge(user) {
  return new Date().getFullYear() - new Date(user.birthdate * 1000).getFullYear()
}
// returns the name of the user's country (capitalized)
function formatCountry(user) {
  let tmp = Array.from(user.location.country)
  tmp[0] = tmp[0].toUpperCase()
  return tmp.join('')
}
// puts together first & last name in the same string
function getFirstAndLastName(user) {
  return `${user.first_name} ${user.last_name}`
}
```

Now, let's dive in and translate those requirements into code.

##### Imperative

```javascript
const formattedUsers = []

for (const user of users) {
  const formattedUser = {
    name: getFirstAndLastName(user),
    age: getUserAge(user),
    country: formatCountry(user),
  }

  formattedUsers.push(formattedUser)
}

console.log(formattedUsers) // data ready for the UI!
```

<br />

##### Functional with `pipe`

```javascript
const formatUser = pipe(
  (user) => ({ ...user, name: getFirstAndLastName(user) }),
  (user) => ({ ...user, age: getUserAge(user) }),
  (user) => ({ ...user, country: formatCountry(user) }),
  select('name', 'age', 'country'),
)
const formattedUsers = users.map(formatUser)

console.log(formattedUsers) // data ready for the UI!
```

<small>
  The only small *trick* here is that I had to feed the initial <code>user</code> down through the <code>pipe</code>,
  and we incrementally append new data properties to a newly created user Object (original <code>user</code> is not
  mutated).
</small>

As you can see, using `pipe`, you have a clear separation of concerns in terms of what transformations run against your input, again at any point in time, you can plug in or out a new transformation function from the `pipe` with minimal effort.

##### Implementing `pipe`

```javascript
const pipe =
  (...fns) =>
  (...args) =>
    fns.reduce((prev, fn) => fn(prev), ...args)
```

<br />

### Takeaways

Web applications are complex, meaning your code becomes inherently more complicated. Functional constructs do the trick for me when it comes to rearranging my logic into a compact implementation that may read like plain English. But besides a potential big win on **readability** there are other advantageous things in the package:

- **Functions are more natural to reason** - "divide and conquer" one of the most underrated statements that put you on the road to <a href="http://cleancoder.com/products" target="_blank" rel="nofollow" title="Uncle Bob Martin">clean code</a>. Your functions will execute one task and one task only, and do it well. You name the smaller functions of your program with intent.
- **Code resilience** - you'll notice that your code becomes more **bulletproof**. Splitting your code into smaller functions and compose them at a higher level of your implementation will make your system more **robust**, more **comfortable to test**, **achieving the same with less LOC**.
- **Composability** - your code becomes more composable, allowing you to **plug&play functions to promptly tweak your implementation**. You'll pull existing functions together to compose them into more intricate ones that will get the job done and still read comfortably.
- **Performance?** - From the example above, when implementing the `and` utility, we saw that the functional approach is not able to return earlier as the imperative approach did. There's no way to early break from functional constructs such as `.map` or `.reduce` (which is a good thing! no, side-effects allowed!). Don't trick yourself in thinking that such detail dictates overall better performance for an imperative approach. Sometimes the benefits of making it **readable** and composable through more trivial functions will bring you, your team, and your product far more significant advantages than speeding up the JavaScript execution by a few fractions of a millisecond.

On the "not so good side" of things, **the biggest challenge this coding style faces today is debugability**. _"Oh, but they say also debugging becomes easier!"_ I don't think so, but let me clarify what I mean by _"debugability"_. One on hand **code is more natural to track because there's much structure to it, yes**. **But** on the other hand, **diving into specific detail of the implementation becomes hard** because you kind of need to perform **"reverse engineering" of the compact code** to perform a log in the console or other adding a breakpoint (use `tap`, he's your friend there!).

I think these tools are good ones to spark your interest in a more functional coding style and maybe if you see fit dive into libraries like <a href="https://github.com/lodash/lodash/wiki/FP-Guide" target="_blank" title="lodash FP guide on GitHub">lodash/fp</a>.

Another tip that I would like to drop is that when adopting a functional architecture **it's good to keep in mind some good practices when it comes to design functions**. I found <a href="http://cleancoder.com/products" target="_blank" rel="nofollow" title="Uncle Bob Martin">Clean Code</a> (by <a href="http://www.cleancoder.com/products" target="_blank" title="Uncle Bob Martin | cleancoder.com">Uncle Bob Martin</a>) to be an awesome resource that helped me laying down some ground rules when it comes to designing function APIs that are clean and scalable.

Do you find these few bits of the functional world beneficial? Give them a try!

If you fell like going through the above examples by executing them to get a better understanding of how they're working, you can use the below dataset as input.

<Accordion summary="Dataset used for code examples">

```javascript
const users = [
  {
    email: 'melany.wijngaard@example.com',
    gender: 'female',
    phone_number: '(727)-033-9347',
    birthdate: 608022796,
    location: {
      street: '2431 predikherenkerkhof',
      city: 'staphorst',
      state: 'gelderland',
      postcode: 64265,
    },
    username: 'bigpeacock217',
    password: 'eagle',
    first_name: 'melany',
    last_name: 'wijngaard',
    title: 'miss',
  },
  {
    email: 'nanna.pedersen@example.com',
    gender: 'female',
    phone_number: '43672992',
    birthdate: 591428535,
    location: {
      street: '2177 fåborgvej',
      city: 'aarhus',
      state: 'syddanmark',
      postcode: 87547,
    },
    username: 'purpleduck599',
    password: 'davids',
    first_name: 'nanna',
    last_name: 'pedersen',
    title: 'ms',
  },
  {
    email: 'amelia.mercier@example.com',
    gender: 'female',
    phone_number: '(168)-747-5950',
    birthdate: 1132298571,
    location: {
      street: '7454 rue duquesne',
      city: 'echandens-denges',
      state: 'vaud',
      postcode: 3811,
    },
    username: 'whitefrog218',
    password: 'forest',
    first_name: 'amelia',
    last_name: 'mercier',
    title: 'madame',
  },
]
```

</Accordion>
