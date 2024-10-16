---
title: 'Guide to custom React Hooks (wrap the MutationObserver)'
description: 'Guide to custom React Hooks with MutationObserver'
pubDate: 2021-07-21
tags: ['javascript', 'react']
---

<!-- canonicalUrl: "https://blog.logrocket.com/guide-to-custom-react-hooks-with-mutationobserver/" -->

This article was originally published by <a href="https://logrocket.com/" target="_blank" title="LogRocket Modern Frontend Monitoring and Product Analytics">LogRocket</a>. You can checkout the original post <a href="https://blog.logrocket.com/guide-to-custom-react-hooks-with-mutationobserver/" target="_blank" title="Guide to custom React Hooks with MutationObserver LogRocket Blog">here</a>.

With the introduction of React Hooks, the amount of shareable code within React codebases has exploded. Because Hooks are thin APIs on top of React, developers can collaborate by attaching reusable behavior to components and segregating these behaviors into smaller modules.

While this is similar to how JavaScript developers abstract business logic away in vanilla JavaScript modules, Hooks provide more than pure JavaScript functions. Instead of taking data in and out, developers can stretch the spectrum of possibilities of what can happen inside a Hook.

For instance, developers can:

- Mutate and manage a piece of state for a specific component or an entire application
- Trigger side effects on a page, like changing the title of a browser tab
- Rectify external APIs by tapping into React components’ lifecycle with Hooks

In this post we’ll explore the latter possibility. As a case study, we’ll abstract the `MutationObserver` API in a custom React Hook, demonstrating how we can build robust, shareable pieces of logic in a React codebase.

We’ll create a dynamic label that updates itself to indicate how many items we have in a list. Instead of using the provided React state array of elements, we’ll use the [MutationObserver API](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) to detect added elements and update the label accordingly.

!['Update the dynamic label to count the number of fruits in the list'](./assets/guide-to-custom-react-hooks-with-mutationobserver/fruits-example.gif 'Update the dynamic label to count the number of fruits in the list')

<cite>source: https://blog.logrocket.com/guide-to-custom-react-hooks-with-mutationobserver/</cite>

## Implementation overview

The following code is a simple component that renders our list. It also updates a counter value that represents the number of fruits currently in the list:

```javascript
export default function App() {
  const listRef = useRef()
  const [count, setCount] = useState(2)
  const [fruits, setFruits] = useState(['apple', 'peach'])
  const onListMutation = useCallback(
    (mutationList) => {
      setCount(mutationList[0].target.children.length)
    },
    [setCount],
  )

  useMutationObservable(listRef.current, onListMutation)

  return (
    <div>
      <span>{`Added ${count} fruits`}</span>
      <br />
      <button onClick={() => setFruits([...fruits, `random fruit ${fruits.length}`])}>Add random fruit</button>
      <ul ref={listRef}>
        {fruits.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </div>
  )
}
```

We want to trigger a callback function whenever our `list` element is mutated. Within the callback we refer to, the element’s children give us the number of elements in the list.

## Implementing the `useMutationObservable` custom Hook

Let’s look at the integration point:

```javascript
useMutationObservable(listRef.current, onListMutation)
```

The above `useMutationObservable` custom Hook abstracts the necessary operations to observe changes on the element passed as the first parameter. It then runs the callback passed as the second parameter whenever the target element changes.

Now, let’s implement our `useMutationObservable` custom Hook.

In the Hook, there are a number of boilerplate operations to understand. First, we must provide a set of options that comply with the `MutationObserver` API.

Once a `MutationObserver` instance is created, we must call `observe` to listen for changes in the targeted DOM element.

When we no longer need to listen to the changes, we must call `disconnect` on the observer to clean up our subscription. This must happen when the `App` component unmounts:

```javascript
const DEFAULT_OPTIONS = {
  config: { attributes: true, childList: true, subtree: true },
}
function useMutationObservable(targetEl, cb, options = DEFAULT_OPTIONS) {
  const [observer, setObserver] = useState(null)

  useEffect(() => {
    const obs = new MutationObserver(cb)
    setObserver(obs)
  }, [cb, options, setObserver])

  useEffect(() => {
    if (!observer) return
    const { config } = options
    observer.observe(targetEl, config)
    return () => {
      if (observer) {
        observer.disconnect()
      }
    }
  }, [observer, targetEl, options])
}
```

All the above work, including initializing the `MutationObserver` with the right parameters, observing changes with the call to `observer.observe`, and cleaning up with `observer.disconnect`, are abstracted away from the client.

Not only do we export functionality, but we also clean up by hooking into the React components’ lifecycle and by leveraging cleanup callbacks on effect Hooks to tear down the `MutationObserver` instance.

Now that we have a functional and basic version of our Hook, we can think about improving its quality by iterating on its API and enhancing the developer experience around this shareable piece of code.

### Input validation and development

One important aspect when designing custom React Hooks is input validation. We must be able to communicate to developers when things are not running smoothly or a certain use case is hitting an edge case.

Usually, development logs help developers understand unfamiliar code to adjust their implementation. Likewise, we can enhance the above implementation by adding runtime checks and comprehensive warning logs to validate and communicate issues to other developers:

```javascript
function useMutationObservable(targetEl, cb, options = DEFAULT_OPTIONS) {
  const [observer, setObserver] = useState(null)

  useEffect(() => {
    // A)
    if (!cb || typeof cb !== 'function') {
      console.warn(`You must provide a valid callback function, instead you've provided ${cb}`)
      return
    }
    const { debounceTime } = options
    const obs = new MutationObserver(cb)
    setObserver(obs)
  }, [cb, options, setObserver])
  useEffect(() => {
    if (!observer) return
    if (!targetEl) {
      // B)
      console.warn(`You must provide a valid DOM element to observe, instead you've provided ${targetEl}`)
    }
    const { config } = options
    try {
      observer.observe(targetEl, config)
    } catch (e) {
      // C)
      console.error(e)
    }
    return () => {
      if (observer) {
        observer.disconnect()
      }
    }
  }, [observer, targetEl, options])
}
```

In this example, we’re checking that a callback is passed as a second argument. This API check at runtime can easily alert the developer that something is wrong on the caller side.

We can also see whether the provided DOM element is invalid with an erroneous value provided to the Hook at runtime or not. These are logged together to inform us to quickly resolve the issue.

And, if `observe` throws an error, we can catch and report it. We must avoid breaking the JavaScript runtime flow as much as possible, so by catching the error, we can choose to either log it or report it depending on the environment.

### Extensibility via configuration

If we want to add more capabilities to our Hook, we should do this in a retro-compatible fashion, such as an opt-in capability that has little or no friction towards its adoption.

Let’s look at how we can optionally debounce the provided callback function so callers can specify an interval of time when no other changes in the target element trigger. This runs the callback once rather than running the same amount of times the element or its children mutated:

```javascript
import debounce from "lodash.debounce";

const DEFAULT_OPTIONS = {
  config: { attributes: true, childList: true, subtree: true },
  debounceTime: 0
};
function useMutationObservable(targetEl, cb, options = DEFAULT_OPTIONS) {
  const [observer, setObserver] = useState(null);
  useEffect(() => {
    if (!cb || typeof cb !== "function") {
      console.warn(
        `You must provide a valida callback function, instead you've provided ${cb}`
      );
      return;
    }
    const { debounceTime } = options;
    const obs = new MutationObserver(
      debounceTime > 0 ? debounce(cb, debounceTime) : cb
    );
    setObserver(obs);
  }, [cb, options, setObserver]);
  // ...
```

This is handy if we must run a heavy operation, such as triggering a web request, ensuring it runs the minimum number of times possible.

Our `debounceTime` option can now pass into our custom Hook. If a value bigger than `0` passes to `MutationObservable`, the callback delays accordingly.

With a simple configuration exposed in our Hook API, we allow other developers to debounce their callbacks which can result in a more performant implementation given that we might drastically reduce the number of times the callback code gets executed.

Of course, we can always debounce the callback on the client side, but this way we enrich our API and make the caller-side implementation smaller and declarative.

### Testing

Testing is an essential part of developing any kind of shared capability. It helps us ensure a certain level of quality for generic APIs when they are heavily contributed to and shared.

The [guide to testing React Hooks](https://blog.logrocket.com/a-quick-guide-to-testing-react-hooks-fa584c415407/) has expansive detail around testing that can be implemented into this tutorial.

### Documentation

Documentation can level up the quality of custom Hooks and make it developer-friendly.

But even when writing plain JavaScript, [JSDoc documentation](https://jsdoc.app/) can be written for custom hook APIs to ensure the Hook passes the right message to developers.

Let’s focus on the `useMutationObservable` function declaration and how to add formatted JSDoc documentation to it:

```javascript
/**
  * This custom hooks abstracts the usage of the Mutation Observer with React components.
  * Watch for changes being made to the DOM tree and trigger a custom callback.
  * @param {Element} targetEl DOM element to be observed
  * @param {Function} cb callback that will run when there's a change in targetEl or any
  * child element (depending on the provided options)
  * @param {Object} options
  * @param {Object} options.config check \[options\](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe)
  * @param {number} [options.debounceTime=0] a number that represents the amount of time in ms
  * that you which to debounce the call to the provided callback function
  */
function useMutationObservable(targetEl, cb, options = DEFAULT_OPTIONS) {
```

Writing this is not only useful for documentation, but it also leverages IntelliSense capabilities that autocomplete Hook usage and provide spot information for the Hook’s parameters. This saves developers a few seconds per usage, potentially adding up to hours wasted on reading through the code and trying to understand it.

## Conclusion

With different kinds of custom Hooks we can implement, we see how they integrate extrinsic APIs into the React world. It’s easy to integrate state management within Hooks and run effects based on inputs from components using the Hook.

Remember that to build quality Hooks, it’s important to:

- Design easy-to-use, declarative APIs
- Enhance the development experience by checking for proper usage and logging warnings and errors
- Expose features through configurations, such as the `debounceTime` example
- Ease Hook usage by writing JSDoc documentation

You can check the [full implementation of the custom React hook here](https://codepen.io/danielcaldas/pen/BaWPWEw).
