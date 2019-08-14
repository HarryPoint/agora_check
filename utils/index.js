import axios from "axios";
import orgMoment from "moment";
import "moment/locale/zh-cn";
export { default as withDva } from './withDva';
export { default as SignalingClient } from './signalingClient';

orgMoment.locale("zh-cn");
export const moment = orgMoment;
export const ajax = option => {
  let ins = axios.create({
    baseURL: "/api"
  });
  return ins(option);
};
