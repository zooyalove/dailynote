import React, { Component } from 'react';
import { Button, Form, Icon, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';

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
        const { open, className } = this.props;
        const { handleClose, handleOrdererAdd, state: { validate } } = this;

        return (
            <div>
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
                            <Form.Input error={validate.name} label="이름 또는 회사명" placeholder='이름 또는 회사명을 적어주세요' required onChange={(evt, dat) => { this.setState({data: {...this.state.data, name: dat.value.trim()}}); }} />
                            <Form.Input error={validate.phone} label="연락처" placeholder='연락처(ex. 012-3456-7890)를 적어주세요' required onChange={(evt, dat) => { this.setState({data: {...this.state.data, phone: dat.value.trim()}}); }} />
                            <Form.Input label='주 소' placeholder='거래처의 주소를 적어주세요' onChange={(evt, dat) => { this.setState({data: {...this.state.data, address: dat.value.trim()}}); }} />
                            <Form.Input label='담당자 이름' placeholder='담당자님이 있으면 적어주세요' onChange={(evt, dat) => { this.setState({data: {...this.state.data, manager: dat.value.trim()}}); }} />
                            <Form.Input label='담당자 연락처' placeholder='담당자님의 연락처를 적어주세요' onChange={(evt, dat) => { this.setState({data: {...this.state.data, manager_phone: dat.value.trim()}}); }} />
                            <Form.Input label='기본 문구' placeholder='거래처의 기본적인 리본글씨 문구를 적어주세요' onChange={(evt, dat) => { this.setState({data: {...this.state.data, def_ribtext: dat.value.trim()}}); }} />
                            <Form.Input label='간략한 설명' placeholder='거래처의 간략한 설명을 적어주세요' onChange={(evt, dat) => { this.setState({data: {...this.state.data, description: dat.value.trim()}}); }} />
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button negative onClick={handleClose}>취소</Button>
                        <Button
                            positive
                            labelPosition="right"
                            icon="checkmark"
                            content="확인"
                            onClick={handleOrdererAdd}/>
                    </Modal.Actions>
                </Modal>
            </div>
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