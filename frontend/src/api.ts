import axios from "axios";
import { LIVE_URL } from "./config";

export const api = axios.create({
  baseURL: LIVE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
