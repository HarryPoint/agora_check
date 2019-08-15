import { Icon } from "antd";
import Link from "next/link";
import LoginModal from "@/components/LoginModal";
import pageBg from "@/assets/images/page_bg.png";

const LayoutHeader = () => (
  <header>
    <div className="content wrapper">
      <Link href="/">
        <a className="logo">
          <img src={require("@/assets/images/logo.png")} alt="logo" />
        </a>
      </Link>
      <nav>
        <ul>
          <li>
            <Link href="/">
              <a>
                <Icon type="user" />
              </a>
            </Link>
            <Link href="/">
              <a>注册/</a>
            </Link>
            <Link href="/">
              <a>登录</a>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
    <style jsx>{`
      header {
        background: #fff;
      }
      .content {
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .logo img {
        display: block;
      }
      nav a {
        font-family: MicrosoftYaHei;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 48px;
        letter-spacing: 0px;
        color: #000000;
      }
    `}</style>
  </header>
);

const PageLayout = ({ children, loginModal }) => {
  return (
    <div className="layout">
      <LayoutHeader />
      {children}
      {loginModal && <LoginModal />}
      <style jsx>{`
        .layout {
          background: #ff9470 url(${pageBg}) center top / 1920px auto no-repeat;
          min-height: 100vh;
        }
      `}</style>
      <style global jsx>{`
        ul {
          margin: 0;
          padding: 0;
        }
        li {
          list-style: none;
        }
        .wrapper {
          width: 1200px;
          margin: auto;
        }
      `}</style>
    </div>
  );
};
export default PageLayout;
