import React, { PureComponent, createRef } from "react";
import { Radio, Button, Carousel, Icon, Input } from "antd";
import { WithDva, ajax, lodash, classnames } from "@/utils";
import PageLayout from "@/components/PageLayout";

class Step1 extends PureComponent {
  constructor(props) {
    super(props);
    this.carousel = createRef();
    this.state = {
      orgTags: [],
      sex: 0,
      tags: []
    };
  }
  handleChangeTags = tag => {
    let { tags } = this.state;
    if (tags.indexOf(tag) === -1) {
      this.setState({
        tags: tags.concat(tag)
      });
    }
  };

  handleSubmit = () => {
    let { onEnd } = this.props;
    let { tags, sex } = this.state;
    onEnd({
      tags,
      sex
    });
  };

  componentDidMount() {
    // 获取标签列表
    ajax({
      url: "/_/v2/meeting.json",
      method: "get"
    }).then(({ data: { data: { hobby } } }) => {
      this.setState({ orgTags: hobby });
    });
  }
  render() {
    let { orgTags, sex, tags } = this.state;
    return (
      <div className="step1">
        <div className="wrapper">
          <div
            className="pannel"
            style={{
              backgroundImage: `url(${require("@/assets/images/step1_bg.png")})`
            }}
          >
            <h2>选择性别</h2>
            <div className="selectSex">
              <div className="item" onClick={() => this.setState({ sex: 0 })}>
                <div className="imgBox">
                  <img src={require("@/assets/images/boy.png")} />
                </div>
                <div className="radioWrapper">
                  <Radio checked={sex === 0}>男</Radio>
                </div>
              </div>
              <div className="item" onClick={() => this.setState({ sex: 1 })}>
                <div className="imgBox">
                  <img src={require("@/assets/images/girl.png")} />
                </div>
                <div className="radioWrapper">
                  <Radio checked={sex === 1}>女</Radio>
                </div>
              </div>
            </div>
            <div className="selectTags">
              <h6>选择标签</h6>
              <Carousel ref={this.carousel}>
                {lodash.chunk(orgTags, 8).map((arr, idx) => (
                  <div key={idx} className="carouselItem">
                    <div className="tagWrapper">
                      {arr.map((itm, _idx) => (
                        <span
                          className={classnames("tag", {
                            checked: tags.indexOf(itm) !== -1
                          })}
                          key={`${_idx}_${itm}`}
                          onClick={this.handleChangeTags.bind(this, itm)}
                        >
                          {itm}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </Carousel>
              <div
                className="left"
                onClick={() => this.carousel.current.prev()}
              >
                <Icon type="left" />
              </div>
              <div
                className="right"
                onClick={() => this.carousel.current.next()}
              >
                <Icon type="right" />
              </div>
            </div>
            <div className="startBtnWrapper">
              <Button
                type="primary"
                size="large"
                shape="round"
                style={{ width: 250 }}
                onClick={this.handleSubmit}
              >
                开始聊天
              </Button>
            </div>
          </div>
        </div>
        <style jsx>{`
          .step1 {
            padding: 24px 0;
          }
          .pannel {
            background: #fff;
            background-position: center top;
            background-size: 100% auto;
            height: 744px;
            padding-top: 1px;
          }
          h2 {
            font-family: PingFangSC-Medium;
            font-size: 24px;
            font-weight: normal;
            font-stretch: normal;
            line-height: 46px;
            letter-spacing: 0px;
            color: #ff4362;
            text-align: center;
            margin-top: 100px;
          }
          .selectSex {
            width: 550px;
            margin: auto;
            display: flex;
            justify-content: space-between;
            margin-top: 70px;
          }
          .selectSex .item {
            cursor: pointer;
          }
          .selectSex .imgBox {
            height: 165px;
            display: flex;
            align-items: flex-end;
          }
          .selectSex .item img {
            display: block;
          }
          .selectSex .radioWrapper {
            padding-top: 20px;
            text-align: center;
          }
          .selectSex :global(.ant-radio-wrapper) {
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            margin: auto;
          }
          .selectSex :global(.ant-radio-checked) + span {
            color: #f55626;
          }
          .selectTags {
            width: 450px;
            margin: auto;
            position: relative;
          }
          .selectTags h6 {
            text-align: center;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            line-height: 46px;
            letter-spacing: 0px;
            color: #ff4362;
          }
          .carouselItem {
            height: 80px;
          }
          .carouselItem .tag {
            width: 95px;
            line-height: 30px;
            background-color: #ffffff;
            border-radius: 15px;
            border: solid 1px #d8d8d8;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            font-weight: normal;
            text-align: center;
            float: left;
            margin-left: 22px;
            margin-bottom: 18px;
            cursor: pointer;
          }
          .carouselItem .tag.checked {
            color: #ff4362;
            border-color: #ff4362;
          }
          .selectTags
            :global(.ant-carousel)
            :global(.slick-dots)
            :global(li)
            :global(button) {
            width: 5px;
            height: 5px;
            border-radius: 100px;
            background: #d8d7d7;
            opacity: 1;
          }
          .selectTags
            :global(.ant-carousel)
            :global(.slick-dots)
            :global(li.slick-active)
            :global(button) {
            background: #ff4362;
          }
          .selectTags :global(.ant-carousel) :global(.slick-dots) {
            transform: translateY(20px);
          }
          .selectTags .left,
          .selectTags .right {
            position: absolute;
            left: -55px;
            top: 50%;
            color: d8d7d7;
            cursor: pointer;
          }
          .selectTags .left:hover,
          .selectTags .right:hover {
            color: #ff4362;
          }
          .selectTags .right {
            left: auto;
            right: -55px;
          }
          .tagWrapper {
            margin-left: -22px;
            overflow: hidden;
          }
          .startBtnWrapper {
            text-align: center;
            padding-top: 48px;
          }
        `}</style>
      </div>
    );
  }
}
class Step2 extends PureComponent {
  render() {
    return (
      <div className="step2">
        <div className="wrapper">
          <div
            className="pannel"
            style={{
              backgroundImage: `url(${require("@/assets/images/step2_bg.png")})`
            }}
          >
            <div className="content">
              <img src={require("@/assets/images/res_fail.png")} alt="" />
              <div className="btnWrapper">
                <Button type="primary" size="large" shape="round">
                  再等一次
                </Button>
                <Button
                  type="primary"
                  size="large"
                  ghost
                  shape="round"
                  style={{ marginLeft: 28 }}
                >
                  离开
                </Button>
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          .step2 {
            padding: 24px 0;
          }
          .pannel {
            background: #fff;
            background-position: center top;
            background-size: 100% auto;
            height: 744px;
            padding-top: 1px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .content {
            text-align: center;
          }
          .content img {
            transform: translate(-20px, -30px);
          }
        `}</style>
      </div>
    );
  }
}
class Step3 extends PureComponent {
  render() {
    return (
      <div className="step3">
        <div className="wrapper">
          <div className="pannel">
            <div className="header">
              <div className="userInfo">
                <span>女生 四川</span>
                <i>声优聊天</i>
                <i>钻石王者</i>
              </div>
              <div className="headerAction">
                <span style={{ backgroundColor: "#b5bdd0" }}>举报</span>
                <span style={{ backgroundColor: "#ff4362" }}>换一个</span>
                <span style={{ backgroundColor: "#ffba43" }}>我的账户</span>
              </div>
            </div>
            <div className="body" />
            <div className="footer">
              <div className="toolbar">
                <span>
                  <Icon type="smile" />
                </span>
                <span>
                  {" "}
                  <Icon type="picture" />
                </span>
                <span>
                  <Icon type="gift" />
                </span>
                <span>
                  <Icon type="red-envelope" />
                </span>
              </div>
              <div className="textArea">
                <Input.TextArea
                  autosize={{ minRows: 4, maxRows: 4 }}
                  placeholder="请输入..."
                />
              </div>
              <div className="footerAction">
                <Button type="primary" size="large" shape="round" ghost>
                  打个招呼
                </Button>
                <Button
                  type="primary"
                  size="large"
                  shape="round"
                  style={{ marginLeft: 12 }}
                >
                  发送
                </Button>
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          .step3 {
            padding: 24px 0;
          }
          .pannel {
            background: #fff;
            background-position: center top;
            background-size: 100% auto;
            height: 744px;
            box-sizing: border-box;
            padding: 0 30px;
            padding-top: 1px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            padding: 10px 26px;
          }
          .header .userInfo {
            display: flex;
            align-items: center;
          }
          .header .userInfo span {
            font-family: PingFangSC-Regular;
            font-size: 24px;
            font-weight: normal;
            font-stretch: normal;
            line-height: 46px;
            letter-spacing: 0px;
            color: #575757;
            display: inline-block;
            margin-right: 0.5em;
          }
          .header .userInfo i {
            display: inline-block;
            margin-right: 10px;
            background-color: #ff4362;
            border-radius: 2px;
            color: #fff;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            font-weight: normal;
            font-stretch: normal;
            line-height: 20px;
            letter-spacing: 0px;
            color: #ffffff;
            font-style: normal;
            padding: 0 0.5em;
            border-radius: 2px;
          }
          .header .headerAction {
            transform: translateY(10px);
          }
          .header .headerAction span {
            display: inline-block;
            color: #fff;
            line-height: 30px;
            border-radius: 8px;
            margin-left: 10px;
            padding: 0 1em;
            cursor: pointer;
          }
          .body {
            background: #fafafa;
            border: solid 1px #dcdcdc;
            border-left: none;
            border-right: none;
            height: 460px;
          }
          .footer .toolbar span {
            font-size: 26px;
            display: inline-block;
            margin-right: 10px;
            cursor: pointer;
          }
          .footer .footerAction {
            text-align: right;
            padding-bottom: 40px;
            padding-top: 10px;
          }
        `}</style>
      </div>
    );
  }
}
class Page extends React.Component {
  state = {
    step: 1,
    // 男
    sex: 0,
    // 选择的标签
    tags: []
  };
  render() {
    let { step } = this.state;
    switch (step) {
      case 1:
        return (
          <Step1
            onEnd={({sex, tags}) => {
              this.setState({ sex, tags, step: 2 });
            }}
          />
        );
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      default:
        return null;
    }
  }
}

const DvaPage = WithDva(state => {
  return { base: state.base, user: state.user, login: state.login };
})(Page);

export default () => (
  <PageLayout loginModal>
    <DvaPage />
  </PageLayout>
);
