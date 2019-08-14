const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

const model = {
  namespace: 'login',
  state: {
    visible: false
  },
  reducers: {
    changeVisible(state, payload) {
      const { visible } = payload;
      return { ...state, visible};
    },
  },
  effects: {
    *init(action, { put }) {
      yield delay(2000);
      yield put({ type: 'changeVisible', visible: true });
    },
  },
};

export default model;