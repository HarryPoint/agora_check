import MsgItem from "@/components/MsgItem";

export default ({ msgList = [], uid = "" }) => {
  return (
    <div className="msgList">
      {msgList.map(itm => (
        <MsgItem key={itm.timestamp} uid={uid} data={itm} />
      ))}
      <style jsx>{`
        .msgList {
          background: #fff;
          height: 400px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};
