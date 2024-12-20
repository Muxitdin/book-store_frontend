import api from "./api.js";
import { getFromLocalStorage } from "./localstorage.js";

api.interceptors.request.use((req) => {
    const token = getFromLocalStorage("token");
    if (token) {
        req.headers.Authorization = token;
    }
    return req;
});

const Service = {
    getAuth: async () => {
        const { data } = await api.get('/api/auth');
        return data;
    },
    getAllBooks: async (filter) => {
        const { data } = await api.get("/api/books", filter);
        return data
    },
    getAllBooksFilter: async (filter) => {
        const { data } = await api.get(`/api/books/filter`, filter);
        return data
    },
    getAllBooksInCart: async () => {
        const { data } = await api.get('/api/books')
    },
    deleteBook: async (id) => {
        const { data } = await api.delete(`/api/books/delete/${id}`);
        return data
    },
    addBookToCart: async (userId, bookId) => {
        const { data } = await api.post(`/api/books/${userId}/${bookId}`)
        return data
    },
    removeBookFromCart: async (userId, itemId) => {
        const { data } = await api.delete(`/api/books/${userId}/rm/${itemId}`)
        return data
    },
    deleteBookFromCart: async (userId, itemId) => {
        const { data } = await api.delete(`/api/books/${userId}/del/${itemId}`)
        return data;
    },
    // category
    updateCategory: async (id, category) => {
        const { data } = await api.put(`/api/category/${id}`, category);
        return data
    },

    // auth
    createNewUser: async (user) => {
        const { data } = await api.post("/api/auth/register", user);
        return data
    },
    loginUser: async (user) => {
        const { data } = await api.post("/api/auth/login", user);
        return data
    },
    updateUser: async (id, field) => {
        const { data } = await api.put(`/api/auth/edit/${id}`, field);
        return data
    },
    sendVerificationEmail: async (params) => {
        console.log(params)
        const { data } = await api.get("/api/auth/user-verify", { params });
        return data
    },
    findUserByEmail: async (email) => {
        const { data } = await api.post('/api/auth/find-user-by-email', { email });
        return data;
    },
    updatePassword: async (userId, uniqueId, passwords) => {
        const { data } = await api.put(`/api/auth/update-password/${userId}/${uniqueId}`, passwords);
        return data;
    },
    payment: async (params) => {
        const { data } = await api.post('/api/auth/payment', params);
        return data;
    }
};

export default Service;