---
title: 'Destructuring in JavaScript: the not so good parts'
description: 'Destructuring in JavaScript: the not so good parts'
pubDate: 2019-06-20
tags: ['javascript']
---

Generally speaking, I would say everybody loves the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment" target="_blank" title="the destructuring assignment syntax MDN web docs">destructuring assignment</a>, and for good reasons. Next, I list some of the amazing things one can achieve with destructuring in JavaScript.

#### Object destructuring

```javascript
const user = { username: 'captain', email: 'captain@email.com', age: 30 }
const { username, age } = user
```

<br />

#### Provide default values

```javascript
const user = { email: 'captain@email.com', age: 30 }
const { username = 'unknown', age } = user
// you can now use username with value 'unknown'
```

<br />

#### Renaming variables on creation

```javascript
const user = { username: 'captain', email: 'captain@email.com', age: 30 }
const { username, age: userAge } = user
// you know have age value 30 in the variable userAge
```

<br />

#### Nested object destructuring ⚠️

```javascript
const user = { username: 'captain', age: { value: 30, label: '30 years old' } }
const {
  username,
  age: { label },
} = user
// you can now use label directly
```

<br />

#### Array destructuring

```javascript
const rgb = [200, 255, 100]
const [red, green, blue] = rgb
// the variables red, green and blue match the elements order in rgb array
```

<br />

#### Works with any iterable on the right-side (e.g `Set`)

```javascript
let [a, b, c] = 'abc' // ["a", "b", "c"]
let [one, two, three] = new Set([1, 2, 3])
```

<br />

#### Swapping Variables

```javascript
let a = 1
let b = 2
;[b, a] = [a, b]
```

<br />

#### Swapping array positions

```javascript
const arr = [1, 3, 2, 4, 5]
;[arr[1], arr[2]] = [arr[2], arr[1]]
// arr is now [1, 2, 3, 4, 5]
```

<br />

#### Skipping items ⚠️

```javascript
const rgb = [200, 255, 100]
// skip the first two items
// assign the only third item to the blue variable
const [, , blue] = rgb
```

<br />

#### Nested array destructuring ⚠️

```javascript
const color = ['#FF00FF', [255, 0, 255], 'rgb(255, 0, 255)']
// use nested destructuring to assign red, green and blue
const [hex, [red, green, blue]] = color
console.log(hex, red, green, blue) // #FF00FF 255 0 255
```

<br />

#### Function parameter destructuring ⚠️

```javascript
function getUserInfo({ username, email }) {
  return `Username: ${username}; Email: ${email}`
}
const user = { username: 'captain', email: 'captain@email.com' }
const userInfo = getUserInfo(user)
```

<br />

### What's not so good here

The most significant dilemma of destructuring it's related with the fact that relies on properties of nested structures that can only be evaluated at runtime, let me give you an example.

```javascript
function addEmailToList(list, { email }) {
  if (email) {
    list.push(email)
  }
}
const list = ['a@mail.com', 'b@mail.com']
const user = undefined

addEmailToList(list, user)
// Uncaught TypeError: Cannot destructure property `email` of 'undefined' or 'null'
```

On the other hand, if you write this without destructuring, you won't make assumptions on the user, you can double check whether the given user is valid.

```javascript
function addEmailToList(list, user) {
  if (user && user.email) {
    list.push(user.email)
  }
}
const list = ['a@mail.com', 'b@mail.com']
const user = undefined

addEmailToList(list, user)
```

<br />

#### null - a catastrophe waiting to happen

Just a note, for you to be conscious that as in default assignment <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters" target="_blank" title="default function parameters allow named parameters to be initialized with default values">default parameters</a> the `null` value it's not considered false, thus you can't fall back to some default value in destructuring a property whose value is `null`.

```javascript
function formatAddress(info) {
  const { country = '-', city = '-' } = info
  return `${country}, ${city}`
}

const info = { country: 'Portugal', city: null }
const result = formatAddress(info)
// "Portugal, null" it's what you get instead of "Portugal, -"
```

Every feature above mentioned exists for you to use, but we should find a balance (as in everything else in life). Below I list a few guidelines/rules that will help you find the balance when using destructuring.

![cat kong fu balance](./assets/destructuring-the-not-so-good-parts/fat-cat-balance.jpg 'cat kong fu balance')

<cite>source: https://imgflip.com/tag/fat+cat+balance</cite>

### The 3 Golden Rules

You might have noticed some previous warning sings (⚠️) in some of the listed usages of destructuring. I left those signs there because I consider those use cases potentially harmful.

1. **Don't use nested destructuring on data that comes from any external data sources (such as REST APIs, GraphQL endpoints or files)**. You never know when these APIs change their data contracts. Hopefully all of this it's synced between teams, but sometimes we get lost on the tiny details such as that one small property in some nested object that got renamed and instead of using `snake_case` it uses now `camelCase` just because it made more sense from an aesthetic point of view. Now your marvelous single page application is burning and falling into pieces because you were unsafely accessing this property when you could have protected yourself against it.
2. **Don't use nested destructuring on function arguments that have long or complicated signatures**. It makes it super hard to understand what the actually API of the function is, and you might get breaking behavior because someone decided to use your function, but in some edge case they do not provide you the valid input for you to destruct upon.
3. **Don't use destructuring to retrieve a value if you rely on order.** I listed the possibility of skipping elements with destructuring, it might sound tempting, but you might end up again breaking your website because your simple routine relies on the access of the _Nth_ element of some inputted array. Also, you can still retrieve data out of the array, but it might be that in that position you don't get what you were expecting. If you choose this path, at this point, it should also be arguable that there's something very wrong either with your code or with the data model from where you're your reading data, use this one with care.

#### References

- <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment" target="\_blank" title="the destructuring assignment syntax MDN web docs">MDN web docs: Destructuring assignment</a>
- <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment" target="\_blank" title="medium es6 destructuring the complete guide">ES6 Destructuring: The Complete Guide</a>
- <a href="https://javascript.info/destructuring-assignment" target="\_blank" title="javascript info destructuring assignment">JAVASCRIPT.INFO: Destructuring assignment</a>
- <a href="https://github.com/getify/You-Dont-Know-JS" target="_blank" title="A book series on JavaScript">You Don't Know JS: ES6 & Beyond</a>
