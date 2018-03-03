/** @license MIT License (c) copyright 2018 original author or authors */
/** @author Sergey Samokhov */

import { currentTime } from '@most/scheduler'

// fromEvent :: (Emitter emt, Event e) => String -> emt -> Stream e
const fromEvent = (event, emitter) =>
  FromEvent(event, emitter, 'addListener')

const fromEventPrepended = (event, emitter) =>
  FromEvent(event, emitter, 'prependListener')

function FromEvent (event, emitter, method) {
  return { run }

  function run (sink, scheduler) {
    emitter[method](event, send)

    return { dispose }

    function send (evt) {
      tryEvent(currentTime(scheduler), evt, sink)
    }

    function dispose () {
      emitter.removeListener(event, send)
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
