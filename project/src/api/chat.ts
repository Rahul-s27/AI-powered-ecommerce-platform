import axios from 'axios';

export const sendMessage = async (message: string, model = "deepseek-ai/deepseek-chat") => {
  const response = await axios.post('http://localhost:8000/api/chat', { message, model });
  return response.data.reply;
};
