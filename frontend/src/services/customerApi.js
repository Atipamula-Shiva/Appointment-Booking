import api from '../pages/api';

class CustomerApiService {
  /**
   * Fetch all available shops
   * GET /shops
   */
  async getAllShops() {
    try {
      const response = await api.get('/shops');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch shops';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Fetch menu items for a specific shop
   * GET /shops/{id}/menu
   */
  async getShopMenu(shopId) {
    try {
      const response = await api.get(`/shops/${shopId}/menu`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch menu';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Place a new order
   * POST /orders
   */
  async placeOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.message || 'Failed to place order';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Get customer's own bookings
   * GET /bookings/my
   */
  async getMyBookings() {
    try {
      const response = await api.get('/bookings/my');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch bookings';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}

export default new CustomerApiService();
