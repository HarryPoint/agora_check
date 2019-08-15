import React, { PureComponent, createRef } from "react";
import { Radio, Button, Carousel, Icon } from "antd";
import { WithDva, ajax, lodash } from "@/utils";
import PageLayout from "@/components/PageLayout";

class Step1 extends PureComponent {
  constructor(props) {
    super(props);
    this.carousel = createRef();
    this.state = {
      tags: []
    };
  }

  componentDidMount() {
    ajax({
      url: "/_/v2/meeting.json",
      method: "get"
    }).then(({ data: { data: { hobby } } }) => {
      this.setState({ tags: hobby });
    });
  }
  render() {
    let { tags } = this.state;
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
              <div className="item">
                <img src={require("@/assets/images/boy.png")} />
                <div className="radioWrapper">
                  <Radio>男</Radio>
                </div>
              </div>
              <div className="item">
                <img src={require("@/assets/images/girl.png")} />
                <div className="radioWrapper">
                  <Radio>女</Radio>
                </div>
              </div>
            </div>
            <div className="selectTags">
              <h6>选择标签</h6>
              <Carousel ref={this.carousel}>
                {lodash.chunk(tags, 8).map((arr, idx) => (
                  <div key={idx} className="carouselItem">
                    <div className="tagWrapper">
                      {arr.map((itm, _idx) => (
                        <span className="tag" key={`${_idx}_${itm}`}>
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
      <div className="step1">
        <div className="wrapper">
          <div className="pannel" />
        </div>
      </div>
    );
  }
}
class Step3 extends PureComponent {
  render() {
    return (
      <div className="step1">
        <div className="wrapper">
          <div className="pannel" />
        </div>
      </div>
    );
  }
}
class Page extends React.Component {
  state = {
    step: 1
  };
  render() {
    let { step } = this.state;
    switch (step) {
      case 1:
        return <Step1 />;
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
