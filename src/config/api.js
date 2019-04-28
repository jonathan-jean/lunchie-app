import axios from "axios";
import { Alert } from "react-native";

const BASE_URL = "https://app-b6c93c54-5001-447b-a083-3fcc2c174cf1.cleverapps.io";
const TIMEOUT = 15000;
const HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

const client = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: HEADERS
});

export function alertError(message) {
  Alert.alert("Error", message);
}

export default client;
