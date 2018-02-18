# Node-compatible events for [mostjs](https://github.com/mostjs/)

A starting point for new `@most` packages.

### Install

```sh
npm install --save @hoichi/from-event
```

## API

### fromEvent

#### fromEvent :: (Emitter emt, Event e) => String -> emt -> Stream e

Given an event emitter, return a stream of events:

```js
const stream = fromEvent(eventName, emitter);
```

### fromEventPrepended

#### fromEventPrepended :: (Emitter emt, Event e) => String -> emt -> Stream e

Same as above, but adds the stream gets the events first (uses [`prependListener`](https://nodejs.org/api/events.html#events_emitter_prependlistener_eventname_listener)).

