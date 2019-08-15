import React from "react";
import { WithDva } from "@/utils";
import PageLayout from "@/components/PageLayout";

class Page extends React.Component {
  render() {
    return <div>sdfsf</div>;
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
