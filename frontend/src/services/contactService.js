import { apiClient } from './api';

class ContactService {
  async sendMessage(messageData) {
    try {
      const response = await apiClient.post('/contact', messageData);
      return response.data;
    } catch (error) {
      console.error('Error sending contact message:', error);
      throw error;
    }
  }

  async getMessages() {
    try {
      const response = await apiClient.get('/contact/messages');
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  async deleteMessage(id) {
    try {
      const response = await apiClient.delete(`/contact/messages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
}

export default new ContactService();