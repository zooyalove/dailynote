import React, { Component } from 'react';
import { Button, Form, Icon, Modal } from 'semantic-ui-react';

import * as utils from 'helpers/utils';

const initData = {
    _id: '',
    name: '',
    phone: '',
    address: '',
    manager: '',
    manager_phone: '',
    def_ribtext: '',
    description: ''
};

const initialState = {
    data: initData,
    validate: {
        name: false,
        phone: false
    }
};

class OrdererAddModal extends Component {

    state = initialState

    componentWillMount() {
        const { info } = this.props;

        if (info !== null && info !== undefined) {
            this.setState({data: {...info}});
        }
    }
    componentWillUnmount() {
        this.setState({data: initData});
    }

    handleChange = (e, dat) => {
        const {name, value} = dat;

        this.setState({data: {...this.state.data, [name]: value.trim()}});
    }

    handleClose = () => {
        const { onClose } = this.props;

        this.setState({validate: {name: false, phone: false}});
        onClose();
    }

    handleOrdererAdd = () => {
        const { onOrdererAdd } = this.props;
        const { data: { name, phone } } = this.state;

        if (utils.empty(name) || utils.empty(phone)) {
            this.setState({validate: {
                name: utils.empty(name),
                phone: utils.empty(phone)
            }});
        } else {
            onOrdererAdd(this.state.data);
        }
    }

    render() {
        const { open, mode, className } = this.props;
        const { handleChange, handleClose, handleOrdererAdd } = this;
        const {
            validate,
            data: {
                name,
                phone,
                address,
                manager,
                manager_phone,
                def_ribtext,
                description
            }
        } = this.state;

        return (
            <Modal
                open={open}
                className={className}
                closeIcon="close"
                closeOnEscape={true}
                closeOnRootNodeClick={false}
                onClose={handleClose}
            >
                <Modal.Header>
                    <Icon name="user add" /> 중요 거래처 추가
                </Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Input error={validate.name} name="name" label="이름 또는 회사명" placeholder='이름 또는 회사명을 적어주세요' value={name} required onChange={handleChange} />
                        <Form.Input error={validate.phone} name="phone" label="연락처" placeholder='연락처(ex. 012-3456-7890)를 적어주세요' value={phone} required onChange={handleChange} />
                        <Form.Input label='주 소' name="address" placeholder='거래처의 주소를 적어주세요' value={address} onChange={handleChange} />
                        <Form.Input label='담당자 이름' name="manager" placeholder='담당자님이 있으면 적어주세요' value={manager} onChange={handleChange} />
                        <Form.Input label='담당자 연락처' name="manager_phone" placeholder='담당자님의 연락처를 적어주세요' value={manager_phone} onChange={handleChange} />
                        <Form.Input label='기본 문구' name="def_ribtext" placeholder='거래처의 기본적인 리본글씨 문구를 적어주세요' value={def_ribtext} onChange={handleChange} />
                        <Form.Input label='간략한 설명' name="description" placeholder='거래처의 간략한 설명을 적어주세요' value={description} onChange={handleChange} />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={handleClose}>취소</Button>
                    <Button
                        positive
                        labelPosition="right"
                        icon="checkmark"
                        content={mode === 'add' ? '확인' : '수정'}
                        onClick={handleOrdererAdd}/>
                </Modal.Actions>
            </Modal>
        );
    }
}

export default OrdererAddModal;