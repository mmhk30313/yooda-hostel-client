import React, { Component } from 'react';
import {Modal, Input, Select, Col, Row, Form, message, notification} from 'antd';
import * as student_api from '../../../services/student_api';
const {Option} = Select;
export default class AddEditStudent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            fullName: '',
            roll: '',
            class_name: '',
            hall: '',
            age: '',
            status: '',
            isEditable: false,
        }
    }

    componentWillMount(props){

        const {_id, fullName, roll, class: class_name, hall, age, status} = this.props.editableData;
        this.setState({
            visible: this.props.visible,
            isEditable: this.props.isEditable,
            fullName, roll, class_name, hall, age, status, _id,
        })
    }

    handleUpdate = async () => {
        const {_id, fullName, roll, class_name, hall, age, status} = this.state;
        if(!fullName || !roll ){
            message.destroy();
            message.error('Please fill the fields of name and roll');
            return;
        }
        const payload = {_id,fullName, roll, class: class_name, hall, age, status};
        const check_duplicate = await this.checkDuplicate({_id, roll});
        // console.log(check_duplicate);
        if(!check_duplicate){
            // this.props.addStudent(payload);
            this.setState({
                visible: false,
                fullName: '', 
                roll: '', 
                hall: '', 
                class_name: '', 
                age: '', 
                status: ''
                
            }, () => this.props.updateStudent(payload));

        }

    }

    checkDuplicate = async(dataObj) => {
        const check_duplicate = await student_api.checkDuplicate(dataObj);
        // console.log({check_duplicate});
        if(check_duplicate?.success){
            return false;
        }else{
            notification.destroy();
            notification.error({
                message: 'Duplicate Notification',
                description: check_duplicate.message,
            });
            return true;
        }
    }

    handleOk = async() => {
        const {fullName, roll, hall, class_name, age, status, isEditable} = this.state;
        // console.log({isEditable});
        if(isEditable){
            this.handleUpdate();
        }
        if(!fullName){
            message.destroy();
            message.warning('Please fill the full name of the student');
            return;
        }else if(!roll){
            message.destroy();
            message.warning('Please fill the roll number of the student');
            return;
        }else{
            const payload = {fullName, roll, class: class_name, hall, age, status};
            const check_duplicate = await this.checkDuplicate({roll});
            console.log({check_duplicate});
            if(!check_duplicate){
                // this.props.addStudent(payload);
                this.setState({
                    visible: false,
                    fullName: '', 
                    roll: '', 
                    hall: '', 
                    class_name: '', 
                    age: '', 
                    status: ''
                    
                }, () => this.props.addStudent(payload));
    
            }
        }

    };
    
    handleCancel = () => {
        this.setState({
            visible: false,
            fullName: '', 
            roll: '', 
            hall: '', 
            class_name: '', 
            age: '', 
            status: ''
        }, () => this.props.cancelAdd());
    };

  render() {
    // console.log({state: this.state});
    return <Modal
        title={`${this.state.isEditable ? "Update" : "Add"} Student`}
        visible={this.state.visible}
        onOk={this.state.isEditable ? this.handleUpdate: this.handleOk}
        onCancel={this.handleCancel}
    >
        <Form>
            <Row>
                <Col span={11} style={{marginTop: 5}}>
                    <label>Name</label>
                    <Input allowClear type="text" placeholder='Please Enter' value={this.state.fullName} onChange={(e) => this.setState({fullName: e.target.value})} />
                </Col>
                <Col span={11} style={{marginLeft: 8, marginTop: 5}}>
                    <label>Roll</label>
                    <Input allowClear type="text" placeholder='Please Enter' value={this.state.roll} onChange={(e) => this.setState({roll: e.target.value})} />
                </Col>
                <Col span={11} style={{marginTop: 5}}>
                    <label>Class</label>
                    <Input allowClear type="text" placeholder='Please Enter' value={this.state.class_name} onChange={(e) => this.setState({class_name: e.target.value})} />
                </Col>
                <Col span={11} style={{marginLeft: 8, marginTop: 5}}>
                    <label>Hall</label>
                    <Input allowClear type="text" placeholder='Please Enter' value={this.state.hall} onChange={(e) => this.setState({hall: e.target.value})} />
                </Col>
                <Col span={11} style={{marginTop: 5}}>
                    <label>Age</label>
                    <Input allowClear type="text" placeholder='Please Enter' value={this.state.age} onChange={(e) => this.setState({age: e.target.value})} />
                </Col>
                <Col span={11} style={{marginLeft: 8, marginTop: 5}}>
                    <label>Status</label>
                    <Select
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Select a status"
                        value={this.state.status || "Select a status"}
                        onChange={(value) => this.setState({status: value})}
                    >
                        <Option value="active">Active</Option>
                        <Option value="inActive">Inactive</Option>
                    </Select>
                </Col>
            </Row>
        </Form>

    </Modal>;
  }
}
