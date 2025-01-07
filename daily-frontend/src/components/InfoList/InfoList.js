import React from "react";
import classNames from "classnames";
import styles from "./InfoList.scss";

import { core as ZingChart } from "zingchart-react";
import InfoLabel from "components/InfoLabel";

import * as utils from "helpers/utils";

const cx = classNames.bind(styles);

const info_maps = [
  "phone",
  "manager",
  "manager_phone",
  "address",
  "def_ribtext",
  "description",
];

const label_maps = {
  phone: "전화번호",
  manager: "담당자",
  manager_phone: "담당자 전화번호",
  address: "주 소",
  def_ribtext: "리본글씨",
  description: "설 명",
};

const InfoList = ({ list }) => {
  const { ordererInfo, data, bViewPast } = list;
  const { date } = ordererInfo;
  // console.log(data);
  let options = {
    type: "bar",
    plotarea: {
      marginTop: "7%",
      marginLeft: "10%",
      marginRight: "6%",
      marginBottom: "12%",
    },
    tooltip: {
      thousandsSeparator: ",",
    },
    plot: {
      animation: {
        delay: 400,
        effect: "ANIMATION_SLIDE_BOTTOM",
        method: "ANIMATION_BOUNCE_EASE_OUT",
        sequence: "ANIMATION_BY_PLOT_AND_NODE",
        speed: 500, //'ANIMATION_FAST'
      },
    },
    scaleX: {
      minValue: new Date(new Date().getFullYear() + "-1-2").getTime(),
      step: "month",
      transform: {
        type: "date",
        all: "%m月",
      },
      maxItems: 12,
    },
    scaleY: {
      guide: {
        "line-style": "dotted",
      },
      thousandsSeparator: ",",
    },
    utc: true,
    timezone: 9,
  };

  if (!utils.empty(data)) {
    options["series"] = [{ values: data.graph }];
  }

  const infos = info_maps.map((info, i) => {
    if (utils.empty(ordererInfo[info])) return "";
    return (
      <InfoLabel key={i} label={label_maps[info]} info={ordererInfo[info]} />
    );
  });

  return (
    <div className={cx("infolist_wrapper")}>
      {infos}
      <InfoLabel
        label={
          !bViewPast
            ? "최근 1년간 주문상황"
            : `직전 ${new Date().getFullYear() - 1} 년도 주문상황`
        }
        info={
          utils.empty(data)
            ? "등록된 건수가 없습니다"
            : data.total.price.toLocaleString() +
              "원 (" +
              data.total.count +
              "건)"
        }
      />
      {!utils.empty(data) && (
        <div className={cx("orderer-graph-wrapper")}>
          <ZingChart
            id="orderer-graph"
            data={options}
            height={200}
            width="100%"
          />
        </div>
      )}
      <InfoLabel
        label="등록일자"
        info={
          date.created === undefined
            ? ""
            : new Date(date.created).toLocaleString()
        }
      />
    </div>
  );
};

export default InfoList;
