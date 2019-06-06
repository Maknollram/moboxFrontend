import axios from 'axios';

const api = axios.create({
    baseURL: 'https://mobox-app.herokuapp.com'
})

export default api