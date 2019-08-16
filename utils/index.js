import axios from "axios";
import orgMoment from "moment";
import "moment/locale/zh-cn";
export { default as WithDva } from "./withDva";
export { default as SignalingClient } from "./signalingClient";
import { Message } from "antd";
export { default as lodash } from "lodash";
export { default as classnames } from "classnames";

orgMoment.locale("zh-cn");
export const moment = orgMoment;
export const ajax = option => {
  let ins = axios.create({
    baseURL: "/api"
  });
  ins.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      if (
        error.response &&
        error.response.config.url.indexOf("error=no") === -1
      ) {
        let dt = error.response.data;
        if (Object.prototype.toString.call(dt) === "[object Object]") {
          if (dt.field === "*") {
            // Message.error(`${error.response.status} ${dt.err_code}: ${dt.msg ? dt.msg : error.response.statusText}`)
            if (dt.err_code === "UN_LOGIN") {
              // 自动弹出登录弹窗
              // store.dispatch(actionToLogin());
            } else {
              Message.error(`${dt.msg ? dt.msg : error.response.statusText}`);
            }
          } else {
            Message.error(dt.msg ? dt.msg : error.message);
          }
        } else {
          // Message.error(`${error.response.status}: ${error.response.statusText}`)
          Message.error(`${error.response.statusText}`);
        }
      } else {
        // Message.error(error.toString())
      }
      return Promise.reject(error);
    }
  );
  return ins(option);
};
export const createChannelMsg = (type, data) => {
  return JSON.stringify({
    type,
    data
  });
};
