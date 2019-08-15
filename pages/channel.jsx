import { PureComponent } from "react";
import { WithDva, SignalingClient, createChannelMsg } from "@/utils";
import { Button, Row, Col, Input, Message } from "antd";
import PageLayout from "@/components/PageLayout";
import MsgList from "@/components/MsgList";

class Client extends PureComponent {
  // 信令实例
  signal = null;
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

  invoke(func, args, cb) {
    let session = this.signal.session;
    session &&
      session.invoke(func, args, function(err, val) {
        if (err) {
          console.log(err);
          console.error(val.reason);
        } else {
          cb && cb(err, val);
        }
      });
  }

  initSignal = () => {
    let { user, base } = this.props;
    let { waitingChannelId } = this.state;
    console.log("hahah");
    if (!this.signal && user._id) {
      this.signal = new SignalingClient(base.agoraId, "");
      this.signal
        .login(user._id)
        .then(res => {
          console.log("signal-success", res);
          this.setState({
            uid: res
          });
          // 初始化频道
          this.signal
            .join(waitingChannelId)
            .then(res => {
              console.log("channel-success", res);
              // 收到频道消息
              this.signal.channelEmitter.on(
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
              this.signal.channelEmitter.on(
                "onChannelUserJoined",
                (account, uid) => {
                  console.log("onChannelUserJoined", account, uid);
                }
              );
              // 获取频道内用户列表回调
              this.signal.channelEmitter.on("onChannelUserList", users => {
                console.log("onChannelUserList", users);
              });
              this.invoke('io.agora.signal.channel_query_userlist', {name: waitingChannelId}, (...arg) => {
                console.log('invoke', ...arg)
              })
            })
            .catch(err => {
              console.log("channel-fail", err);
            });
        })
        .catch(err => {
          console.log("signal-fail", err);
        });
    } else {
      Message.error("请先登录");
    }
  };
  // 发送频道消息
  broadcastMessage = () => {
    let { msg } = this.state;
    if (msg) {
      this.signal.broadcastMessage(createChannelMsg("msg", { txt: msg }));
      this.setState({
        msg: ""
      });
    } else {
      Message.error("消息不能为空");
    }
  };
  componentDidMount() {
    this.initSignal();
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
