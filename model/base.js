const isPro = false;

const model = {
  namespace: "base",
  state: {
    // 防水墙验证码id
    tencentCaptchaAppId: "2020294435",
    // 是否是正式服
    isPro,
    // 深网id
    agoraId: isPro
      ? "1f97626a3167462589c9d4e0acd63925"
      : "58fffcf1703c435a9a4545192c76f1fd"
  }
};

export default model;
