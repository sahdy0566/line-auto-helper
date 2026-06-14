const startedAt = new Date();

const state = {
  handledEvents: 0,
  repliedMessages: 0,
  ignoredEvents: 0,
  broadcasts: 0,
  errors: 0,
  lastEventAt: null,
  lastErrorAt: null,
  eventTypes: {},
  matchedRules: {}
};

function increment(map, key) {
  const normalizedKey = key || 'unknown';
  map[normalizedKey] = (map[normalizedKey] || 0) + 1;
}

export const metrics = {
  recordEvent(event) {
    state.handledEvents += 1;
    state.lastEventAt = new Date().toISOString();
    increment(state.eventTypes, event?.type);
  },

  recordReply(ruleName) {
    state.repliedMessages += 1;
    increment(state.matchedRules, ruleName || 'built-in');
  },

  recordIgnoredEvent() {
    state.ignoredEvents += 1;
  },

  recordBroadcast() {
    state.broadcasts += 1;
  },

  recordError() {
    state.errors += 1;
    state.lastErrorAt = new Date().toISOString();
  },

  snapshot() {
    return {
      startedAt: startedAt.toISOString(),
      uptimeSeconds: Math.round((Date.now() - startedAt.getTime()) / 1000),
      ...state
    };
  }
};
