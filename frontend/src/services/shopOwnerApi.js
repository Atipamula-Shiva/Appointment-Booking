import api from '../pages/api';

class ShopOwnerApiService {
  // ─── Shop ─────────────────────────────────────────────────────────────────

  async getMyShops() {
    try {
      const response = await api.get('/shops');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch shops' };
    }
  }

  async getMyShop() {
    try {
      const response = await api.get('/shop');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch shop details' };
    }
  }

  async createShop(shopData) {
    console.log("Creating shop with data:", shopData);
    try {
      const response = await api.post('/shop', shopData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || error.response?.data?.message || 'Failed to create shop' };
    }
  }

  async updateShop(shopId, shopData) {
    try {
      const response = await api.patch(`/shop/shop_update/${shopId}`, shopData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || error.response?.data?.message || 'Failed to update shop' };
    }
  }

  // ─── Services ─────────────────────────────────────────────────────────────

  async getServices() {
    try {
      const response = await api.get('/shop/services');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch services' };
    }
  }

  async addService(serviceData) {
    try {
      const response = await api.post('/shop/services', serviceData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || error.response?.data?.message || 'Failed to add service' };
    }
  }

  async updateService(serviceId, serviceData) {
    try {
      const response = await api.patch(`/shop/services/${serviceId}`, serviceData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || error.response?.data?.message || 'Failed to update service' };
    }
  }

  async deleteService(serviceId) {
    try {
      const response = await api.delete(`/shop/services/${serviceId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || error.response?.data?.message || 'Failed to delete service' };
    }
  }

  // ─── Slots ────────────────────────────────────────────────────────────────

  /**
   * Get all slots for the shop owner's shop
   * GET /shop/slots
   */
  async getSlots() {
    try {
      const response = await api.get('/shop/slots');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch slots' };
    }
  }

  /**
   * Create a new slot
   * POST /shop/slots
   * @param {Object} slotData - { service_id, date, start_time, end_time, capacity }
   */
  async createSlot(slotData) {
    try {
      const response = await api.post('/shop/slots', slotData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || error.response?.data?.message || 'Failed to create slot' };
    }
  }

  /**
   * Delete a slot
   * DELETE /shop/slots/{slotId}
   */
  async deleteSlot(slotId) {
    try {
      const response = await api.delete(`/shop/slots/${slotId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || error.response?.data?.message || 'Failed to delete slot' };
    }
  }

  // ─── Bookings ─────────────────────────────────────────────────────────────

  async getBookings(shopId) {
    try {
      const response = await api.get(`/shops/${shopId}/bookings`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch bookings' };
    }
  }

  async updateBookingStatus(bookingId, status) {
    try {
      const response = await api.patch(`/bookings/${bookingId}`, { status });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || error.response?.data?.message || 'Failed to update booking status' };
    }
  }

  // ─── Categories ───────────────────────────────────────────────────────────

  async getCategories() {
    try {
      const response = await api.get('/categories');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch categories' };
    }
  }

  // ─── Orders (legacy) ─────────────────────────────────────────────────────

  async getIncomingOrders() {
    try {
      const response = await api.get('/shop/orders');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch orders' };
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const response = await api.patch(`/shop/orders/${orderId}`, { status });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || error.response?.data?.message || 'Failed to update order status' };
    }
  }

  // Add this method to the ShopOwnerApiService class in shopOwnerApi.js

async getShopBookings() {
  try {
    const response = await api.get('/shop/bookings');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch bookings' };
  }
}

async updateBookingStatus(bookingId, status) {
  try {
    const response = await api.patch(`/shop/bookings/${bookingId}`, { status });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.detail || error.response?.data?.message || 'Failed to update booking status' };
  }
}
}

export default new ShopOwnerApiService();