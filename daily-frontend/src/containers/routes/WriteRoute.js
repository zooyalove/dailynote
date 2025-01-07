import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DatePicker from "react-datepicker";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";

import {
  Form,
  Segment,
  Divider,
  Button,
  Icon,
  Modal,
  Message,
  Loader,
} from "semantic-ui-react";

import { OrdererDropdown, OrdererAddModal } from "components/Orderer";
import Category from "components/Category";
import Input from "components/Input";
import DaumPostcode from "components/DaumPostcode";

import * as ordererAction from "redux/modules/base/orderer";
import * as api from "helpers/WebApi/orderer";
import * as notes from "helpers/WebApi/note";
import * as utils from "helpers/utils";

const initialState = {
  orderer_name: "",
  orderer_phone: "",
  orderer_id: "",
  receiver_name: "",
  receiver_phone: "",
  delivery_category: "",
  delivery_price: 0,
  delivery_count: 1,
  delivery_discount: 0, // 할인금액
  delivery_address: "",
  delivery_text: "",
  memo: "",
  error: false,
  postcode_open: false,
  postcode_position: 0,
  custom_count: false,
  total_price: 0,
};

class WriteRoute extends Component {
  // addr_ref = createRef()

  constructor(props) {
    super(props);

    this.state = { ...initialState, delivery_date: moment() };
  }

  componentWillMount() {
    const { OrdererActions } = this.props;

    document.title = "Daily Note - 장부등록";

    api
      .getOrdererAll()
      .then((res) => {
        const orderer = res.data.orderers;

        OrdererActions.setOrdererData({ orderer });
      })
      .catch((err) => {
        OrdererActions.setOrdererData({ orderer: [] });
      });
  }

  componentWillUnmount() {
    this.setState({ postcode_open: false });
  }

  handlePostcode = (e) => {
    const { postcode_open } = this.state;

    const pc = document.querySelector("#pc_container");

    new window.daum.Postcode({
      oncomplete: (data) => {
        let addr = "";
        let extraAddr = "";

        if (data.userSelectedType === "R") {
          // 사용자가 도로명 주소를 선택했을 경우
          addr = data.roadAddress;
        } else {
          // 사용자가 지번 주소를 선택했을 경우(J)
          addr = data.jibunAddress;
        }

        // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
        if (data.userSelectedType === "R") {
          // 법정동명이 있을 경우 추가한다. (법정리는 제외)
          // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
          if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname;
          }
          // 건물명이 있고, 공동주택일 경우 추가한다.
          if (data.buildingName !== "" && data.apartment === "Y") {
            extraAddr +=
              extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
          }
          // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
          if (extraAddr !== "") {
            extraAddr = " (" + extraAddr + ")";
          }
        }

        this.handleClosePostcode();
        this.addr_ref.value = addr + extraAddr;
        this.addr_ref.focus();
      },
    }).embed(pc);

    this.setState({
      postcode_open: !postcode_open,
      postcode_position: e.target.offsetLeft - 500,
    });
  };

  handleClosePostcode = () => {
    this.setState({ postcode_open: false });
  };

  handleChange = (e, { name, value }) => {
    const {
      status: { orderer },
    } = this.props;
    let text, _id;

    if (name === "orderer_name") {
      text = value.split("|")[0];
      _id = value.split("|")[1];
      _id = /^no[0-9]+/.test(_id) ? "no" : _id;

      const List = orderer.get("data");
      const index = List.findIndex((d) => d.get("_id") === _id);
      const phone = index === -1 ? "" : List.get(index).get("phone");
      const ribText = index === -1 ? "" : List.get(index).get("def_ribtext");

      this.setState({
        [name]: text,
        orderer_id: _id,
        orderer_phone: phone,
        delivery_text: ribText,
      });
    } else {
      if (name === "delivery_count" && value === "기타") {
        this.setState({ ["custom_count"]: true });
      } else {
        this.setState({ [name]: value });
      }
    }
  };

  handleAddItem = async (e, { value }) => {
    const { OrdererActions } = this.props;
    const { handleChange } = this;

    const rd = moment().millisecond();

    const data = {
      name: value,
      _id: "no" + rd,
    };

    await OrdererActions.setOrdererData({ orderer: data });

    await handleChange(null, {
      name: "orderer_name",
      value: data.name + "|" + data._id,
    });
  };

  handleDateChange = (date) => {
    this.setState({ delivery_date: date });
  };

  handleModal = (() => {
    const {
      OrdererActions,
      status: { orderer },
    } = this.props;
    return {
      open: () => {
        if (!orderer.getIn(["modal", "open"])) {
          OrdererActions.openAddOrdererModal({ open: true, mode: "add" });
        }
      },
      close: () => {
        OrdererActions.openAddOrdererModal({ open: false });
      },
    };
  })();

  handleOrdererAdd = async (formdata) => {
    const { OrdererActions } = this.props;
    const { handleModal } = this;

    OrdererActions.fetchingOrdererData({
      fetch: true,
      message: <Loader>거래처 정보 업데이트중...</Loader>,
    });

    await api.addOrderer(formdata).then(
      (res) => {
        // console.log('Orderer Add : ', res);
        const orderer = res.data.orderer;
        OrdererActions.setOrdererData({ orderer });
      },
      (err) => {
        console.error(err.response.data.error);
      }
    );

    OrdererActions.fetchingOrdererData({
      fetch: true,
      message: (
        <div>
          <Icon name="checkmark" color="green" /> 거래처 등록완료!!!
        </div>
      ),
    });

    setTimeout(() => {
      OrdererActions.fetchingOrdererData({ fetch: false, message: "" });
      handleModal.close();
    }, 1500);
  };

  handlePriceClick = (e, price) => {
    e.preventDefault();

    this.setState({ delivery_price: price });
  };

  // 장부입력 초기화
  handleCancel = (e) => {
    e.preventDefault();

    this.setState({ ...initialState, delivery_date: moment() });
  };

  // 장부 등록
  handleSubmit = async (e) => {
    const { OrdererActions } = this.props;
    const {
      orderer_name,
      orderer_phone,
      orderer_id,
      receiver_name,
      receiver_phone,
      delivery_category,
      delivery_address,
      delivery_date,
      delivery_price,
      delivery_count,
      delivery_discount,
      delivery_text,
      memo,
    } = this.state;

    e.preventDefault();

    if (
      utils.empty(orderer_name) ||
      utils.empty(orderer_phone) ||
      utils.empty(receiver_name) ||
      parseInt(delivery_price, 10) === 0
    ) {
      this.setState({ error: true });
      return false;
    }

    OrdererActions.fetchingOrdererData({
      fetch: true,
      message: <Loader>{orderer_name} 님의 장부 1건 등록중...</Loader>,
    });

    await notes.addNote({
      orderer_name,
      orderer_phone,
      orderer_id,
      receiver_name,
      receiver_phone,
      delivery_category,
      delivery_address,
      delivery_date: delivery_date.toISOString(),
      delivery_price: parseInt(delivery_price, 10),
      delivery_count: parseInt(delivery_count, 10),
      delivery_discount: parseInt(delivery_discount, 10),
      delivery_text,
      memo,
    });

    OrdererActions.fetchingOrdererData({
      fetch: true,
      message: (
        <div>
          <Icon name="checkmark" color="green" /> 장부 등록완료!!!
        </div>
      ),
    });

    setTimeout(() => {
      // this.setState({ ...initialState, delivery_date: moment() });
      this.setState({
        ...this.state,
        receiver_name: "",
        receiver_phone: "",
        delivery_date: moment(),
        delivery_address: "",
        delivery_count: 1,
        delivery_category: "",
        delivery_price: 0,
        delivery_text: "",
        memo: "",
      }); // 장부 등록후 선택된 거래처 기본정보 유지 (날짜 및 시간, 배송지, 가격 최신정보 업데이트)

      OrdererActions.fetchingOrdererData({ fetch: false, message: "" });

      document.querySelector("input[name=receiver_name]").focus();
    }, 1000);
  };

  handleError = () => {
    this.setState({ error: false });
  };

  render() {
    const {
      handleChange,
      handleDateChange,
      handleAddItem,
      handleModal,
      handlePriceClick,
      handleCancel,
      handleSubmit,
      handleOrdererAdd,
      handleError,
      handlePostcode,
      handleClosePostcode,
    } = this;

    const {
      orderer_phone,
      receiver_name,
      receiver_phone,
      delivery_date,
      delivery_address,
      delivery_price,
      delivery_count,
      delivery_discount,
      delivery_text,
      delivery_category,
      memo,
      error,
      postcode_open,
      postcode_position,
    } = this.state;

    const {
      status: { orderer },
    } = this.props;

    const options =
      orderer.get("data") && orderer.get("data").size > 0
        ? orderer
            .get("data")
            .map((d) => {
              return {
                key: d.get("_id"),
                text: d.get("name"),
                value: d.get("name") + "|" + d.get("_id"),
              };
            })
            .toArray()
        : [];

    const price =
      String(delivery_price).indexOf(",") > -1
        ? String(delivery_price).replace(",", "")
        : delivery_price;

    return (
      <div className="subcontents-wrapper">
        <h2 className="main-title">일일장부 등록</h2>
        <Form
          onSubmit={(evt) => {
            evt.preventDefault();
            return false;
          }}
        >
          <Segment color="blue">
            <OrdererDropdown
              options={options}
              tabIndex="1"
              onChange={handleChange}
              onAddItem={handleAddItem}
              onAddOrderer={handleModal.open}
            />
            <Form.Input
              name="orderer_phone"
              label="전화번호"
              placeholder="주문자 전화번호를 적어주세요"
              required
              inline
              value={orderer_phone}
              tabIndex="2"
              onChange={handleChange}
            />
          </Segment>
          <Segment color="red">
            <Form.Input
              name="receiver_name"
              label="받는 분"
              placeholder="받는 사람 이름을 적어주세요"
              required
              inline
              value={receiver_name}
              tabIndex="3"
              onChange={handleChange}
            />
            <Form.Input
              name="receiver_phone"
              label="전화번호"
              placeholder="받는 사람 전화번호를 적어주세요"
              inline
              value={receiver_phone}
              tabIndex="4"
              onChange={handleChange}
            />
            <Divider />
            <Form.Group inline>
              <label>배송일자</label>
              <DatePicker
                showTimeSelect
                selected={delivery_date}
                minTime={moment().hours(8).minutes(0)}
                maxTime={moment().hours(21).minutes(30)}
                dateFormat="YYYY/MM/DD A HH시 mm분"
                className="date_input"
                tabIndex="5"
                onChange={handleDateChange}
              />
            </Form.Group>
            <Category
              tabIndex="6"
              value={delivery_category}
              onChange={handleChange}
            />
            <Form.Group inline>
              <label className="prequired">상품가격</label>
              <div className="ui input number">
                <Input
                  name="delivery_price"
                  type="number"
                  placeholder="상품 가격을 적어주세요"
                  min="0"
                  step="5000"
                  inputMode="numeric"
                  tabIndex="7"
                  className="min-width"
                  value={parseInt(price, 10)}
                  style={{ textAlign: "right" }}
                  onChange={({ target: { name, value } }) => {
                    handleChange(null, { name, value });
                  }}
                />
              </div>{" "}
              <span style={{ margin: "0 1rem 0 .4rem" }}>
                <b>원</b>
              </span>{" "}
              <Button.Group>
                <Button
                  color="teal"
                  className="price-button"
                  onClick={(e) => {
                    handlePriceClick(e, 40000);
                  }}
                >
                  40,000
                </Button>
                <Button
                  color="blue"
                  className="price-button"
                  onClick={(e) => {
                    handlePriceClick(e, 50000);
                  }}
                >
                  50,000
                </Button>
                <Button
                  color="orange"
                  className="price-button"
                  onClick={(e) => {
                    handlePriceClick(e, 60000);
                  }}
                >
                  60,000
                </Button>
                <Button
                  color="green"
                  className="price-button"
                  onClick={(e) => {
                    handlePriceClick(e, 80000);
                  }}
                >
                  80,000
                </Button>
                <Button
                  color="red"
                  className="price-button"
                  onClick={(e) => {
                    handlePriceClick(e, 100000);
                  }}
                >
                  100,000
                </Button>
              </Button.Group>
            </Form.Group>
            <Form.Dropdown
              name="delivery_count"
              label="상품수량"
              selection
              search={this.state.custom_count}
              inline
              compact
              placeholder="수량"
              defaultValue={1}
              options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "기타"].map((v) => {
                return { key: v, text: v, value: v };
              })}
              value={delivery_count}
              onChange={handleChange}
            />
            <Divider />
            <Form.Group inline>
              <Form.Input
                fluid
                name="delivery_address"
                label="배달장소"
                placeholder="배송지 주소 또는 위치를 적어주세요"
                tabIndex="8"
                value={delivery_address}
                onChange={handleChange}
              >
                <input
                  ref={(ref) => {
                    this.addr_ref = ref;
                  }}
                />
                <div className="addr_btn" onClick={handlePostcode}>
                  주소검색
                </div>
              </Form.Input>
            </Form.Group>
            <Form.Input
              name="delivery_text"
              label="글 씨"
              placeholder="보내는 분과 경조사어를 적어주세요"
              tabIndex="9"
              value={delivery_text}
              onChange={handleChange}
            />
            <Form.TextArea
              name="memo"
              label="비 고"
              placeholder="추가로 참고할 내용을 적어주세요"
              inline
              style={{ height: "2.8rem" }}
              value={memo}
              tabIndex="10"
              onChange={handleChange}
            />
          </Segment>
          <Form.Group inline className="write-action-btns">
            <Form.Button negative content="취소" onClick={handleCancel} />
            <Form.Button
              icon="checkmark"
              positive
              content="저장"
              onClick={handleSubmit}
            />
          </Form.Group>
        </Form>
        <DaumPostcode
          id="pc_container"
          position={postcode_position}
          open={postcode_open}
          onCloseClick={handleClosePostcode}
        />
        <OrdererAddModal
          open={orderer.getIn(["modal", "open"])}
          mode={orderer.getIn(["modal", "mode"])}
          className="bounceInUp"
          onClose={handleModal.close}
          onOrdererAdd={handleOrdererAdd}
        />
        {error && (
          <Modal dimmer="blurring" open={error} onClose={handleError}>
            <Modal.Header>필수 입력란을 기입하세요!</Modal.Header>
            <Modal.Content>
              <Message error icon>
                <Icon name="warning sign" color="red" size="huge" />
                <Message.Content>
                  <Message.Header style={{ marginBottom: "1rem" }}>
                    필수 입력란이 비어있습니다.
                  </Message.Header>
                  <b style={{ color: "red" }}>'*'</b> 표시가 있는 부분은 필수
                  입력하셔야 됩니다.
                  <br />
                  필수 입력란을 모두 입력하시고 난 후 저장버튼을 눌러주세요.
                </Message.Content>
              </Message>
            </Modal.Content>
          </Modal>
        )}
      </div>
    );
  }
}

WriteRoute = connect(
  (state) => ({
    status: {
      orderer: state.base.orderer,
    },
  }),
  (dispatch) => ({
    OrdererActions: bindActionCreators(ordererAction, dispatch),
  })
)(WriteRoute);

export default WriteRoute;
