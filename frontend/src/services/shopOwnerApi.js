import api from '../pages/api';

class ShopOwnerApiService {
  /**
   * Get all shops for shop owner
   * GET /shops
   */
  async getMyShops() {
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
   * Get shop owner's shop details (single shop - legacy)
   * GET /shop
   */
  async getMyShop() {
    try {
      const response = await api.get('/shop');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch shop details';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Create a new shop
   * POST /shop
   */
  async createShop(shopData) {
    try {
      const response = await api.post('/shop', shopData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.message || 'Failed to create shop';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Update shop details
   * PATCH /shop/{id}
   */
  async updateShop(shopId, shopData) {
    try {
      const response = await api.patch(`/shop/${shopId}`, shopData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.message || 'Failed to update shop';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Get all services for a specific shop
   * GET /shops/{shopId}/services
   */
  async getServices(shopId) {
    try {
      const response = await api.get(`/shops/${shopId}/services`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch services';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Add a new service to a shop
   * POST /shops/{shopId}/services
   */
  async addService(shopId, serviceData) {
    try {
      const response = await api.post(`/shops/${shopId}/services`, serviceData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.message || 'Failed to add service';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Update a service
   * PATCH /shops/{shopId}/services/{serviceId}
   */
  async updateService(shopId, serviceId, serviceData) {
    try {
      const response = await api.patch(`/shops/${shopId}/services/${serviceId}`, serviceData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.message || 'Failed to update service';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Delete a service
   * DELETE /shops/{shopId}/services/{serviceId}
   */
  async deleteService(shopId, serviceId) {
    try {
      const response = await api.delete(`/shops/${shopId}/services/${serviceId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.message || 'Failed to delete service';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Get all bookings for a specific shop
   * GET /shops/{shopId}/bookings
   */
  async getBookings(shopId) {
    try {
      const response = await api.get(`/shops/${shopId}/bookings`);
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

  /**
   * Update booking status
   * PATCH /bookings/{id}
   */
  async updateBookingStatus(bookingId, status) {
    try {
      const response = await api.patch(`/bookings/${bookingId}`, { status });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.message || 'Failed to update booking status';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Get all incoming orders for the shop owner (legacy)
   * GET /shop/orders
   */
  async getIncomingOrders() {
    try {
      const response = await api.get('/shop/orders');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch orders';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Update order status (legacy)
   * PATCH /shop/orders/{id}
   */
  async updateOrderStatus(orderId, status) {
    try {
      const response = await api.patch(`/shop/orders/${orderId}`, { status });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.message || 'Failed to update order status';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}

export default new ShopOwnerApiService();