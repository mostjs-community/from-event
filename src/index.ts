/** @license MIT License (c) copyright 2018 original author or authors */
/** @author Sergey Samokhov */

import { currentTime } from '@most/scheduler'
import { Disposable, Scheduler, Sink, Stream, Time } from '@most/types'
import { EventEmitter } from 'events'

type SubscriptionMethod = 'addListener' | 'prependListener'

// fromEvent :: (Emitter emt, Event e) => String -> emt -> Stream e
const fromEvent = <T>(event: string, emitter: EventEmitter) =>
  FromEvent<T>(event, emitter, 'addListener')

const fromEventPrepended = (event: string, emitter: EventEmitter) =>
  FromEvent(event, emitter, 'prependListener')

function FromEvent<T> (
  event: string,
  emitter: EventEmitter,
  method: SubscriptionMethod,
): Stream<T> {

  return { run }

  function run (sink: Sink<T>, scheduler: Scheduler): Disposable {
    emitter[method](event, send)

    return ListenerDisposable(emitter, event, send)

    function send (e: T) {
      tryEvent(currentTime(scheduler), e, sink)
    }
  }
}

function ListenerDisposable<T>(
  emitter: EventEmitter,
  event: string,
  send: (e: T) => void,
): Disposable {
  return {
    dispose: () => {
      emitter.removeListener(event, send)
    }
  }
}

function tryEvent<T> (t: Time, e: T, sink: Sink<T>) {
  try {
    sink.event(t, e)
  } catch (error) {
    sink.error(t, error)
  }
}

export {
  fromEvent,
  fromEventPrepended,
  ListenerDisposable,
}
