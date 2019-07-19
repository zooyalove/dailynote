import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Dimmer, Dropdown, Header, Icon } from "semantic-ui-react";
import classNames from "classnames";
import styles from "./DayPickerCaption.scss";

const cx = classNames.bind(styles);

const MonthPicker = ({ year, month, onClose, onDateChange }) => {
    const Year = () => {
        const yeardate = [];

        for (let y = 2018; y < new Date().getFullYear() + 2; y++) {
            yeardate.push({
                key: y,
                text: y,
                value: y
            });
        }

        return (
            <div>
                <Dropdown
                    compact
                    selection
                    closeOnChange
                    defaultValue={year}
                    options={yeardate}
                    onChange={(e, { value }) => onDateChange(value, month)}
                />{" "}
                년
            </div>
        );
    };

    const Month = () => {
        const monthdate = [];

        for (let m = 1; m <= 12; m++) {
            monthdate.push({
                key: m,
                text: m,
                value: m
            });
        }

        return (
            <div style={{ marginLeft: "1rem" }}>
                <Dropdown
                    compact
                    selection
                    closeOnChange
                    defaultValue={month}
                    options={monthdate}
                    onChange={(e, { value }) => onDateChange(year, value)}
                />{" "}
                월
            </div>
        );
    };

    return (
        <div className={cx("month_picker")}>
            <div className={cx("mp_close")} onClick={onClose}>
                <Icon name="close" color="grey" size="big" inverted />
            </div>
            <div className={cx("mp_wrapper")}>
                <Year /> <Month />
            </div>
        </div>
    );
};

class DayPickerCaption extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dim_active: false,
            m: this.props.date.getMonth() + 1,
            y: this.props.date.getFullYear()
        };
    }

    handleDateChange = () => {
        const { y, m } = this.state;
        const { onCaptionClick } = this.props;

        onCaptionClick(new Date(parseInt(y, 10), parseInt(m - 1, 10)));
    };

    handleCaptionClick = e => {
        this.setState({ dim_active: !this.state.dim_active });
    };

    handleCancel = e => {
        this.setState({ dim_active: false });
    };

    handlePickerDateChange = (year, month) => {
        const { y, m } = this.state;

        if (y !== year || m !== month) this.setState({ y: year, m: month });
    };

    render() {
        const { dim_active, y, m } = this.state;
        const { date } = this.props;
        return (
            <div className={cx("picker_caption")}>
                <div
                    className={cx("caption")}
                    onClick={this.handleCaptionClick}
                >
                    {date.getMonth() + 1}월 {date.getFullYear()}년
                </div>

                <Dimmer active={dim_active} page>
                    <Header as="h2" inverted>
                        Select month or year
                    </Header>
                    <MonthPicker
                        year={y}
                        month={m}
                        onClose={this.handleCancel}
                        onDateChange={this.handlePickerDateChange}
                    />
                    <div className={cx("caption_buttons")}>
                        <Button color="green" onClick={this.handleDateChange}>
                            확 인
                        </Button>
                        <Button color="red" onClick={this.handleCancel}>
                            취 소
                        </Button>
                    </div>
                </Dimmer>
            </div>
        );
    }
}

DayPickerCaption.propTypes = {
    date: PropTypes.object.isRequired,
    onCaptionClick: PropTypes.func.isRequired
};

export default DayPickerCaption;
