import { PureComponent } from "react";
import { WithDva, SignalingClient, createChannelMsg } from "@/utils";
import { Button, Row, Col, Input, Message } from "antd";
import PageLayout from "@/components/PageLayout";
import MsgList from "@/components/MsgList";

class Client extends PureComponent {
  // 信令实例
  client = null;
  // 信令日志
  debug = true;
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
    console.log("hahah");
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
          this.client.sessionEmitter.on("onInviteReceived", call => {
            console.log("call", call);
          });
          this.client.sessionEmitter.on("onInviteAcceptedByPeer ", call => {
            console.log("onInviteAcceptedByPeer ", call);
          });
          this.client.sessionEmitter.on("onInviteRefusedByPeer", call => {
            console.log("onInviteRefusedByPeer", call);
          });
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
                }
              );
              // 获取频道内用户列表回调
              // this.client.channelEmitter.on("onChannelUserList", users => {
              //   console.log("onChannelUserList", users);
              // });
              // 获取频道内用户列表
              this.invoke(
                "io.agora.signal.channel_query_userlist",
                { name: waitingChannelId },
                (err, arg) => {
                  let { result, num, list } = arg;
                  if (num >= 2) {
                    let otherList = list.filter(
                      itm => itm[1] !== this.state.uid
                    );
                    let target = otherList.shift();
                    console.log("target", target);
                    this.client.session.channelInviteUser2(
                      `${user._id}__${target[0]}`,
                      target[0],
                      { _require_peer_online: 1 }
                    );
                    console.log(otherList);
                  }
                }
              );
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
