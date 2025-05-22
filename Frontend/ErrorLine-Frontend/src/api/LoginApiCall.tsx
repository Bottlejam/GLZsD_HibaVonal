import axios from "axios";

export const loginUser = async (username: string, password: string): Promise<string> => {
  const response = await axios.post("https://localhost:5001/api/auth/login", {
    username,
    password
  });

  // Ha a token nem a response.data-ban, hanem máshol van, ezt módosítani kell
  const token = response.data.data; // Vagy pl. response.data.token, ha úgy jön
  return token;
};