import {describe, it} from 'mocha'
import * as assert from 'power-assert'

import {map, merge, runEffects, zipItems,} from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'

import { EventEmitter } from 'events'
import { fromEvent, fromEventPrepended, ListenerDisposable } from './index'


describe('@most/from-event', () => {
  let emitter: EventEmitter;
  const event = 'foo'

  before(function setUpEmitter() {
    emitter = new EventEmitter()
  })

  it('Should emit what EventEmitter emits', () => {
    const values = [7, 4, 32]
    const stream = fromEvent(event, emitter)

    const withAssert = zipItems((x, y) => assert(x === y), values, stream)

    runEffects(withAssert, newDefaultScheduler())
    values.forEach(v => emitter.emit(event, v))
  })

  it('fromEventPrepended should prepend', () => {
    const input = [7, 4, 32]
    const output = [`7`, 7, `4`, 4, `32`, 32]

    const latter = fromEventPrepended(event, emitter)
    const former = map(String, fromEventPrepended(event, emitter))
    const combined = merge(latter, former)

    const withAssert = zipItems((x, y) => assert(x === y), output, combined)

    runEffects(withAssert, newDefaultScheduler())
    input.forEach(v => emitter.emit(event, v))
  })

  it('dispose should remove listeners', () => {
    const callback = () => void 0;
    const disposable = ListenerDisposable(emitter, event, callback)

    emitter.addListener(event, callback)
    assert(emitter.listenerCount(event) === 1)

    disposable.dispose()
    assert(emitter.listenerCount(event) === 0)
  })
})
