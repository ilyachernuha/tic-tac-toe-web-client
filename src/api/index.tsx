import axios from "axios";

const baseUrl = new URL(import.meta.env.VITE_API_URL).origin;

export async function getServerStatus() {
  try {
    await axios.get(`${baseUrl}/check_availability`);
    return [false, true];
  } catch (error) {
    console.error(error);
    return [true, null];
  }
}

export async function createUser(username: string, password: string) {
  try {
    const response = await axios.post(
      `${baseUrl}/create_user`,
      {},
      {
        auth: {
          username,
          password,
        },
      }
    );
    return [false, response];
  } catch (error) {
    console.error(error);
    return [true, null];
  }
}

export async function loginUser(username: string, password: string) {
  try {
    const response = await axios.post(
      `${baseUrl}/login`,
      {},
      {
        auth: {
          username,
          password,
        },
      }
    );
    return [false, response];
  } catch (error) {
    console.error(error);
    return [true, null];
  }
}

export async function startWaiting(token: string) {
  try {
    await axios.post(
      `${baseUrl}/start_waiting`,
      {},
      { headers: { Authorization: "Bearer " + token } }
    );
    return [false, true];
  } catch (error) {
    console.error(error);
    return [true, null];
  }
}

export async function stopWaiting(token: string) {
  try {
    await axios.post(
      `${baseUrl}/stop_waiting`,
      {},
      { headers: { Authorization: "Bearer " + token } }
    );
    return [false, true];
  } catch (error) {
    console.error(error);
    return [true, null];
  }
}

export async function getWaitingUsers(token: string) {
  try {
    const { data } = await axios.get(`${baseUrl}/waiting_users`, {
      headers: { Authorization: "Bearer " + token },
    });
    return [false, data.waiting_users];
  } catch (error) {
    console.error(error);
    return [true, null];
  }
}
