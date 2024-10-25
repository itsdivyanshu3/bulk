import apiInstance from './apiInstance'; // Use the centralized Axios instance

export const api = {
    auth: {
        register: (data: any) => apiInstance.post('/auth/register', data),
        login: (data: any) => apiInstance.post('/auth/login', data),
        getUser: () => apiInstance.get('/auth/user'),
    },
    users: {
        index: () => apiInstance.get('/users'),
        createUser: (data: any) => apiInstance.post('/users', data),
        updateUserRole: (id: number, data: { user_type: string }) => apiInstance.put(`/users/${id}/role`, data),
    },
    products: {
        all: () => apiInstance.get('/products'),
        getProductById: (id: any) => apiInstance.get(`/products/${id}`),
        addProduct: (data: any) => apiInstance.post('/products', data),
        updateProduct: (id: any, data: any) => apiInstance.put(`/products/${id}`, data),
        deleteProduct: (id: any) => apiInstance.delete(`/products/${id}`),
        deleteAllProducts: () => apiInstance.delete('/products/delete-all'),
        bulkUpload: (data: any) => apiInstance.post('/products/bulk', data),
    },
    invoices: {
        create: (data: any) => apiInstance.post('/invoices', data),
        all: () => apiInstance.get('/invoices'),
        getById: (id: any) => apiInstance.get(`/invoices/${id}`),
        deleteInvoice: (id: any) => apiInstance.delete(`/invoices/${id}`),
    }
};
