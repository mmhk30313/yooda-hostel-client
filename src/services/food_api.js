import { request } from "../utils/request";

export const getAllFoods = () => {
    return request("/api/food/get/all", {
        method: "GET",
    });
}

export const addFood = (params) => {
    return request("/api/food/create", {
        method: "POST",
        body: params,
    });
}

export const getFoods = (params) => {
    return request("/api/food/find/all", {
        method: "POST",
        body: params,
    });
}

export const updateFood = (params) => {
    return request("/api/food/update", {
        method: "POST",
        body: params,
    });
}

export const deleteFood = (id) => {
    return request("/api/food/delete/"+id, {
        method: "DELETE"
    });
}