import {Modal, Input, Form} from 'antd';
import React, {useEffect, useState} from 'react';
import {updateFood} from '../../../services/food_api';
const Update = ({data, cancelEdit, isEditable, getFoods}) => {

    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    useEffect(() => {
        // console.log({isEditable});
        if(isEditable){
            setName(data.name);
            setPrice(data.price);
            setVisible(true);
        }
    }, ['']);

    const handleOk = async() => {
        const payload = { name, price, id: data._id };
        const updateFoodRes = await updateFood(payload);
        if(updateFoodRes?.success){
            setVisible(false);
            getFoods();
            cancelEdit();
        }
    }

    const handleCancel = () => {
        setVisible(false);
        setName("");
        setPrice("");
        cancelEdit();
    };

    return (
        <Modal
            title="Update a food"
            visible={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
        >
            <Form>
                <div>
                    <label>Name</label>
                    <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label>Price</label>
                    <Input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
            </Form>
        </Modal>
    );
};

export default Update;