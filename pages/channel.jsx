import { SignalingClient, createChannelMsg } from "@/utils";
import { Button, Row, Col, Input, message } from "antd";
import PageLayout from "@/components/PageLayout";
import MsgItem from "@/components/MsgItem";
const isPro = false;
const APP_ID = isPro
  ? "1f97626a3167462589c9d4e0acd63925"
  : "58fffcf1703c435a9a4545192c76f1fd";
const channelId = "test";
import { useEffect, useState } from "react";
// 信令实例
let signal = null;
export default () => {
  // 当前信令账户id
  let [uid, setUid] = useState("");
  // 当前消息
  let [msg, setMsg] = useState("");
  //   p2p消息
  let [msgList, setMsgList] = useState([]);
  //   channel消息
  let [channelMsgList, setChannelMsgList] = useState([]);
  useEffect(() => {
    // 初始化信令
    if (!signal) {
      signal = new SignalingClient(APP_ID, "");
      signal
        .login(`test${Math.random()}`)
        .then(res => {
          console.log("signal-success", res);
          setUid(res);
          // 初始化频道
          signal
            .join(channelId)
            .then(res => {
              console.log("channel-success", res);
              // 收到频道消息
              signal.channelEmitter.on(
                "onMessageChannelReceive",
                (account, uid, msg) => {
                  console.log(account, uid, msg);
                  setChannelMsgList(list =>
                    list.concat({
                      account,
                      uid,
                      msg,
                      timestamp: new Date().getTime()
                    })
                  );
                }
              );
              // 加入频道消息
              signal.channelEmitter.on("onChannelUserJoined", () => {
                console.log("onChannelUserJoined");
              });
            })
            .catch(err => {
              console.log("channel-fail", err);
            });
        })
        .catch(err => {
          console.log("signal-fail", err);
        });
    }
  }, []);

  // 发送频道消息
  const broadcastMessage = () => {
    if (msg) {
      signal.broadcastMessage(createChannelMsg("msg", { txt: msg }));
      setMsg("");
    } else {
      message.error("消息不能为空");
    }
  };

  return (
    <PageLayout loginModal>
      <div className="pageWrapper">
        <div className="chatWrapper">
          <div className="chatList">
            {channelMsgList.map(itm => (
              <MsgItem key={itm.timestamp} uid={uid} data={itm} />
            ))}
          </div>
          <div className="toolBar">
            <Row gutter={16}>
              <Col span={18}>
                <Input
                  value={msg}
                  onChange={ev => setMsg(ev.target.value)}
                  onPressEnter={broadcastMessage}
                />
              </Col>
              <Col span={6}>
                <Button type="primary" onClick={broadcastMessage} block>
                  发送
                </Button>
              </Col>
            </Row>
          </div>
        </div>
        <style jsx>{`
          .pageWrapper {
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .chatWrapper {
            width: 500px;
            height: 500px;
            background: #fafafa;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
            display: flex;
            flex-direction: column;
            padding: 15px;
          }
          .chatList {
            flex-grow: 1;
            background-color: #fff;
            overflow-y: auto;
          }
          .toolBar {
            height: 50px;
          }
        `}</style>
      </div>
    </PageLayout>
  );
};
