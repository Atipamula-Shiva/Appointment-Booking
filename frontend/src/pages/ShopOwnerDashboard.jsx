import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import useSnackbar from '../common/Snackbar';
import shopOwnerApi from '../services/shopOwnerApi';

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#667eea" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
    <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);

const DeleteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#ef4444" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z" />
  </svg>
);

const AddIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

const LoadingSpinner = () => (
  <div style={{ textAlign: 'center', padding: '2rem' }}>
    <div style={{ fontSize: '16px', color: '#667eea', marginBottom: '1rem' }}>Loading...</div>
    <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTop: '4px solid #667eea', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
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
  const [activeTab, setActiveTab] = useState('overview'); // overview, menu, orders
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
    // Fetch shop details
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
      // If not found or empty payload, initialize as new shop
      setShop(null);
      setIsNewShop(true);

      if (shopResult.success === false) {
        const lowerErr = (shopResult.error || '').toString().toLowerCase();
        if (!lowerErr.includes('not found') && !lowerErr.includes('404')) {
          showSnackbar(shopResult.error || 'Failed to fetch shop', 'error', 3000);
        }
      }
    }

    // Fetch menu items
    const menuResult = await shopOwnerApi.getMenuItems();
    if (menuResult.success) {
      setMenuItems(menuResult.data || []);
    }

    // Fetch orders
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
        showSnackbar(isNewShop ? 'Shop created successfully.' : 'Shop updated successfully.', 'success', 3000);
      } else {
        showSnackbar(result.error || 'Shop save failed', 'error', 3000);
      }
    } catch (err) {
      showSnackbar(err.message || 'Shop save failed', 'error', 3000);
    } finally {
      setSavingShop(false);
    }
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

  const isMobile = windowWidth < 768;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: isMobile ? '1rem' : '2rem' }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>
            Welcome, {user?.name || 'Shop Owner'}!
          </h1>
          {shop && <p style={{ color: '#64748b', fontSize: '14px' }}>Managing {shop.name}</p>}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e2e8f0', flexWrap: 'wrap' }}>
          {['overview', 'menu', 'orders'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 20px',
                background: activeTab === tab ? '#667eea' : 'transparent',
                color: activeTab === tab ? 'white' : '#64748b',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                borderRadius: activeTab === tab ? '10px 10px 0 0' : '0',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab) {
                  e.target.style.color = '#667eea';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) {
                  e.target.style.color = '#64748b';
                }
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div style={{ background: 'white', borderRadius: '15px', padding: isMobile ? '1.5rem' : '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '0.75rem' }}>
              {isNewShop ? 'Create Your Shop' : 'Shop Details & Settings'}
            </h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              {isNewShop
                ? 'No shop found for your account yet. Fill the details below to create your shop.'
                : 'Edit your shop details and keep your listing up to date.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
              {[
                { label: 'Shop Name', key: 'name', placeholder: 'Your shop name' },
                { label: 'Phone', key: 'phone', placeholder: '+1 555 1234' },
                { label: 'Address', key: 'address', placeholder: 'Shop address' },
                { label: 'Latitude', key: 'latitude', placeholder: '0' },
                { label: 'Longitude', key: 'longitude', placeholder: '0' },
                { label: 'Image URL', key: 'image_url', placeholder: 'https://...' },
              ].map((field) => (
                <div key={field.key} style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '6px', color: '#64748b', fontSize: '12px', fontWeight: '600' }}>{field.label}</label>
                  <input
                    type={['latitude', 'longitude'].includes(field.key) ? 'number' : 'text'}
                    value={shopForm[field.key] ?? ''}
                    placeholder={field.placeholder}
                    onChange={(e) => handleFormChange(field.key, e.target.value)}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '10px 12px',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
              ))}

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <label style={{ marginBottom: '6px', color: '#64748b', fontSize: '12px', fontWeight: '600' }}>Shop Status</label>
                <select
                  value={shopForm.is_open ? 'open' : 'closed'}
                  onChange={(e) => handleFormChange('is_open', e.target.value === 'open')}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '1.6rem', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={handleShopSubmit}
                disabled={savingShop}
                style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  opacity: savingShop ? 0.65 : 1,
                }}
              >
                {isNewShop ? (savingShop ? 'Creating...' : 'Create Shop') : (savingShop ? 'Saving...' : 'Save Changes')}
              </button>

              {!isNewShop && shop && (
                <span style={{ color: '#475569', fontSize: '14px' }}>
                  Shop is currently <strong>{shopForm.is_open ? 'Open' : 'Closed'}</strong>
                </span>
              )}
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div style={{ background: 'white', borderRadius: '15px', padding: isMobile ? '1.5rem' : '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>Menu Items</h2>
              <button
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.target.style.opacity = '1')}
              >
                <AddIcon /> Add Item
              </button>
            </div>

            {menuItems.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No menu items yet. Add your first item!</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {menuItems.map((item) => (
                  <div key={item.id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>{item.name}</h3>
                    {item.description && <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '0.5rem' }}>{item.description}</p>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '16px', fontWeight: '700', color: '#667eea' }}>${item.price || 0}</span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '5px' }}
                          title="Edit"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDeleteMenuItem(item.id)}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '5px' }}
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
          <div style={{ background: 'white', borderRadius: '15px', padding: isMobile ? '1.5rem' : '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '1.5rem' }}>Incoming Orders</h2>

            {orders.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No orders yet</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#64748b', fontSize: '12px' }}>Order ID</th>
                      <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#64748b', fontSize: '12px' }}>Customer</th>
                      <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#64748b', fontSize: '12px' }}>Amount</th>
                      <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#64748b', fontSize: '12px' }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#64748b', fontSize: '12px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background-color 0.2s ease' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                        <td style={{ padding: '12px', fontSize: '14px', color: '#1e293b' }}>#{order.id}</td>
                        <td style={{ padding: '12px', fontSize: '14px', color: '#1e293b' }}>{order.customer_name || 'Unknown'}</td>
                        <td style={{ padding: '12px', fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>${order.total_amount || 0}</td>
                        <td style={{ padding: '12px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '600',
                              background: order.status === 'PENDING' ? '#fef3c7' : order.status === 'CONFIRMED' ? '#dbeafe' : order.status === 'READY' ? '#dcfce7' : '#fee2e2',
                              color: order.status === 'PENDING' ? '#92400e' : order.status === 'CONFIRMED' ? '#1e40af' : order.status === 'READY' ? '#166534' : '#991b1b',
                            }}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <select
                            value={order.status}
                            onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '5px',
                              border: '1px solid #e2e8f0',
                              fontSize: '12px',
                              cursor: 'pointer',
                              background: 'white',
                              color: '#1e293b',
                            }}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="PREPARING">Preparing</option>
                            <option value="READY">Ready</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShopOwnerDashboard;
