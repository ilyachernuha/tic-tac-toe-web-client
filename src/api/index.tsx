import axios from "axios";

export async function createUser(username: string, password: string) {
  try {
    const response = await axios.post(
      `${new URL(import.meta.env.VITE_API_URL).origin}/create_user`,
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
    return [true, null];
  }
}

export async function loginUser(username: string, password: string) {
  try {
    const response = await axios.post(
      `${new URL(import.meta.env.VITE_API_URL).origin}/login`,
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
    return [true, null];
  }
}
