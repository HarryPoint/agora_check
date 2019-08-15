// import homepage from './homepage';
// import login from './login';
// import user from './user';
// import base from './base';
// Use require.context to require sagas automatically
// Ref: https://webpack.github.io/docs/context.html
const context = require.context("./", false, /\.js$/);
const keys = context.keys().filter(item => item !== "./index.js");

// const model = [
//   base,
//   homepage,
//   login,
//   user
// ];

const model = keys.map(key => context(key).default);

export default model;
