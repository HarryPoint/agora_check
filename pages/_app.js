import React from "react";
import App, { Container } from "next/app";
import { ConfigProvider } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
// 全量引入样式，防止样式怪异
import "antd/dist/antd.less";

class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <ConfigProvider locale={zh_CN}>
        <Container>
          <Component {...pageProps} />
        </Container>
      </ConfigProvider>
    );
  }
}

export default MyApp;
