import { request } from "../utils/request";

export const addDistribution = (params) => {
    return request("/api/distribution/create", {
        method: "POST",
        body: params,
    });
}

export const getDistributions = (params) => {
    return request("/api/distribution/find/all", {
        method: "POST",
        body: params,
    });
}

export const updateDistribution = (params) => {
    return request("/api/distribution/update", {
        method: "POST",
        body: params,
    });
}

export const deleteDistribution = (id) => {
    return request("/api/distribution/delete/"+id, {
        method: "DELETE"
    });
}
