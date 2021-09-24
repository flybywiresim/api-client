import axios from 'axios';

export function get<T>(url: URL, headers?: any): Promise<T> {
    return axios.get<T>(url.href, { headers })
        .then((res) => res.data);
}

export function del(url: URL, headers?: any): Promise<void> {
    return axios.delete(url.href, { headers })
        .then((res) => res.data);
}

export function post<T>(url: URL, body: any, headers?: any): Promise<T> {
    const headersToSend = {
        'Content-Type': 'application/json',
        ...headers,
    };

    return axios.post<T>(url.href, body, { headers: headersToSend })
        .then((res) => res.data);
}

export function put<T>(url: URL, body: any, headers?: any): Promise<T> {
    const headersToSend = {
        'Content-Type': 'application/json',
        ...headers,
    };

    return axios.put<T>(url.href, body, { headers: headersToSend })
        .then((res) => res.data);
}
