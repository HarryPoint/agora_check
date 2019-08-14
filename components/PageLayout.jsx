const PageLayout = ({children}) => {
  return (
    <div className="layout">
      {children}
      <style jsx>{`
        .layout {
          background: #fafafa;
        }
      `}</style>
    </div>
  );
};
export default PageLayout
