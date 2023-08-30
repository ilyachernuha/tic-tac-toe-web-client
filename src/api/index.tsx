import axios from "axios";

export async function createUser(username: string, password: string) {
  console.log(import.meta.env.VITE_API_URL);
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
    console.error(error);
    return [true, null];
  }
}

export async function loginUser(username: string, password: string) {
  console.log(import.meta.env.VITE_API_URL);
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
    console.error(error);
    return [true, null];
  }
}
