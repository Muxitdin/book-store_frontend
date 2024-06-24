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
    // books
    getAuth: async () => {
        const { data } = await api.get('/api/auth');
        return data;
    },
    getAllBooks: async () => {
        const { data } = await api.get("/api/books");
        return data
    },
    getAllBooksFilter: async (filter) => {
        const { data } = await api.get(`/api/books/filter`, filter);
        return data
    },
    deleteBook: async (id) => {
        const { data } = await api.delete(`/api/books/delete/${id}`);
        return data
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
    }
};

export default Service;