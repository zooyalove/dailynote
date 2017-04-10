import React, { Component, PropTypes } from 'react';
import { Button, Form, Icon, Modal } from 'semantic-ui-react';

class OrdererAddModal extends Component {
    static propTypes = {
        open: PropTypes.bool,
        className: PropTypes.string,
        onClose: PropTypes.func,
        onOrdererAdd: PropTypes.func
    }

    state = {
        name: null,
        phone: null,
        address: null,
        manager: null,
        manager_phone: null,
        def_ribtext: null,
        description: null
    }

    render() {
        const { open, className, onClose, onOrdererAdd } = this.props;

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
                        <Form.Input label='이름 또는 회사명' placeholder='이름 또는 회사명을 적어주세요' />
                        <Form.Input label='연락처' placeholder='연락처(ex. 012-3456-7890)를 적어주세요' />
                        <Form.Input label='주 소' placeholder='거래처의 주소를 적어주세요' />
                        <Form.Input label='담당자 이름' placeholder='담당자님이 있으면 적어주세요' />
                        <Form.Input label='담당자 연락처' placeholder='담당자님의 연락처를 적어주세요' />
                        <Form.Input label='기본 문구' placeholder='거래처의 기본적인 리본글씨 문구를 적어주세요' />
                        <Form.Input label='간략한 설명' placeholder='거래처의 간략한 설명을 적어주세요' />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        negative
                        onClick={onClose}
                    >취소
                    </Button>
                    <Button
                        positive
                        labelPosition="right"
                        icon="checkmark"
                        content="확인"
                        onClick={onOrdererAdd}
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}

export default OrdererAddModal;