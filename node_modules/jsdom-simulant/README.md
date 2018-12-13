# jsdom-simulant

**Simulated DOM events for automated testing of JSDOM elements**

This is a fork of [simulant.js](https://github.com/Rich-Harris/simulant) that has been modified so that it does not have load-time global dependencies.

In this fork, the function entry point requires a reference to the window object if it's called directly. Otherwise, the fire method will find the window and document that are referenced by element.ownerDocument and element.ownerDocument.defaultView.

This is how we instantiate and provide a new window for every single test method.

## What's this for?

Sometimes you need to create fake DOM events so that you can test the parts of your app or library that depend on user input. But doing so is a royal pain in the arse:

```js
// WITHOUT SIMULANT.JS
event = new MouseEvent('mousemove', {
  bubbles: true,
  cancelable: true,
  relatedTarget: previousNode
});

element.dispatchEvent(event);

// WITH SIMULANT.JS
simulant.fire(element, 'mousemove', {relatedTarget: previousNode});
```

Simulant was forked to make automated testing of [Nomplate](https://github.com/lukebayes/nomplate) more pleasant.


## Installation

```bash
npm install jsdom-simulant
```

## Usage

```js
// Create a simulated event
event = simulant(window, 'click');

// Create a simulated event with parameters, e.g. a middle-click
event = simulant(window, 'click', {button: 1, which: 2});

// Fire a previously created event
element = document.getElementById('some-id');
simulant.fire(element, event);

// Create an event and fire it immediately
simulant.fire(element, 'click');
simulant.fire(element, 'click', {button: 1, which: 2});

```


## Limitations

Normally, events have side-effects - a click in a text input will focus it, a mouseover of an element will trigger its hover state, and so on. When creating events programmatically, these side-effects don't happen - so your tests shouldn't expect them to. For example you shouldn't fire simulated keypress events at an input element and expect its value to change accordingly.

There are exceptions - a click event on a checkbox input will cause a secondary change event to be fired, for example.


## Building and testing

Simulant uses [jsdom](https://github.com/tmpvar/jsdom) for testing.

To build the library, do `npm run build`.

To test the library using jsdom, do `npm test`.

To test the library in browsers, do `npm start`. This will build the library (and watch the source files for changes) and serve a simple test page to [localhost:4567](http://localhost:4567).


## License

Copyright (c) 2013-16 [Rich Harris](http://rich-harris.co.uk) ([@rich_harris](http://twitter.com/rich_harris)).
Released under an MIT license.

Forked and updated by Luke Bayes in April of 2017

