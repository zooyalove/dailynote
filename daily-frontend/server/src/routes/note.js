const express = require("express");
const mongoose = require("mongoose");
const moment = require("moment");
const OrderNote = require("./../models/OrderNote");
const Orderer = require("./../models/Orderer");
const util = require("./../helper");

mongoose.Promise = global.Promise;

const router = express.Router();

/*
    POST /api/note
    일일장부 등록

    ERROR CODES
        1 : EMPTY REQUIRED FIELD
        2 : PERMISSION DENIED
*/
router.post("/", (req, res) => {
  if (typeof req.session.loginInfo === "undefined") {
    return res.status(401).json({
      error: "PERMISSION DENIED",
      code: 2,
    });
  }

  if (util.empty(req.body.orderer_name)) {
    return res.status(400).json({
      error: "EMPTY REQUIRED FIELD",
      code: 1,
    });
  }

  if (util.empty(req.body.receiver_name)) {
    return res.status(400).json({
      error: "EMPTY REQUIRED FIELD",
      code: 1,
    });
  }

  const {
    orderer_name, // 주문자 이름 또는 회사명
    orderer_phone, // 주문자 연락처
    orderer_id = "no", // 주문자 고유식별자(등록된 거래처면 ID값으로, 등록되지 않았다면 "no"로 등록)
    receiver_name, // 받는 분 이름
    receiver_phone, // 받는 분 연락처
    delivery_category, // 배달품 종류 (ex. 꽃바구니, 꽃다발, 관엽 등등...)
    delivery_price, // 가격
    delivery_count, // 상품 갯수
    delivery_discount, // 할인금액
    delivery_date, // 배달일자
    delivery_address, // 배달주소
    delivery_text, // 글씨(경조사어 및 주문자 이름)
    memo,
    // delivery_image,     // 배송된 물품의 사진...(차후 설계하자...)
    // is_payment          // 결제관련 여부 파악 (이것도 차후로...)
  } = req.body;

  let note;

  // 등록된 거래처가 아닌 일반계정으로 장부 입력시
  if (orderer_id === "no") {
    const c_year = new Date().getFullYear();
    const date = {
      $gte: new Date(c_year, 0, 1),
      $lt: new Date(c_year + 1, 0, 1),
    };

    const condition = {
      $and: [
        { "orderer.id": "no" },
        { "orderer.name": orderer_name.trim() },
        { "orderer.phone": orderer_phone },
        { "delivery.date": date },
      ],
    };

    // 똑같은 주문자명과 연락처로 장부건수가 1년사이 9건이 넘을 경우
    // 10건째부터는 거래처로 등록한다.
    OrderNote.count(condition, (errCount, count) => {
      if (errCount) throw errCount;

      if (count >= 9) {
        let orderer = new Orderer({
          name: orderer_name.trim(),
          phone: orderer_phone,
          def_ribtext: delivery_text,
        });

        orderer.save((errOrdererSave) => {
          if (errOrdererSave) throw errOrdererSave;

          // 기존 일반계정으로 등록되어 있던 장부들은 새로이 등록된 거래처 아이디로 업데이트한다.
          OrderNote.updateMany(
            {
              $and: [
                { "orderer.id": "no" },
                { "orderer.name": orderer_name.trim() },
                { "orderer.phone": orderer_phone },
              ],
            },
            { "orderer.id": orderer._id },
            (errUpdate, raw) => {
              if (errUpdate) throw errUpdate;

              if (raw) {
                note = new OrderNote({
                  "orderer.name": orderer_name.trim(),
                  "orderer.phone": orderer_phone,
                  "orderer.id": orderer._id,
                  "receiver.name": receiver_name.trim(),
                  "receiver.phone": receiver_phone,
                  "delivery.category": delivery_category,
                  "delivery.price": delivery_price,
                  "delivery.count": delivery_count,
                  "delivery.discount": delivery_discount,
                  "delivery.date": new Date(delivery_date),
                  "delivery.address": delivery_address,
                  "delivery.text": delivery_text,
                  memo: memo,
                });

                note.save((errSave) => {
                  if (errSave) throw errSave;

                  return res.json({
                    success: true,
                    id: note._id,
                  });
                });
              }
            }
          );
        });
      } else {
        // 9건이 넘지않을 경우에는 기존 방식대로 일반계정으로 등록한다.
        note = new OrderNote({
          "orderer.name": orderer_name.trim(),
          "orderer.phone": orderer_phone,
          "orderer.id": orderer_id,
          "receiver.name": receiver_name.trim(),
          "receiver.phone": receiver_phone,
          "delivery.category": delivery_category,
          "delivery.price": delivery_price,
          "delivery.count": delivery_count,
          "delivery.discount": delivery_discount,
          "delivery.date": new Date(delivery_date),
          "delivery.address": delivery_address,
          "delivery.text": delivery_text,
          memo: memo,
        });

        note.save((errSave) => {
          if (errSave) throw errSave;

          return res.json({
            success: true,
            id: note._id,
          });
        });
      }
    });
  } else {
    note = new OrderNote({
      "orderer.name": orderer_name.trim(),
      "orderer.phone": orderer_phone,
      "orderer.id": orderer_id,
      "receiver.name": receiver_name.trim(),
      "receiver.phone": receiver_phone,
      "delivery.category": delivery_category,
      "delivery.price": delivery_price,
      "delivery.count": delivery_count,
      "delivery.discount": delivery_discount,
      "delivery.date": new Date(delivery_date),
      "delivery.address": delivery_address,
      "delivery.text": delivery_text,
      memo: memo,
    });

    note.save((errSave) => {
      if (errSave) throw errSave;

      return res.json({
        success: true,
        id: note._id,
      });
    });
  }
});

/*
    GET /api/note
    모든 장부들 조회

    ERROR CODES
        1 : PERMISSION DENIED
*/
router.get("/", (req, res) => {
  if (typeof req.session.loginInfo === "undefined") {
    return res.status(401).json({
      error: "PERMISSION DENIED",
      code: 1,
    });
  }

  // 보여주고 싶은 field를 설정
  const projection = {
    _id: 1,
    "orderer.name": 1,
    "receiver.name": 1,
    "delivery.category": 1,
    "delivery.price": 1,
    "delivery.count": 1,
    "delivery.discount": 1,
    "delivery.address": 1,
    "delivery.date": 1,
    // 'delivery.image': 1,
    is_payment: 1,
    // 'memo': 1
  };

  OrderNote.find({}, projection)
    .sort({ "delivery.date": -1 })
    .exec((err, notes) => {
      if (err) throw err;

      return res.json({
        success: true,
        data: notes,
      });
    });
});

/*
    GET /api/note/today
    특정 장부를 조회

    ERROR CODES
        2 : PERMISSION DENIED
        3 : NO RESOURCE
*/
router.get("/today", (req, res) => {
  if (typeof req.session.loginInfo === "undefined") {
    return res.status(401).json({
      error: "PERMISSION DENIED",
      code: 2,
    });
  }

  const today = moment();
  today.hour(1).minute(0);

  const tomorrow = moment(today).add(1, "day");
  tomorrow.hour(0).minute(0);

  OrderNote.find({
    "delivery.date": { $gte: today.toDate(), $lt: tomorrow.toDate() },
  })
    .sort({ "delivery.date": -1 })
    .exec((err, notes) => {
      if (err) throw err;

      if (notes.length === 0) {
        return res.status(400).json({
          error: "NO RESOURCE",
          code: 3,
        });
      }

      return res.json({
        data: notes,
      });
    });
});

/*
    GET /api/note/search/:searchTxt
    특정 장부를 조회

    ERROR CODES
        2 : PERMISSION DENIED
*/
router.get("/search/:searchTxt", (req, res) => {
  if (typeof req.session.loginInfo === "undefined") {
    return res.status(401).json({
      error: "PERMISSION DENIED",
      code: 2,
    });
  }

  const searchTxt = decodeURIComponent(req.params.searchTxt);

  let condition = null;

  // 찾고자 하는 날짜로 검색
  if (searchTxt.indexOf("-") !== -1 && searchTxt.indexOf("0") !== 0) {
    const dateArray = [];
    searchTxt.split("-").forEach((d) => {
      dateArray.push(parseInt(d, 10));
    });

    condition = {
      "delivery.date": {
        $gte: new Date(dateArray[0], dateArray[1] - 1, dateArray[2], 0, 0, 0),
        $lt: new Date(dateArray[0], dateArray[1] - 1, dateArray[2], 23, 0, 0),
      },
    };
  } else {
    // 찾고자 하는 검색어로 검색
    condition = {
      $or: [
        { "orderer.name": new RegExp(searchTxt, "i") },
        { "orderer.phone": new RegExp(searchTxt, "i") },
        { "receiver.name": new RegExp(searchTxt, "i") },
        { "receiver.phone": new RegExp(searchTxt, "i") },
        { "delivery.address": new RegExp(searchTxt, "i") },
        { "delivery.text": new RegExp(searchTxt, "i") },
        { memo: new RegExp(searchTxt, "i") },
      ],
    };
  }

  OrderNote.find(condition)
    .sort({ "delivery.date": -1 })
    .exec((err, notes) => {
      if (err) throw err;

      return res.json({
        data: notes,
      });
    });
});

/*
    GET /api/note/month/:month
    month 월에 해당하는 자료를 조회

    ERROR CODES
        2 : PERMISSION DENIED
*/
router.get("/month/:month", (req, res) => {
  if (typeof req.session.loginInfo === "undefined") {
    return res.status(401).json({
      error: "PERMISSION DENIED",
      code: 2,
    });
  }

  // 찾고자 하는 년, 월로 검색 (Calendar)
  const now = new Date(req.params.month);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1);
  lastDayOfMonth.setHours(lastDayOfMonth.getHours() - 1);

  const condition = {
    "delivery.date": {
      $gt: now,
      $lte: lastDayOfMonth,
    },
  };

  OrderNote.aggregate(
    [
      { $match: condition },
      {
        $project: {
          d: {
            $dayOfMonth: {
              $add: ["$delivery.date", 9 * 60 * 60 * 1000],
            },
          },
        },
      },
      {
        $group: {
          _id: "$d",
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ],
    (err, notes) => {
      if (err) throw err;

      return res.json({
        data: notes,
      });
    }
  );
});

/*
    GET /api/note/stat
    상품종류에 해당하는 자료를 조회(필터링된 조건을 분석해서)하여 2년사이의 데이터를 반환

    ERROR CODES
        2 : PERMISSION DENIED
*/
router.get("/stat", (req, res) => {
  if (typeof req.session.loginInfo === "undefined") {
    return res.status(401).json({
      error: "PERMISSION DENIED",
      code: 2,
    });
  }

  const { category, filters } = req.query;

  // 찾고자 하는 자료를 2년내로 한정한다
  const c_year = new Date().getFullYear();
  const date = {
    $gte: new Date(c_year - 1, 0, 1),
    $lt: new Date(c_year + 1, 0, 1),
  };

  let condition;

  if (category === "전체") {
    condition = {
      "delivery.date": date,
    };
  } else {
    condition = {
      $and: [{ "delivery.date": date }, { "delivery.category": category }],
    };
  }

  if (filters && filters.length > 0) {
    const regex = new RegExp(filters.join("|"), "gi");

    if (category === "전체") {
      condition["$or"] = [
        { "delivery.address": regex },
        { "delivery.text": regex },
      ];
    } else {
      condition["$and"].push({
        $or: [{ "delivery.address": regex }, { "delivery.text": regex }],
      });
    }
  }

  OrderNote.aggregate(
    [
      { $match: condition },
      {
        $project: {
          yearMonth: {
            $dateToString: { format: "%Y-%m", date: "$delivery.date" },
          },
          price: "$delivery.price",
          deliveryCount: "$delivery.count",
        },
      },
      {
        $group: {
          _id: {
            yearMonth: "$yearMonth",
            price: "$price",
          },
          count: { $sum: "$deliveryCount" },
        },
      },
      {
        $group: {
          _id: "$_id.yearMonth",
          count: { $sum: "$count" },
          detail: {
            $push: { price: "$_id.price", count: "$count" },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ],
    (err, stats) => {
      if (err) throw err;

      return res.json({
        data: stats,
      });
    }
  );
});

/*
    GET /api/note/:id
    특정 장부를 조회

    ERROR CODES
        1 : INVALID ID
        2 : PERMISSION DENIED
        3 : NO RESOURCE
*/
router.get("/:id", (req, res) => {
  if (typeof req.session.loginInfo === "undefined") {
    return res.status(401).json({
      error: "PERMISSION DENIED",
      code: 2,
    });
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      error: "INVALID ID",
      code: 1,
    });
  }

  OrderNote.findById(req.params.id, (err, note) => {
    if (err) throw err;

    if (!note) {
      return res.status(400).json({
        error: "NO RESOURCE",
        code: 3,
      });
    }
  });
});

module.exports = router;
