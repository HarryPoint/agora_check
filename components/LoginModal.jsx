import { useEffect } from "react";
import { Modal, Form, Input, Checkbox, Button, Message } from "antd";
import { WithDva, ajax } from "@/utils";
const LoginForm = ({ form }) => {
  const { getFieldDecorator, validateFields } = form;
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
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item>
        {getFieldDecorator("phNum", {
          rules: [{ required: true, message: "请输入手机号码" }]
        })(<Input placeholder="手机号码" />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("verCode", {
          rules: [{ required: true, message: "请输入验证码" }]
        })(<Input placeholder="动态密码" />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("keepLogin", {
          initialValue: true
        })(<Checkbox>自动登录</Checkbox>)}
      </Form.Item>
      <Form.Item>
        <Button block type="danger" htmlType="submit">
          确定
        </Button>
      </Form.Item>
    </Form>
  );
};
const WrappedLoginForm = Form.create()(LoginForm);
const LoginModal = ({ loginState, dispatch }) => {
  useEffect(() => {
    //  默认请求用户数据
    ajax({
      url: "/my.json",
      method: "get",
      params: {
        error: "no"
      }
    }).then(({ data: { data } }) => {
      dispatch({ type: "user/set", data });
    }).catch(err => {
        dispatch({type: 'login/changeVisible',  visible: true})
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
    <Modal visible={loginState.visible} footer={null}>
      <div className="formWrapper">
        <WrappedLoginForm />
      </div>
      <div className="autoWraper">
        <Button onClick={() => oAuthLogin("wx")}>微信登录</Button>
        <Button onClick={() => oAuthLogin("sinawb")}>微博登录</Button>
        <Button onClick={() => oAuthLogin("qq")}>QQ登录</Button>
      </div>
    </Modal>
  );
};

export default WithDva(state => {
  return {
    loginState: state.login,
    userState: state.user
  };
})(LoginModal);
