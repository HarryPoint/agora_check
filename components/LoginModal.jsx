import { useEffect, useState, useRef } from "react";
import { Modal, Form, Input, Checkbox, Button, Message } from "antd";
import { WithDva, ajax } from "@/utils";
const LoginForm = props => {
  let { form, base } = props;
  const { getFieldDecorator, getFieldValue, validateFields } = form;
  const ref = useRef();
  let [tcIns, setTcIns] = useState(null);
  // 默认倒计时 时长
  let [initCountDown] = useState(60);
  // 验证码倒计时
  let [countDown, setCountDown] = useState(initCountDown);
  // 获取验证码是否可点击
  let [verDisable, setVerDisable] = useState(false);
  let [verCodeData, setVerCodeData] = useState(null);
  // api请求验证码
  const fetchVerCode = (phNum, action, { ret, randstr, ticket }) => {
    console.log("test", ret, randstr, ticket);
    setVerCodeData({
      ret,
      randstr,
      ticket
    });
  };
  useEffect(() => {
    if (!tcIns) {
      setTcIns(
        new TencentCaptcha(
          // eslint-disable-next-line no-undef
          base.tencentCaptchaAppId,
          (...arg) => {
            fetchVerCode(getFieldValue("phNum"), "login", ...arg);
          },
          {}
        )
      );
    }
  }, []);
  // 验证码信息改变，触发获取验证码操作
  useEffect(() => {
    if (verCodeData) {
      let { ret, randstr, ticket } = verCodeData;
      if (ret === 0) {
        // Message.success('验证成功！');
        ajax({
          url: "/captcha.json",
          method: "POST",
          params: {
            mobilephone: getFieldValue("phNum"),
            action: "login",
            ticket,
            rand_str: randstr
          }
        }).then(({ data: { status, msg } }) => {
          if (status === 0) {
            Message.success(msg);
            setVerDisable(true);
            clearInterval(ref.current);
            // 开始倒计时
            ref.current = setInterval(() => {
              setCountDown(prev => {
                if (prev === 1) {
                  clearInterval(ref.current);
                  setVerDisable(false);
                  return initCountDown;
                }
                return --prev;
              });
            }, 1000);
          } else {
            Message.error(msg);
          }
        });
      } else if (ret === 2) {
        // 用户主动关闭验证码
      } else {
        Message.error("图形验证码未知错误！");
      }
    }
    return () => {
      clearInterval(ref.current);
    };
  }, [verCodeData]);

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        ajax({
          url: "/login/mobilePhoneLogin.json",
          method: "POST",
          params: {
            mobilephone: values.phNum,
            captcha: values.verCode,
            keep_login: values.keepLogin ? 1 : 0
          }
        }).then(({ data: { status, data, msg } }) => {
          if (status === 0) {
            window.location.reload();
          } else {
            Message.error(msg);
          }
        });
      }
    });
  };
  // 点击获取验证码
  const handleGetVarCode = () => {
    validateFields(["phNum"], (errors, values) => {
      if (!errors) {
        tcIns.show();
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item>
        {getFieldDecorator("phNum", {
          rules: [{ required: true, message: "请输入手机号码" }]
        })(<Input size="large" placeholder="手机号码" />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("verCode", {
          rules: [{ required: true, message: "请输入验证码" }]
        })(
          <Input
            size="large"
            placeholder="动态密码"
            suffix={
              <span style={{ cursor: "pointer" }} onClick={handleGetVarCode}>
                {verDisable ? `${countDown}s` : "获取动态密码"}
              </span>
            }
          />
        )}
      </Form.Item>
      <Form.Item style={{ marginBottom: 0 }}>
        {getFieldDecorator("keepLogin", {
          initialValue: true
        })(<Checkbox>自动登录</Checkbox>)}
      </Form.Item>
      <Form.Item>
        <Button
          size="large"
          block
          type="danger"
          shape="round"
          htmlType="submit"
        >
          确定
        </Button>
      </Form.Item>
    </Form>
  );
};
const WrappedLoginForm = Form.create()(LoginForm);
const LoginModal = props => {
  let { loginState, dispatch } = props;
  useEffect(() => {
    //  默认请求用户数据
    ajax({
      url: "/my.json",
      method: "get",
      params: {
        error: "no"
      }
    })
      .then(({ data: { data } }) => {
        dispatch({ type: "user/set", data });
      })
      .catch(err => {
        dispatch({ type: "login/changeVisible", visible: true });
      });
  }, []);
  // 三方自动登录
  const oAuthLogin = type => {
    const thirdLogin = ({ type, keep_login }) => {
      window.open(
        `/api/third/${type}.json?return_url=${encodeURIComponent(
          window.location.href
        )}&keep_login=${keep_login}`,
        `三方登录`,
        `width=780,height=550,top=${(window.screen.availHeight - 30 - 550) /
          2},left=${(window.screen.availWidth - 10 - 780) /
          2},titlebar=no,toolbar=no,menubar=no,scrollbars=no,resizable=no`
      );
    };
    Modal.confirm({
      title: "自动登录",
      content: "是否记住此账号并自动登录？",
      centered: true,
      mask: false,
      cancelText: "不记录",
      okText: "确定",
      onCancel: () => {
        thirdLogin({ type, keep_login: 0 });
      },
      onOk: () => {
        thirdLogin({ type, keep_login: 1 });
      }
    });
  };
  return (
    <Modal
      wrapClassName="loginModal"
      visible={loginState.visible}
      width={760}
      footer={null}
    >
      <img
        className="header"
        src={require("@/assets/images/login_header.png")}
        alt=""
      />
      <div className="contentWrapper">
        <div className="shadow" />
        <div className="formWrapper">
          <h5>手机登录</h5>
          <WrappedLoginForm {...props} />
        </div>
        <div className="autoWrapper">
          <h5>手机登录</h5>
          <Button
            size="large"
            shape="round"
            block
            icon="wechat"
            style={{ backgroundColor: "#5fcd54" }}
            onClick={() => oAuthLogin("wx")}
          >
            微信登录
          </Button>
          <Button
            size="large"
            shape="round"
            block
            icon="weibo"
            style={{ backgroundColor: "#e6614b" }}
            onClick={() => oAuthLogin("sinawb")}
          >
            微博登录
          </Button>
          <Button
            size="large"
            shape="round"
            block
            icon="qq"
            style={{ backgroundColor: "#3aa1e8" }}
            onClick={() => oAuthLogin("qq")}
          >
            QQ登录
          </Button>
        </div>
      </div>
      <div className="footer">
        使用即为同意
        <a href="https://www.yuema.cn/intro/protocol">《用户协议》</a>
      </div>
      <style jsx>{`
        .header {
          position: absolute;
          left: 0;
          top: -22px;
          width: 100%;
        }
        .contentWrapper {
          display: flex;
          position: relative;
          padding-top: 90px;
          padding-bottom: 30px;
        }
        h5 {
          font-size: 16px;
          color: #000;
          line-height: 30px;
        }
        .formWrapper {
          width: 380px;
          padding: 0px 70px 0px 35px;
          background: #fff;
          position: relative;
        }
        .autoWrapper {
          padding-left: 80px;
          width: 260px;
        }
        .autoWrapper :global(.ant-btn) {
          margin-bottom: 20px;
          color: #fff;
          border-color: transparent;
        }
        .shadow {
          position: absolute;
          height: 240px;
          width: 40px;
          top: 90px;
          right: 320px;
          box-shadow: rgb(247, 247, 247) 0px 0px 15px;
          background: rgb(247, 247, 247);
          border-radius: 50%;
        }
        .footer {
          position: absolute;
          width: 100%;
          bottom: 0px;
          left: 0px;
          height: 50px;
          text-indent: 30px;
          line-height: 50px;
          z-index: 10;
          background: url(${require("@/assets/images/login_footer.png")}) no-repeat;
        }
        .footer a {
          color: #f36;
        }
      `}</style>
    </Modal>
  );
};

export default WithDva(state => {
  return {
    loginState: state.login,
    userState: state.user,
    base: state.base
  };
})(LoginModal);
