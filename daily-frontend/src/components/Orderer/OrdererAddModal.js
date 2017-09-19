import React, { Component, PropTypes } from 'react';
import { Button, Form, Icon, Modal } from 'semantic-ui-react';

import utils from 'helpers/utils';

class OrdererAddModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: {
                name: '',
                phone: '',
                address: '',
                manager: '',
                manager_phone: '',
                def_ribtext: '',
                description: ''
            },
            validate: {
                name: false,
                phone: false
            }
        };
    }

    handleOrdererAdd = () => {
        const { onClose, onOrdererAdd } = this.props;
        const { data: { name, phone } } = this.state;
        console.log(this.inpName, this.inpPhone);

        if (utils.empty(name) || utils.empty(phone)) {
            if (utils.empty(name)) {
                this.setState({validate: {name: true}});
                this.inpName.focus();
            } else {
                this.setState({validate: {name: false}});
            }

            if (utils.empty(phone)) {
                this.setState({validate: {phone: true}});
                this.inpPhone.focus();
            } else {
                this.setState({validate: {phone: false}});
            }
        } else {
            onOrdererAdd(this.state.data);
            onClose();
        }
    }

    render() {
        const { open, className, onClose } = this.props;
        const { handleOrdererAdd, state: { validate } } = this;

        return (
            <Modal
                open={open}
                className={className}
                closeIcon="close"
                closeOnEscape={true}
                closeOnRootNodeClick={false}
                onClose={onClose}
            >
                <Modal.Header>
                    <Icon name="user add" /> 중요 거래처 추가
                </Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Input ref={(c) => {this.inpName = c;}} error={validate.name} label='이름 또는 회사명' placeholder='이름 또는 회사명을 적어주세요' required onChange={(evt, dat) => { this.setState({data: {name: dat.value.trim()}}); }} />
                        <Form.Input ref={(c) => {this.inpPhone = c;}} error={validate.phone} label='연락처' placeholder='연락처(ex. 012-3456-7890)를 적어주세요' required onChange={(evt, dat) => { this.setState({data: {phone: dat.value.trim()}}); }} />
                        <Form.Input label='주 소' placeholder='거래처의 주소를 적어주세요' onChange={(evt, dat) => { this.setState({data: {address: dat.value.trim()}}); }} />
                        <Form.Input label='담당자 이름' placeholder='담당자님이 있으면 적어주세요' onChange={(evt, dat) => { this.setState({data: {manager: dat.value.trim()}}); }} />
                        <Form.Input label='담당자 연락처' placeholder='담당자님의 연락처를 적어주세요' onChange={(evt, dat) => { this.setState({data: {manager_phone: dat.value.trim()}}); }} />
                        <Form.Input label='기본 문구' placeholder='거래처의 기본적인 리본글씨 문구를 적어주세요' onChange={(evt, dat) => { this.setState({data: {def_ribtext: dat.value.trim()}}); }} />
                        <Form.Input label='간략한 설명' placeholder='거래처의 간략한 설명을 적어주세요' onChange={(evt, dat) => { this.setState({data: {description: dat.value.trim()}}); }} />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={onClose}>취소</Button>
                    <Button
                        positive
                        labelPosition="right"
                        icon="checkmark"
                        content="확인"
                        onClick={handleOrdererAdd}/>
                </Modal.Actions>
            </Modal>
        );
    }
}

OrdererAddModal.propTypes = {
    open: PropTypes.bool,
    className: PropTypes.string,
    onClose: PropTypes.func,
    onOrdererAdd: PropTypes.func
};

export default OrdererAddModal;