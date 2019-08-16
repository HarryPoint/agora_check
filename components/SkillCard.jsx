export default ({ skillInfo }) => {
  let { member_avatar, product_name, price, unit, member_name } = skillInfo;
  return (
    <div className="skillCard">
      <div className="avatarWrapper">
        <img src={member_avatar} />
      </div>
      <div className="infoBox">
        <div className="productName">
          <span>{product_name}</span>
        </div>
        <div className="price">
          <strong>{price}</strong>
          {unit}
        </div>
        <div className="memberName">{member_name}</div>
        <div className="voiceBar" />
      </div>
      <style jsx>{`
        .skillCard {
          background: #fff;
          padding: 10px 12px;
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
        }
        .avatarWrapper {
          width: 130px;
          height: 130px;
          overflow: hidden;
          flex-shrink: 0;
          flex-grow: 0;
        }
        .avatarWrapper img {
          display: block;
          width: 100%;
          height: auto;
        }
        .infoBox {
            text-align: left;
        }
        .productName span {
          background: #ff3366;
          border-radius: 4px;
          font-family: PingFangSC-Medium;
          font-size: 12px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 26px;
          letter-spacing: 0px;
          color: #ffffff;
          opacity: 0.9;
          display: inline-block;
          padding: 0 0.5em;
        }
        .price {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 16px;
          letter-spacing: 0px;
          color: #535353;
        }
        .price strong {
          font-weight: bold;
          color: #535353;
        }
        .memberName {
          font-family: PingFangSC-Medium;
          font-size: 12px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 12px;
          letter-spacing: 0px;
          color: #808080;
        }
      `}</style>
    </div>
  );
};
