import axios from "axios"
import { BASEURL } from "./utils/URL"

const instance = axios.create({
    baseURL: BASEURL
})

export default instance