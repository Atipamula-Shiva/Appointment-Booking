import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import useSnackbar from '../common/Snackbar';
import shopOwnerApi from '../services/shopOwnerApi';

// Enhanced Icons
const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#667eea"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z" fill="#ef4444"/>
  </svg>
);

const AddIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="white"/>
  </svg>
);

const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
);

const OrdersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
  </svg>
);

const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p className="loading-text">Loading your dashboard...</p>
  </div>
);

const StatCard = ({ title, value, icon, color }) => (
  <div className="stat-card" style={{ borderTop: `3px solid ${color}` }}>
    <div className="stat-card-content">
      <div>
        <p className="stat-title">{title}</p>
        <p className="stat-value">{value}</p>
      </div>
      <div className="stat-icon" style={{ color }}>
        {icon}
      </div>
    </div>
  </div>
);

function ShopOwnerDashboard() {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [shop, setShop] = useState(null);
  const [shopForm, setShopForm] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    image_url: '',
    latitude: 0,
    longitude: 0,
    is_open: true,
  });
  const [isNewShop, setIsNewShop] = useState(false);
  const [savingShop, setSavingShop] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({ name: '', description: '', price: '' });
  const [savingMenuItem, setSavingMenuItem] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchShopData();
  }, []);

  const fetchShopData = async () => {
    setLoading(true);
    const shopResult = await shopOwnerApi.getMyShop();

    if (shopResult.success && shopResult.data) {
      const shopDetails = shopResult.data;
      setShop(shopDetails);
      setIsNewShop(false);
      setShopForm({
        name: shopDetails.name || '',
        description: shopDetails.description || '',
        address: shopDetails.address || '',
        phone: shopDetails.phone || '',
        image_url: shopDetails.image_url || '',
        latitude: shopDetails.latitude || 0,
        longitude: shopDetails.longitude || 0,
        is_open: typeof shopDetails.is_open === 'boolean' ? shopDetails.is_open : true,
      });
    } else {
      setShop(null);
      setIsNewShop(true);
      if (shopResult.success === false) {
        const lowerErr = (shopResult.error || '').toString().toLowerCase();
        if (!lowerErr.includes('not found') && !lowerErr.includes('404')) {
          showSnackbar(shopResult.error || 'Failed to fetch shop', 'error', 3000);
        }
      }
    }

    const ordersResult = await shopOwnerApi.getIncomingOrders();
    if (ordersResult.success) {
      setOrders(ordersResult.data || []);
    }

    setLoading(false);
  };

  const handleFormChange = (field, value) => {
    setShopForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleShopSubmit = async () => {
    setSavingShop(true);
    try {
      const payload = {
        name: shopForm.name,
        description: shopForm.description,
        address: shopForm.address,
        phone: shopForm.phone,
        image_url: shopForm.image_url,
        latitude: Number(shopForm.latitude) || 0,
        longitude: Number(shopForm.longitude) || 0,
        ...(isNewShop ? {} : { is_open: shopForm.is_open }),
      };

      const result = isNewShop
        ? await shopOwnerApi.createShop(payload)
        : await shopOwnerApi.updateShop(payload);

      if (result.success) {
        setShop(result.data);
        setIsNewShop(false);
        showSnackbar(isNewShop ? 'Shop created successfully!' : 'Shop updated successfully!', 'success', 3000);
      } else {
        showSnackbar(result.error || 'Shop save failed', 'error', 3000);
      }
    } catch (err) {
      showSnackbar(err.message || 'Shop save failed', 'error', 3000);
    } finally {
      setSavingShop(false);
    }
  };

  const handleAddMenuItem = async () => {
    if (!newMenuItem.name || !newMenuItem.price) {
      showSnackbar('Please fill in name and price', 'error', 3000);
      return;
    }

    setSavingMenuItem(true);
    const result = await shopOwnerApi.createMenuItem({
      name: newMenuItem.name,
      description: newMenuItem.description,
      price: parseFloat(newMenuItem.price),
    });

    if (result.success) {
      setMenuItems([...menuItems, result.data]);
      setShowAddMenuModal(false);
      setNewMenuItem({ name: '', description: '', price: '' });
      showSnackbar('Menu item added successfully!', 'success', 3000);
    } else {
      showSnackbar(result.error || 'Failed to add menu item', 'error', 3000);
    }
    setSavingMenuItem(false);
  };

  const handleDeleteMenuItem = async (menuId) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      const result = await shopOwnerApi.deleteMenuItem(menuId);
      if (result.success) {
        setMenuItems(menuItems.filter((item) => item.id !== menuId));
        showSnackbar('Menu item deleted', 'success', 2000);
      } else {
        showSnackbar(result.error || 'Failed to delete menu item', 'error', 3000);
      }
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    const result = await shopOwnerApi.updateOrderStatus(orderId, newStatus);
    if (result.success) {
      setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)));
      showSnackbar('Order status updated', 'success', 2000);
    } else {
      showSnackbar(result.error || 'Failed to update order', 'error', 3000);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: { bg: '#fef3c7', text: '#92400e' },
      CONFIRMED: { bg: '#dbeafe', text: '#1e40af' },
      PREPARING: { bg: '#fed7aa', text: '#9b2c1d' },
      READY: { bg: '#dcfce7', text: '#166534' },
      DELIVERED: { bg: '#cffafe', text: '#0e7490' },
      CANCELLED: { bg: '#fee2e2', text: '#991b1b' },
    };
    return colors[status] || colors.PENDING;
  };

  const isMobile = windowWidth < 768;
  const activeOrders = orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status)).length;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="dashboard-container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .dashboard-container {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          min-height: 100vh;
          padding: ${isMobile ? '1rem' : '2rem'};
        }

        .dashboard-wrapper {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Header Styles */
        .header {
          margin-bottom: 2rem;
          animation: slideDown 0.5s ease;
        }

        .greeting {
          font-size: ${isMobile ? '24px' : '36px'};
          font-weight: 800;
          background: linear-gradient(135deg, #1e293b, #334155);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }

        .shop-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: white;
          border-radius: 12px;
          color: #64748b;
          font-size: 14px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          animation: fadeInUp 0.5s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.02);
        }

        .stat-card-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-title {
          color: #64748b;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 800;
          color: #1e293b;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 16px;
        }

        /* Tabs */
        .tabs-container {
          background: white;
          border-radius: 16px;
          padding: 0.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .tabs {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .tab-button {
          flex: 1;
          padding: 12px 20px;
          background: transparent;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: #64748b;
        }

        .tab-button.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 4px 6px -1px rgba(102, 126, 234, 0.3);
        }

        .tab-button:not(.active):hover {
          background: #f1f5f9;
          color: #667eea;
        }

        /* Content Cards */
        .content-card {
          background: white;
          border-radius: 24px;
          padding: ${isMobile ? '1.5rem' : '2rem'};
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
          animation: fadeInUp 0.5s ease;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .card-title {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
        }

        /* Form Styles */
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          margin-bottom: 0.5rem;
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input, .form-select {
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 14px;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        /* Button Styles */
        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Menu Items Grid */
        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .menu-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 1.25rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .menu-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
          border-color: #cbd5e1;
        }

        .menu-name {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .menu-description {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .menu-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }

        .menu-price {
          font-size: 20px;
          font-weight: 800;
          color: #667eea;
        }

        .menu-actions {
          display: flex;
          gap: 0.5rem;
        }

        .icon-button {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .icon-button:hover {
          background: #f1f5f9;
          transform: scale(1.1);
        }

        /* Orders Table */
        .orders-table-container {
          overflow-x: auto;
        }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
        }

        .orders-table th {
          text-align: left;
          padding: 1rem;
          font-weight: 600;
          color: #64748b;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #e2e8f0;
        }

        .orders-table td {
          padding: 1rem;
          font-size: 14px;
          color: #1e293b;
          border-bottom: 1px solid #e2e8f0;
        }

        .orders-table tr {
          transition: background-color 0.2s ease;
        }

        .orders-table tr:hover {
          background-color: #f8fafc;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-select {
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .status-select:focus {
          outline: none;
          border-color: #667eea;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        .modal {
          background: white;
          border-radius: 24px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          animation: slideUp 0.3s ease;
        }

        .modal-title {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1.5rem;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1.5rem;
        }

        /* Loading Spinner */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: 1rem;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-text {
          color: #64748b;
          font-size: 16px;
        }

        /* Animations */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="dashboard-wrapper">
        {/* Header */}
        <div className="header">
          <h1 className="greeting">
            Welcome back, {user?.name?.split(' ')[0] || 'Shop Owner'}! 👋
          </h1>
          {shop && (
            <div className="shop-badge">
              <span>🏪</span>
              <span>Managing {shop.name}</span>
            </div>
          )}
        </div>

        {/* Stats Overview */}
        {!isNewShop && (
          <div className="stats-grid">
            <StatCard
              title="Total Menu Items"
              value={menuItems.length}
              icon={<MenuIcon />}
              color="#667eea"
            />
            <StatCard
              title="Active Orders"
              value={activeOrders}
              icon={<OrdersIcon />}
              color="#f59e0b"
            />
            <StatCard
              title="Total Orders"
              value={orders.length}
              icon={<DashboardIcon />}
              color="#10b981"
            />
          </div>
        )}

        {/* Tabs */}
        <div className="tabs-container">
          <div className="tabs">
            {[
              { id: 'overview', label: 'Overview', icon: <DashboardIcon /> },
              { id: 'menu', label: 'Menu', icon: <MenuIcon /> },
              { id: 'orders', label: 'Orders', icon: <OrdersIcon /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-title">
                {isNewShop ? '✨ Create Your Shop' : '⚙️ Shop Settings'}
              </h2>
            </div>
            
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              {isNewShop
                ? 'Get started by creating your shop. Fill in the details below to list your business.'
                : 'Keep your shop information up to date to provide the best experience for your customers.'}
            </p>

            <div className="form-grid">
              {[
                { label: '🏪 Shop Name', key: 'name', placeholder: 'Your amazing shop name', type: 'text' },
                { label: '📞 Phone', key: 'phone', placeholder: '+1 555 1234', type: 'text' },
                { label: '📍 Address', key: 'address', placeholder: 'Full shop address', type: 'text' },
                { label: '🗺️ Latitude', key: 'latitude', placeholder: '0.0000', type: 'number' },
                { label: '🗺️ Longitude', key: 'longitude', placeholder: '0.0000', type: 'number' },
                { label: '🖼️ Image URL', key: 'image_url', placeholder: 'https://...', type: 'text' },
              ].map((field) => (
                <div key={field.key} className="form-group">
                  <label className="form-label">{field.label}</label>
                  <input
                    type={field.type}
                    value={shopForm[field.key] ?? ''}
                    placeholder={field.placeholder}
                    onChange={(e) => handleFormChange(field.key, e.target.value)}
                    className="form-input"
                  />
                </div>
              ))}

              <div className="form-group">
                <label className="form-label">🔌 Shop Status</label>
                <select
                  value={shopForm.is_open ? 'open' : 'closed'}
                  onChange={(e) => handleFormChange('is_open', e.target.value === 'open')}
                  className="form-select"
                >
                  <option value="open">🟢 Open for Business</option>
                  <option value="closed">🔴 Currently Closed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">📝 Description</label>
                <textarea
                  value={shopForm.description ?? ''}
                  placeholder="Tell customers about your shop..."
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  className="form-input"
                  rows="3"
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleShopSubmit}
                disabled={savingShop}
                className="btn-primary"
              >
                {savingShop ? '⏳ Saving...' : (isNewShop ? '✨ Create Shop' : '💾 Save Changes')}
              </button>

              {!isNewShop && shop && (
                <span style={{ color: '#475569', fontSize: '14px' }}>
                  Status: <strong style={{ color: shopForm.is_open ? '#10b981' : '#ef4444' }}>
                    {shopForm.is_open ? 'Open' : 'Closed'}
                  </strong>
                </span>
              )}
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-title">🍽️ Menu Items</h2>
              <button
                onClick={() => setShowAddMenuModal(true)}
                className="btn-primary"
              >
                <AddIcon /> Add Menu Item
              </button>
            </div>

            {menuItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: '#64748b', marginBottom: '1rem' }}>No menu items yet</p>
                <button
                  onClick={() => setShowAddMenuModal(true)}
                  className="btn-primary"
                >
                  <AddIcon /> Add Your First Item
                </button>
              </div>
            ) : (
              <div className="menu-grid">
                {menuItems.map((item) => (
                  <div key={item.id} className="menu-card">
                    <h3 className="menu-name">{item.name}</h3>
                    {item.description && (
                      <p className="menu-description">{item.description}</p>
                    )}
                    <div className="menu-footer">
                      <span className="menu-price">${item.price?.toFixed(2) || '0.00'}</span>
                      <div className="menu-actions">
                        <button className="icon-button" title="Edit">
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDeleteMenuItem(item.id)}
                          className="icon-button"
                          title="Delete"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-title">📦 Incoming Orders</h2>
              <div className="shop-badge">
                <span>{activeOrders} active orders</span>
              </div>
            </div>

            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: '#64748b' }}>No orders yet</p>
                <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '0.5rem' }}>
                  When customers place orders, they'll appear here
                </p>
              </div>
            ) : (
              <div className="orders-table-container">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      const statusStyle = getStatusColor(order.status);
                      return (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>
                            <div>
                              <div style={{ fontWeight: '600' }}>{order.customer_name || 'Anonymous'}</div>
                              {order.customer_phone && (
                                <div style={{ fontSize: '12px', color: '#64748b' }}>{order.customer_phone}</div>
                              )}
                            </div>
                          </td>
                          <td>
                            <strong>${order.total_amount?.toFixed(2) || '0.00'}</strong>
                          </td>
                          <td>
                            <span
                              className="status-badge"
                              style={{
                                background: statusStyle.bg,
                                color: statusStyle.text,
                              }}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <select
                              value={order.status}
                              onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                              className="status-select"
                            >
                              <option value="PENDING">⏳ Pending</option>
                              <option value="CONFIRMED">✓ Confirmed</option>
                              <option value="PREPARING">👨‍🍳 Preparing</option>
                              <option value="READY">✅ Ready</option>
                              <option value="DELIVERED">🚚 Delivered</option>
                              <option value="CANCELLED">❌ Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Menu Item Modal */}
      {showAddMenuModal && (
        <div className="modal-overlay" onClick={() => setShowAddMenuModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Add New Menu Item</h3>
            <div className="form-group">
              <label className="form-label">Item Name *</label>
              <input
                type="text"
                value={newMenuItem.name}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                placeholder="e.g., Margherita Pizza"
                className="form-input"
                autoFocus
              />
            </div>
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Description</label>
              <textarea
                value={newMenuItem.description}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
                placeholder="Brief description of the item..."
                className="form-input"
                rows="3"
              />
            </div>
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Price *</label>
              <input
                type="number"
                step="0.01"
                value={newMenuItem.price}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                placeholder="0.00"
                className="form-input"
              />
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setShowAddMenuModal(false)}
                style={{
                  padding: '10px 20px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddMenuItem}
                disabled={savingMenuItem}
                className="btn-primary"
              >
                {savingMenuItem ? 'Adding...' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShopOwnerDashboard;