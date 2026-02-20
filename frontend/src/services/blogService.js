import { apiClient } from './api';

class BlogService {
  async getPosts() {
    try {
      const response = await apiClient.get('/blog/posts');
      return response.data;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  }

  async getPost(id) {
    try {
      const response = await apiClient.get(`/blog/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }
  }

  async createPost(postData) {
    try {
      const response = await apiClient.post('/blog/posts', postData);
      return response.data;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  }

  async updatePost(id, postData) {
    try {
      const response = await apiClient.put(`/blog/posts/${id}`, postData);
      return response.data;
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  }

  async deletePost(id) {
    try {
      const response = await apiClient.delete(`/blog/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  }
}

export default new BlogService();