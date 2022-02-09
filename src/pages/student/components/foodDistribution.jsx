import React, { Component, Fragment } from 'react';
import {Modal, Select,message, notification, Form, Card, Descriptions, DatePicker, Skeleton} from 'antd';
import * as food_api from '../../../services/food_api';
import * as student_api from '../../../services/student_api';

const { Option } = Select;

export default class FoodDistribution extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible,
            _id: '',
            fullName: '',
            roll: '',
            class_name: '',
            hall: '',
            age: '',
            status: '',
            date: '',
            shift: '',
            foodItemList: [],
            foods: [],

        }
    }

    componentWillMount(){
        const { studentRoll} = this.props;
        this.findStudentByRoll(studentRoll);

    }

    findStudentByRoll = async (student_roll) => {
        const student_res = await student_api.getStudentByRoll(student_roll);
        if(!student_res?.success){
            message.destroy();
            message.error('Student not found');
            return;
        }
        console.log(student_res);
        const student = student_res.data;
        console.log({student});
        this.setState({
            fullName: student.fullName,
            roll: student.roll,
            class_name: student.class,
            hall: student.hall,
            age: student.age,
            status: student.status,
            hall: student.hall,
            shift: student.shift,
            givenFoods: student.foodItemList,
            _id: student._id,
            // visible: true,
        });
        this.findFoods();
    }

    findFoods = async () => {
        const food_res = await food_api.getAllFoods();
        console.log({food_res});
        if(!food_res?.success){
            message.destroy();
            message.error('Foods not found');
            return;
        }
        this.setState({
            foods: food_res.data,
        });
    }

    handleOk = () => {
        const {_id, date, shift, foodItemList} = this.state;
        if(!foodItemList.length){
            notification.destroy();
            notification.error({
                message: 'Foods not selected',
                description: 'Please select at least one food',
            });
            // message.destroy();
            // message.error('Please select at least one food');
            return;
        }
        const payload = {_id, status: "served", date, shift, foodItemList};
        this.props.foodDistribution(payload);
        this.setState({
            visible: false,
        }, () => this.props.cancelDistribution());
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        }, () => this.props.cancelDistribution());
    };


    render() {
        // console.log({state: this.state});
        return (
        <Modal
            title="Food Distribution"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
        

        >
            <Skeleton loading={!this.state._id}>
                <Descriptions title="Student Info">
                    <Descriptions.Item label="Name">{this.state.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Roll">{this.state.roll}</Descriptions.Item>
                    <Descriptions.Item label="Age">{this.state.age}</Descriptions.Item>
                    <Descriptions.Item label="Class">{this.state.class_name}</Descriptions.Item>
                    <Descriptions.Item label="Hall">
                        {this.state.hall}
                    </Descriptions.Item>
                    {
                        this.state.status === "served"
                        ? <Fragment>
                            <Descriptions.Item label="Status"><span style={{color: 'red'}}>Already Served</span></Descriptions.Item>
                        </Fragment>
                        : null
                    }
                </Descriptions>
                <Card>
                    <Form
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 16 }}
                    >
                        <Form.Item label="Shift">
                            <Select
                                showSearch
                                allowClear
                                placeholder="Select Shift"
                                optionFilterProp="children"
                                onChange={(value) => this.setState({shift: value})}
                            >
                                <Option value="Morning">Morning</Option>
                                <Option value="Evening">Evening</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Date">
                            <DatePicker onChange={(e) => {
                                console.log({date: e?._d});
                                this.setState({date: e?._d});
                            }} />
                        </Form.Item>
                        <Form.Item label="Foods" rules={[{ required: true }]}>
                            <Select
                                mode="multiple"
                                showSearch
                                allowClear
                                style={{ width: '100%' }}
                                placeholder="Select Foods"
                                onChange={(value) => this.setState({foodItemList: value})}
                            >
                                {
                                    this.state.foods.map((food) => {
                                        return <Option key={food._id} value={food._id}>{food.name}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </Card>
            </Skeleton>
        </Modal>
    )}
}
