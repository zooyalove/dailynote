import React from "react";
import classNames from "classnames";
import styles from "./DaumPostcode.scss";

import { Icon } from "semantic-ui-react";

const cx = classNames.bind(styles);

const DaumPostcode = ({ id, open, position, onCloseClick }) => {
    return (
        <div
            id={id}
            className={cx("daum_postcode", { open })}
            style={{ left: position }}
        >
            <div className={cx("postcode_close")} onClick={onCloseClick}>
                <Icon inverted name="close" color="red" size="large" />
            </div>
        </div>
    );
};

export default DaumPostcode;
