import {describe, it} from 'mocha'
import * as assert from 'power-assert'

import { zipItems, runEffects } from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'

import { EventEmitter } from 'events'
import { fromEvent } from '../src'


describe('@most/from-event', () => {
  let emitter: EventEmitter;

  before(function setUpEmitter() {
    emitter = new EventEmitter()
  })

  it('Should emit what EventEmitter emits', () => {
    const event = 'foo'
    const values = [7, 4, 32]
    const stream = fromEvent(event, emitter)

    const withAssert = zipItems((x, y) => assert(x === y), values, stream)

    runEffects(withAssert, newDefaultScheduler())

    values.forEach(v => emitter.emit(event, v))
  })
})
