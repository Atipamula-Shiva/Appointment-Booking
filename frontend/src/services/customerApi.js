import api from '../pages/api';

class CustomerApiService {
  /**
   * Fetch all available shops
   * GET /shops
   */
  async getAllShops() {
    try {
      const response = await api.get('/shops');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch shops' };
    }
  }

  /**
   * Fetch menu items for a specific shop
   * GET /shops/{id}/menu
   */
  async getShopMenu(shopId) {
    try {
      const response = await api.get(`/shops/${shopId}/menu`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch menu' };
    }
  }

  /**
   * Fetch shop details with services
   * GET /shops/{id}
   */
  async getShop(shopId) {
    try {
      const response = await api.get(`/shops/${shopId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch shop details' };
    }
  }

  /**
   * Fetch available slots for a service
   * GET /services/{service_id}/slots
   * @param {string} serviceId
   * @param {string} [date] - optional date filter "YYYY-MM-DD"
   */
  async getServiceSlots(serviceId, date = null) {
    try {
      const params = {};
      if (date) {
        params.date = date;
      }
      
      console.log("Fetching slots:", `/services/${serviceId}/slots`, params);
      const response = await api.get(`/services/${serviceId}/slots`, { params });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("API Error:", error.response?.data);
      return { success: false, error: error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch slots' };
    }
  }

  /**
   * Create a new slot (if needed)
   * POST /slots
   */
  async createSlot(slotData) {
    try {
      const response = await api.post('/slots', slotData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Failed to create slot:", error.response?.data);
      return { success: false, error: error.response?.data?.detail || error.response?.data?.message || 'Failed to create slot' };
    }
  }

  /**
   * Create a new booking
   * POST /bookings
   */
  async createBooking(bookingData) {
    try {
      const response = await api.post('/bookings', {
        slot_id: bookingData.slot_id,
        service_id: bookingData.service_id,
        notes: bookingData.notes,
        date: bookingData.date,
        start_time: bookingData.start_time,
        end_time: bookingData.end_time
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Booking error:", error.response?.data);
      return { success: false, error: error.response?.data?.detail || error.response?.data?.message || 'Failed to create booking' };
    }
  }

  /**
   * Place a new order (legacy)
   * POST /orders
   */
  async placeOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || error.response?.data?.message || 'Failed to place order' };
    }
  }

  /**
   * Get customer's own bookings
   * GET /bookings/my
   */
  async getMyBookings() {
    try {
      const response = await api.get('/bookings/my');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch bookings' };
    }
  }
}

export default new CustomerApiService();