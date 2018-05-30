(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global['from-event'] = {})));
}(this, (function (exports) { 'use strict';

  /** @license MIT License (c) copyright 2010-2016 original author or authors */

  // Read the current time from the provided Scheduler
  var currentTime = function currentTime(scheduler) {
    return scheduler.currentTime();
  };

  /** @license MIT License (c) copyright 2018 original author or authors */
  // fromEvent :: (Emitter emt, Event e) => String -> emt -> Stream e
  var fromEvent = function (event, emitter) {
      return FromEvent(event, emitter, 'addListener');
  };
  var fromEventPrepended = function (event, emitter) {
      return FromEvent(event, emitter, 'prependListener');
  };
  function FromEvent(event, emitter, method) {
      return { run: run };
      function run(sink, scheduler) {
          emitter[method](event, send);
          return ListenerDisposable(emitter, event, send);
          function send(e) {
              tryEvent(currentTime(scheduler), e, sink);
          }
      }
  }
  function ListenerDisposable(emitter, event, send) {
      return {
          dispose: function () {
              emitter.removeListener(event, send);
          }
      };
  }
  function tryEvent(t, e, sink) {
      try {
          sink.event(t, e);
      }
      catch (error) {
          sink.error(t, error);
      }
  }

  exports.fromEvent = fromEvent;
  exports.fromEventPrepended = fromEventPrepended;
  exports.ListenerDisposable = ListenerDisposable;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
