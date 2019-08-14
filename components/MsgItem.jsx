export default ({ data }) => {
    console.log(data)
  let { account, msg, timestamp } = data;
  let {type, data: msgData} = JSON.parse(msg);
  return <div>{msgData.txt}</div>;
};
