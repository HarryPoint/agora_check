import { PureComponent } from "react";
import { WithDva, SignalingClient, createChannelMsg } from "@/utils";
import { Button, Row, Col, Input, Message } from "antd";
import PageLayout from "@/components/PageLayout";
import MsgList from "@/components/MsgList";

class Client extends PureComponent {
  // 信令实例
  client = null;
  // 信令日志
  debug = false;
  state = {
    // 当前信令账户id
    uid: "",
    // 等候大厅id
    waitingChannelId: "lobby",
    // 频道id 默认为等候大厅
    channelId: "",
    //   p2p消息
    msgList: [],
    //   channel消息
    channelMsgList: []
  };

  invoke = (func, args, cb) => {
    let session = this.client.session;
    session &&
      session.invoke(func, args, function(err, val) {
        if (err) {
          console.log(err);
          console.error(val.reason);
        } else {
          cb && cb(err, val);
        }
      });
  };

  initclient = () => {
    let { user, base } = this.props;
    let { waitingChannelId } = this.state;
    if (!this.client && user._id) {
      this.client = new SignalingClient(base.agoraId, "");
      this.client.signal.setDoLog(this.debug);
      this.client
        .login(user._id)
        .then(res => {
          console.log("client-success", res);
          console.log("account", user._id);
          this.setState({
            uid: res
          });
          // 接收到邀请加入匹配
          this.client.sessionEmitter.on("onInviteReceived", callIns => {
            console.log("call", callIns);
            callIns.channelInviteAccept();
          });
          this.client.sessionEmitter.on(
            "onMessageInstantReceive",
            (account, uid, msg) => {
              console.log("onMessageInstantReceive", account, uid, msg);
            }
          );
          // 初始化频道
          this.client
            .join(waitingChannelId)
            .then(res => {
              console.log("channel-success", res);
              // 收到频道消息
              this.client.channelEmitter.on(
                "onMessageChannelReceive",
                (account, uid, msg) => {
                  console.log(account, uid, msg);
                  this.setState(({ channelMsgList }) => ({
                    channelMsgList: channelMsgList.concat({
                      account,
                      uid,
                      msg,
                      timestamp: new Date().getTime()
                    })
                  }));
                }
              );
              // 加入频道消息
              this.client.channelEmitter.on(
                "onChannelUserJoined",
                (account, uid) => {
                  console.log("onChannelUserJoined", account, uid);
                  if(account === user._id) return;
                  // 发起邀请
                  let callIns = this.client.session.channelInviteUser2(
                    `${user._id}__${account}`,
                    account,
                    { _require_peer_online: 1 }
                  );
                  callIns.onInviteReceivedByPeer = extra => {
                    console.log("onInviteReceivedByPeer", extra);
                  };
                  callIns.onInviteAcceptedByPeer = () => {
                    console.log("onInviteAcceptedByPeer");
                  };
                  callIns.onInviteRefusedByPeer = () => {
                    console.log("onInviteRefusedByPeer");
                  };
                  callIns.onInviteFailed = () => {
                    console.log("onInviteFailed");
                  };
                  callIns.onInviteEndByPeer = () => {
                    console.log("onInviteEndByPeer");
                  };
                  callIns.onInviteEndByMyself = () => {
                    console.log("onInviteEndByMyself");
                  };
                  callIns.onInviteMsg = () => {
                    console.log("onInviteMsg");
                  };
                  console.log(callIns);
                }
              );
              // 获取频道内用户列表
              // this.invoke(
              //   "io.agora.signal.channel_query_userlist",
              //   { name: waitingChannelId },
              //   (err, arg) => {
              //     let { result, num, list } = arg;
              //     if (num >= 2 && list[0][0] === user._id) {
              //       console.log('list', list, user._id)
              //       let otherList = list.filter(
              //         itm => itm[1] !== this.state.uid
              //       );
              //       let target = otherList.shift();
              //       console.log("target", list, target, this.client.signal);
              //       // 发送私聊消息
              //       // this.client.sendMessage('27e9c983507e9349', "sdfsfsfsf");
              //       // 离开匹配大厅
                    
              //     }
              //   }
              // );
            })
            .catch(err => {
              console.log("channel-fail", err);
            });
        })
        .catch(err => {
          console.log("client-fail", err);
        });
    } else {
      Message.error("请先登录");
    }
  };
  // 发送频道消息
  broadcastMessage = () => {
    let { msg } = this.state;
    if (msg) {
      this.client.broadcastMessage(createChannelMsg("msg", { txt: msg }));
      this.setState({
        msg: ""
      });
    } else {
      Message.error("消息不能为空");
    }
  };
  componentDidMount() {
    this.initclient();
  }
  render() {
    let { base, login, user } = this.props;
    let { uid, msg, channelMsgList } = this.state;

    return (
      <div className="pageWrapper">
        <div className="chatWrapper">
          <MsgList uid={uid} msgList={channelMsgList} />
          <div className="toolBar">
            <Row gutter={16}>
              <Col span={18}>
                <Input
                  value={msg}
                  onChange={ev => this.setState({ msg: ev.target.value })}
                  onPressEnter={this.broadcastMessage}
                />
              </Col>
              <Col span={6}>
                <Button type="primary" onClick={this.broadcastMessage} block>
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
            background: #fafafa;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
            padding: 15px;
          }
          .toolBar {
            height: 50px;
          }
        `}</style>
      </div>
    );
  }
}

const Page = props => {
  let { user } = props;
  return user.init ? <Client {...props} /> : null;
};

const DvaPage = WithDva(state => {
  return { base: state.base, user: state.user, login: state.login };
})(Page);

export default () => (
  <PageLayout loginModal>
    <DvaPage />
  </PageLayout>
);
