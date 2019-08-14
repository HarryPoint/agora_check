import { Row, Col } from "antd";
export default ({ uid, data }) => {
  let { account, uid: msgUid, msg, timestamp } = data;
  let { type, data: msgData } = JSON.parse(msg);
  let spanArr = [6, 18];
  let isSelf = uid === msgUid;
  return (
    <div className="msgItem">
      <Row gutter={16}>
        <Col span={spanArr[0]} push={isSelf ? spanArr[1] : 0}>
          <div className="account">{account}</div>
        </Col>
        <Col span={spanArr[1]} pull={isSelf ? spanArr[0] : 0}>
          <div className="content" style={{textAlign: isSelf ? 'right' : 'left'}}>{msgData.txt}</div>
        </Col>
      </Row>
      <style jsx>{`
        .msgItem {
          margin-bottom: 10px;
        }
        .account {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
};
