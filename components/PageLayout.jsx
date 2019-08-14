import LoginModal from "@/components/LoginModal";
const PageLayout = ({ children, loginModal }) => {
  return (
    <div className="layout">
      {children}
      {loginModal && <LoginModal />}
      <style jsx>{`
        .layout {
          background: #fafafa;
        }
      `}</style>
    </div>
  );
};
export default PageLayout;
