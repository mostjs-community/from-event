/** @license MIT License (c) copyright 2018 original author or authors */
/** @author Sergey Samokhov */

import { currentTime } from '@most/scheduler'

// fromEvent :: (Emitter emt, Event e) => String -> emt -> Stream e
const fromEvent = (event, emitter) =>
  new FromEvent(event, emitter, 'addListener')

const fromEventPrepended = (event, emitter) =>
  new FromEvent(event, emitter, 'prependListener')

class FromEvent {
  constructor (event, emitter, method) {
    this.event = event
    this.emitter = emitter
    this.method = method
  }

  run (sink, scheduler) {
    this.emitter[this.method](this.event, send)

    return { dispose }

    function send (evt) {
      tryEvent(currentTime(scheduler), evt, sink)
    }

    function dispose () {
      this.emitter.removeListener(this.event, send)
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
  fromEventPrepended
}
