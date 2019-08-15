const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

const model = {
  namespace: 'user',
  state: {
    name: 'hopperhuang',
    count: 0,
    init: false,
  },
  reducers: {
    set(state, {payload}) {
      return { ...state, ...payload, init: true };
    },
  },
  effects: {
    *init(action, { put }) {
      yield delay(2000);
      yield put({ type: 'set', delta: 1 });
    },
  },
};

export default model;