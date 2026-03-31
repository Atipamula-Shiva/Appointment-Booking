import api from './api';

class ShopOwnerApiService {
  /**
   * Get shop owner's shop details
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
   * PATCH /shop
   */
  async updateShop(shopData) {
    try {
      const response = await api.patch('/shop', shopData);
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
   * Get all menu items for shop owner's shop
   * GET /shop/menu
   */
  async getMenuItems() {
    try {
      const response = await api.get('/shop/menu');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch menu items';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Add a new menu item
   * POST /shop/menu
   */
  async addMenuItem(menuData) {
    try {
      const response = await api.post('/shop/menu', menuData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.message || 'Failed to add menu item';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Update a menu item
   * PATCH /shop/menu/{id}
   */
  async updateMenuItem(menuId, menuData) {
    try {
      const response = await api.patch(`/shop/menu/${menuId}`, menuData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.message || 'Failed to update menu item';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Delete a menu item
   * DELETE /shop/menu/{id}
   */
  async deleteMenuItem(menuId) {
    try {
      const response = await api.delete(`/shop/menu/${menuId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.message || 'Failed to delete menu item';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Get all incoming orders for the shop owner
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
   * Update order status
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
