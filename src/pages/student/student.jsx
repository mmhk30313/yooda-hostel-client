import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Divider, Select, message, notification, Card, Row, Col } from 'antd';
import {DeleteOutlined, EditOutlined, NotificationOutlined} from '@ant-design/icons';
import * as student_api from '../../services/student_api';
import AddEditStudent from './components/addEditStudent';
import FoodDistribution from './components/foodDistribution';
const { Option } = Select;

class Student extends PureComponent {
    constructor() {
        super();
        this.state = {
            selectedRowKeys: [],
            loading: false,
            studentList: [],
            columns: [],
            pageNumber: 1,
            nPerPage: 5,
            totalData: 0,
            is_bulk_active: false,
            bulk_action: '',
            editableData: false,
            isEditable: false,
            // add student
            isStudentAddModalShow: false,
            // distribution food
            isDistribution: false,
        };
    }

    componentDidMount() {
        this.getStudents();
    };

    addingStudent = async (dataObj) => {
        const {roll} = dataObj;
        if(!roll){
            message.destroy();
            message.error('Please fill roll number of the student');
            return;
        }
        const payload = {...dataObj};
        const addStudentRes = await student_api.addStudent(payload);
        if (addStudentRes?.success) {
            this.setState({
                showAddEditStudentModal: false,
                
            },() => this.getStudents())
        }
    };
    
    cancelAdd = () => {
        console.log("Cancel Add");
        this.setState({showAddEditStudentModal: false});
    }
    
    getStudents = async () => {
        const student_res = await student_api.getStudents({pageNumber: this.state.pageNumber, 
            nPerPage: this.state.nPerPage});
        // console.log({student_res});
        if (student_res?.success) {
            const columns = [
                {
                    title: 'Roll',
                    dataIndex: 'roll',
                    key: 'roll',

                },
                {
                    title: 'Name',
                    dataIndex: 'fullName',
                    key: 'name',
                },
                {
                    title: 'Age',
                    dataIndex: 'age',
                    key: 'age',
                },
                {
                    title: 'Class',
                    dataIndex: 'class',
                    key: 'class',
                },
                {
                    title: 'Hall',
                    dataIndex: 'hall',
                    key: 'hall',
                },
                {
                    title: 'Created At',
                    dataIndex: 'createdAt',
                    key: 'createdAt',
                    render: (text, record) => <span>{new Date(record.createdAt).toLocaleString()}</span>,
                },
                {
                    title: 'Status',
                    dataIndex: 'status',
                    key: 'status',
                    render: (text, record) => {
                        if(record.status === 'active'){
                            return <span style={{color: 'green'}}>{"Active"}</span>;
                        } else if(record.status === 'inActive'){
                            return <span style={{color: 'red'}}>{"Inactive"}</span>;
                        }
                        return <span style={{color: 'blue'}}>{"Already serve"}</span>;
                    }
                },
                {
                    title: 'Distribution',
                    dataIndex: 'roll',
                    key: 'distribution',
                    align: 'center',
                    render: (roll, record) => {
                        return <span style={{color: '#bd07b1', cursor: 'pointer'}} onClick={() => this.setState({isDistribution: true, fordDisRoll: roll})}><NotificationOutlined/></span>
                    }
                },
                {
                    title: 'Action',
                    dataIndex: '_id',
                    key: 'action',
                    align: 'right',
                    width: '15%',
                    render: (text, record) => (
                        <Fragment>
                            <span style={{color: "blue", cursor: 'pointer'}} onClick={() =>  this.setState({showAddEditStudentModal: true, isEditable: true, editableData: record})}><EditOutlined /></span>
                            {/* <Button type="primary" onClick={() => this.editStudent(record)} >Edit</Button> */}
                            <Divider type="vertical" />
                            <span style={{color: "red", cursor: 'pointer'}} onClick={() => this.deleteStudent(record)}><DeleteOutlined /></span>
                            {/* <Button type="danger" onClick={() => this.deleteStudent(record)}>Delete</Button> */}
                        </Fragment>
                    )
                }
            ];

            this.setState({
                studentList: student_res.data,
                totalData: student_res.data_length,
                columns,
                loading: true,

            }, () => {
                setTimeout(() => {
                    this.setState({
                        loading: false,
                    });
                }, 1000);
            });

        }else{
            message.destroy();
            message.error(student_res.message);
            this.setState({studentList: [], totalData: 0, loading: false});
        }
    };

    foodDistribution = async (dataObj) => {
        const payload = {...dataObj};
        console.log({payload});
        this.editStudent(payload, true);
        // const res = await student_api.foodDistribution(payload);
        // if(res?.success){
        //     message.destroy();
        //     message.success(res.message);
        //     this.getStudents();
        // }else{
        //     message.destroy();
        //     message.error(res.message);
        // }
    }

    editStudent = async(data, forDistribution = false) => {
        // console.log({data});
        const update_res = await student_api.updateStudent(data);
        if(update_res?.success){
            if(forDistribution){
                notification.destroy();
                notification.success({
                    message: 'Food Distribution',
                    description: 'Food distribution successfully',
                });
            }
            this.setState({showAddEditStudentModal: false, isEditable: false, isDistribution: false}, () => this.getStudents());
        }
    };
    
    cancelEdit = () => {
        this.setState({showAddEditStudentModal: false, isEditable: false, isDistribution: false});
    };

    deleteStudent = async(data) => {
        // console.log({data});
        const delete_res = await student_api.deleteStudent(data._id);
        if(delete_res?.success){
            this.getStudents();
            notification.warning({
                message: 'Notification',
                description: delete_res.message,
            });
        }else{
            message.error(delete_res.message);
        }
    };

    bulk_update = async() => {
        this.setState({ is_bulk_active: true });
        // ajax request after empty completing
        const { selectedRowKeys, bulk_action } = this.state;
        // console.log({selectedRowKeys});
        if (selectedRowKeys.length === 0) {
            message.destroy();
            message.error('Please select at least one student');
            return;
        }
        const payload = {bulk_ids: selectedRowKeys, status: bulk_action};
        console.log({payload});
        const bulk_res = await student_api.bulkUpdate_status(payload);
        if(bulk_res?.success){
            this.getStudents();
            message.success(bulk_res.message);
        }else{
            message.error(bulk_res.message);
        }
        setTimeout(() => {
          this.setState({
            selectedRowKeys: [],
            is_bulk_active: false,
            bulk_action: '',
          });
        }, 1000);
    };

    onSelectChange = (selectedRowKeys) => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };

    render() {
        const { loading, selectedRowKeys, columns, is_bulk_active } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        // console.log({rowSelection});
        const hasSelected = selectedRowKeys.length > 0;

        // console.log({showModal: this.state.showAddEditStudentModal});
        // console.log({showModal: this.state.isDistribution});
        return (
            <Card 
                title={
                    <Fragment>
                        <Row style={{marginBottom: 8}}>
                            <Col>
                                <Select 
                                    type="primary"
                                    allowClear
                                    disabled={!hasSelected} 
                                    loading={is_bulk_active}
                                    value={this.state.bulk_action || 'Select Action'}
                                    placeholder="Select Action"
                                    onChange={(value) => {
                                        // console.log({value});
                                        this.setState({bulk_action: value});
                                    }}
                                >
                                    <Option key={1} value={"active"}>Active</Option>
                                    <Option key={2} value={"inActive"}>Inactive</Option>
                                </Select>
                            
                            </Col>
                            <Col span={4} style={{marginLeft: 8}}>
                                <Button 
                                    type="primary"
                                    disabled={!this.state.bulk_action}
                                    onClick={this.bulk_update}
                                >Updated</Button>
                            </Col>
                        </Row>
                        <Fragment>
                                {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                        </Fragment>
                    </Fragment>
                }

                extra={
                    <Fragment>
                        <Button type="primary" onClick={() => this.setState({showAddEditStudentModal: true})}>
                            Add Student
                        </Button>
                    </Fragment>
                }
            >
                {
                    this.state.showAddEditStudentModal
                    ? <AddEditStudent
                        visible={this.state.showAddEditStudentModal}  
                        cancelAdd={this.cancelAdd}
                        addStudent={this.addingStudent}
                        editableData={this.state.editableData}
                        updateStudent={this.editStudent}
                        isEditable={this.state.isEditable}
                    />
                    : null
                }
                {
                    this.state.isDistribution
                    ? <FoodDistribution 
                        cancelDistribution={this.cancelEdit}
                        visible={true}
                        studentRoll={this.state.fordDisRoll} 
                        foodDistribution={this.foodDistribution} />
                    : null
                }
                <Table 
                    bordered
                    style={{fontSize: '14px'}}
                    rowSelection={rowSelection} 
                    rowKey={record => record._id}
                    columns={columns} 
                    dataSource={this.state.studentList} 
                    loading={this.state.loading}
                    pagination={{
                        total: this.state.totalData,
                        pageSize: this.state.nPerPage,
                        onChange: (page, pageSize) => {
                            this.setState({pageNumber: page}, () => this.getStudents());
                        },
                    }}
                />
            </Card>
        );
    }
}

export default Student;