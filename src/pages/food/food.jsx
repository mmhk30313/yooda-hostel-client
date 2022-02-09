import { Divider, message, Table, notification, Row, Col, Card, Input, Button, Form, Skeleton, Modal } from 'antd';
import React, { Component, Fragment } from 'react';
import {getFoods, deleteFood, addFood} from '../../services/food_api';
import Update from './components/update';

export default class Food extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            price: '',
            food_list: [],
            columns: [],
            pageNumber: 1,
            nPerPage: 5,
            totalData: 0,
            editableData: false,
            isEditable: false,
            isAddFood: false,
        };
    }

    componentDidMount() {
        this.getFoods();
    };

    addingFood = async () => {
        const { name, price } = this.state;
        // console.log({ name, price });
        if(!name || !price){
            message.destroy();
            message.error('Please fill all the fields');
            return;
        }
        const payload = { name, price };
        const addFoodRes = await addFood(payload);
        if (addFoodRes?.success) {
            this.getFoods();
            this.setState({
                name: '',
                price: '',
            });
        }
    };

    editFood = (data) => {
        // console.log({data});
        this.setState({isEditable: true, editableData: data});
    };

    deleteFood = async(data) => {
        // console.log({data});
        const delete_res = await deleteFood(data._id);
        if(delete_res?.success){
            this.getFoods();
            notification.warning({
                message: 'Notification',
                description: delete_res.message,
            });
        }else{
            message.error(delete_res.message);
        }
    };

    getFoods = async() => {
        const food_res = await getFoods({pageNumber: this.state.pageNumber, 
            nPerPage: this.state.nPerPage});
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Price',
                dataIndex: 'price',
                key: 'price',
            },
            {
                title: 'Created At',
                dataIndex: 'createdAt',
                key: 'createdAt',
                render: (text, record) => <span>{new Date(record.createdAt).toLocaleString()}</span>,
            },
            {
                title: 'Action',
                dataIndex: '_id',
                key: 'action',
                align: 'right',
                render: (text, record) => (
                    <Fragment>
                        <a href="javascript:;" onClick={() => this.editFood(record)}>Edit</a>
                        <Divider type="vertical" />
                        <a href="javascript:;" onClick={() => this.deleteFood(record)}>Delete</a>
                    </Fragment>
                ),
            },
        ];
        if(food_res?.success){
            // message.destroy();
            this.setState({food_list: food_res.data, columns, 
                totalData: food_res.data_length, loading: true},
                () => setTimeout(() => {
                    this.setState({loading: false});
                }, 1000)
            );
            // message.success(`${food_res.message}`);
        }else{
            message.destroy();
            message.error(`${food_res.message}`);

            this.setState({food_list: [], columns, totalData: 0, loading: false});
        }
    }

    cancelEdit = () => {
        this.setState({isEditable: false});
    };

    render() {
        return <Fragment>
            {
                this.state.isEditable
                ? <Update cancelEdit={this.cancelEdit} isEditable={this.state?.isEditable} data={this.state.editableData} getFoods={this.getFoods} data={this.state?.editableData}/>
                : null
            }
        
            <Card
                style={{ width: '100%' }}
                title={<h1>Food List</h1>}
                extra={
                    <Button type="primary" onClick={() => this.setState({isAddFood: true})}>Add Food</Button>
                }
            >
                <Modal
                    title="Add Food"
                    visible={this.state.isAddFood}
                    onOk={() => this.addingFood()}
                    onCancel={() => this.setState({isAddFood: false})}
                >
                    <Form>
                        <Row>
                            <Col span={11}>
                                <label>Food name:</label>
                                <Input allowClear placeholder='Enter food name' type="text" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} />
                            </Col>
                            <Col span={11} style={{marginLeft: 10}}>
                                <label>Food price:</label>
                                <Input allowClear placeholder='Enter food price' type="text" value={this.state.price} onChange={(e) => this.setState({price: e.target.value})} />
                            </Col>

                        </Row>
                    </Form>
                    {/* <Button style={{margin: "10px 0"}} type="primary" onClick={() => this.addingFood()}>Add Food</Button> */}

                </Modal>
                <Skeleton loading={!this.state.columns.length} avatar>
                    <Table
                        bordered
                        style={{fontSize: '14px'}}
                        loading={this.state.loading}
                        scroll={{ x: '100%' }}
                        rowKey={record => record._id}
                        columns={this.state.columns}
                        dataSource={this.state.food_list}
                        pagination={{
                            total: this.state.totalData,
                            pageSize: this.state.nPerPage,
                            onChange: (page, pageSize) => {
                                this.setState({pageNumber: page}, () => this.getFoods());
                            },
                        }}
                    />
                </Skeleton>
            </Card>
        </Fragment>;
    }
}
