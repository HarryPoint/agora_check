import axios from "axios";
import orgMoment from "moment";
import "moment/locale/zh-cn";

orgMoment.locale("zh-cn");
export const moment = orgMoment;
export const ajax = option => {
  let ins = axios.create({
    baseURL: "/api"
  });
  return ins(option);
};
