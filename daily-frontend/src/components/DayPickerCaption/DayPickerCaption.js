import React, { Component } from "react";
import { Dimmer, Header } from "semantic-ui-react";
import classNames from "classnames";
import styles from "./DayPickerCaption.scss";

const cx = classNames.bind(styles);

const MonthPicker = ({ year, month }) => {
    const Year = ({ year }) => {
        const yeardate = [];

        for (let i = 2018; i < new Date().getFullYear() + 2; i++) {
            yeardate.push(
                <option key={i} value={i}>
                    {i}
                </option>
            );
        }

        return <select defaultValue={year}>{yeardate}</select>;
    };

    return (
        <div className={cx("month_picker")}>
            <Year year={year} />
        </div>
    );
};

class DayPickerCaption extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dim_active: false
        };
    }

    handleClick = e => {
        this.setState({ dim_active: !this.state.dim_active });
    };

    render() {
        const { dim_active } = this.state;
        const { date, localeUtils, onCaptionClick } = this.props;
        return (
            <div className={cx("picker_caption")}>
                <div className={cx("caption")} onClick={this.handleClick}>
                    {date.getMonth() + 1}월 {date.getFullYear()}년
                </div>

                <Dimmer active={dim_active} page>
                    <Header as="h2" inverted>
                        Select month or year
                    </Header>
                    <MonthPicker year={date.getFullYear()} />
                </Dimmer>
            </div>
        );
    }
}

export default DayPickerCaption;
