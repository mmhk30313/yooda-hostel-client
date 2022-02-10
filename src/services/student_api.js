import { request } from "../utils/request";

export const getStudentByRoll = (roll) => {
    return request("/api/student/"+roll, {
        method: "GET"
    });
}

export const checkDuplicate = (params) => {
    return request("/api/student/check-duplicate", {
        method: "POST",
        body: params,
    });
}

export const bulkUpdate_status = (params) => {
    return request("/api/student/bulk_update_status", {
        method: "POST",
        body: params,
    });
}

export const addStudent = (params) => {
    return request("/api/student/create", {
        method: "POST",
        body: params,
    });
}

export const getStudents = (params) => {
    // console.log({params});

    return request("/api/student/find/all", {
        method: "POST",
        body: params,
    });
}

export const updateStudent = (params) => {
    return request("/api/student/update", {
        method: "POST",
        body: params,
    });
}

export const deleteStudent = (id) => {
    return request("/api/student/delete/"+id, {
        method: "DELETE"
    });
}