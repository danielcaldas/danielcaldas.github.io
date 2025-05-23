---
title: 'Browser polyfill madness, Mozilla and IE'
description: 'Browser polyfill madness, Mozilla and IE'
pubDate: 2019-07-20
tags: ['javascript']
---

Recently I have experienced the real pain of _polyfilling_ the innocent looking <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger" target="_blank" title="mdn web docs number is safe integer">Number.isSafeInteger</a> method.

<small>
  <a
    href="https://developer.mozilla.org/en-US/docs/Glossary/Polyfill"
    target="_blank"
    title="mdn web docs glossary polyfill"
  >
    What is a polyfill?
  </a>
</small>

> A polyfill is a piece of code (usually JavaScript on the Web) used to provide modern functionality on older browsers that do not natively support it.

It happened at work; something was not working for IE 11, and there was a lot of culprit pull requests, but one in particular sparkled my attention. In this pull request, there was a line of code that was using <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger" target="_blank" title="mdn web docs number is safe integer">Number.isSafeInteger</a>.

```javascript
return arr.filter(Number.isSafeInteger)
```

Nothing special, until I checked the famous browser compatibility tables of <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger#Browser_compatibility" target="_blank" title="mdn web docs">MDN web docs</a> to confirm that my theory was real, `Number.isSafeInteger` is not supported in <a href="https://en.wikipedia.org/wiki/Internet_Explorer" target="_blank" title="wikipedia internet explorer microsoft browser">IE</a>, oh snap.

I ran to the polyfill section, I copied out the recommended <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger#Polyfill" target="_blank" title="mdn web docs polyfill section for method number is safe integer">polyfill code</a>, and I victoriously announced to my team, "I found it!".

```javascript
Number.isSafeInteger =
  Number.isSafeInteger ||
  function (value) {
    return Number.isInteger(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER
  }
```

Not that simple, it turns out that <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger" target="_blank" title="mdn web docs number is integer">Number.isInteger</a> was also not supported and we had no polyfill again for it. I did not want to commit the same mistake twice, so this time I double-checked the source code of the polyfill for `Number.isInteger`.

```javascript
Number.isInteger =
  Number.isInteger ||
  function (value) {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value
  }
```

So guess what? Yes, <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite" target="_blank" title="mdn web docs number is finite">Number.isFinite</a> is also not supported in IE!

<br />
<br />

```javascript
if (Number.isFinite === undefined)
  Number.isFinite = function (value) {
    return typeof value === 'number' && isFinite(value)
  }
```

You maybe think that's it, he finished with _polyfilling_ madness. I thought the same, I don't blame you. Do you remember the original method that I was desperately trying to polyfill?

```javascript
Number.isSafeInteger =
  Number.isSafeInteger ||
  function (value) {
    return Number.isInteger(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER
  }
```

It happens that <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER" target="_blank" title="mdn web docs number max safe integer">Number.MAX_SAFE_INTEGER</a> is also not supported on IE, so I had to polyfill that as well.

```javascript
if (!Number.MAX_SAFE_INTEGER) {
  Number.MAX_SAFE_INTEGER = 9007199254740991 // Math.pow(2, 53) - 1;
}
```

<br />

### Lessons

1. Whenever you spot unconventional/_non-frequently-used_ methods in your **code reviews**, scream to the world that your peer might be breaking something, ask them to **consult the documentation for browser compatibility**.
2. **Don't blindly trust MDN web docs Polyfill sections**. Unfortunately, they don't
   warn you about whether or not the implementation of the polyfill needs to be _polyfilled_ itself.
