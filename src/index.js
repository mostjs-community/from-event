/** @license MIT License (c) copyright 2018 original author or authors */
/** @author Sergey Samokhov */

import { currentTime } from '@most/scheduler'

// fromEvent :: (Emitter emt, Event e) => String -> emt -> Stream e
const fromEvent = (event, emitter) =>
  new FromEvent(event, emitter, 'addListener')

const fromEventPrepended = (event, emitter) =>
  new FromEvent(event, emitter, 'prependListener')

const fromEventOnce = (event, emitter) =>
  new FromEvent(event, emitter, 'once', true)

const fromEventPrependedOnce = (event, emitter) =>
  new FromEvent(event, emitter, 'prependOnceListener', true)

class FromEvent {
  constructor (event, emitter, method, once = false) {
    this.event = event
    this.emitter = emitter
    this.method = method
    this.once = once
  }

  run (sink, scheduler) {
    const send = this.once ? sendOnce : sendEver

    this.emitter[this.method](this.event, send)

    return { dispose }

    function sendEver (evt) {
      tryEvent(currentTime(scheduler), evt, sink)
    }

    function sendOnce (evt) {
      sendEver(evt)
      sink.end(currentTime(scheduler))
    }

    function dispose () {
      // still need it for `.once()` in case that first event wasn’t emitted yet
      this.emitter.removeListener(this.event, sendEver)
    }
  }
}

function tryEvent (time, event, sink) {
  try {
    sink.event(time, event)
  } catch (error) {
    sink.error(time, error)
  }
}

export {
  fromEvent,
  fromEventPrepended,
  fromEventOnce,
  fromEventPrependedOnce
}
