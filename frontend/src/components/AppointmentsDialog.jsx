import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import useSnackbar from '../common/Snackbar';
import shopOwnerApi from '../services/shopOwnerApi';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Avatar,
  Divider,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import StoreIcon from '@mui/icons-material/Store';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DescriptionIcon from '@mui/icons-material/Description';

function ShopOwnerDashboard() {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [shopForm, setShopForm] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    image_url: '',
    image_file: null,
    latitude: 0,
    longitude: 0,
    is_open: true,
    working_days: '',
    working_hours: '',
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [savingShop, setSavingShop] = useState(false);
  const [services, setServices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [newService, setNewService] = useState({ 
    category_id: '', 
    name: '', 
    description: '', 
    price: '', 
    duration_minutes: '', 
    image_url: '' 
  });
  const [savingService, setSavingService] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

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
    
    // Fetch all shops for the shop owner
    const shopsResult = await shopOwnerApi.getMyShops();
    if (shopsResult.success) {
      const shopsData = Array.isArray(shopsResult.data) ? shopsResult.data : [shopsResult.data].filter(Boolean);
      setShops(shopsData);
      if (shopsData.length > 0) {
        setSelectedShop(shopsData[0]); // Select first shop by default
      }
    } else {
      setShops([]);
      if (shopsResult.success === false) {
        const lowerErr = (shopsResult.error || '').toString().toLowerCase();
        if (!lowerErr.includes('not found') && !lowerErr.includes('404')) {
          showSnackbar(shopsResult.error || 'Failed to fetch shops', 'error', 3000);
        }
      }
    }

    setLoading(false);
  };

  const handleShopSelect = async (shop) => {
    setSelectedShop(shop);
    // Fetch services and orders for the selected shop
    const servicesResult = await shopOwnerApi.getServices();
    if (servicesResult.success) {
      setServices(servicesResult.data || []);
    }

    const ordersResult = await shopOwnerApi.getIncomingOrders();
    if (ordersResult.success) {
      setOrders(ordersResult.data || []);
    }
  };

  const handleCreateShop = () => {
    setShopForm({
      name: '',
      description: '',
      address: '',
      phone: '',
      image_url: '',
      image_file: null,
      latitude: 0,
      longitude: 0,
      is_open: true,
      working_days: '',
      working_hours: '',
    });
    setImagePreview(null);
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleEditShop = (shop) => {
    setShopForm({
      name: shop.name || '',
      description: shop.description || '',
      address: shop.address || '',
      phone: shop.phone || '',
      image_url: shop.image_url || '',
      image_file: null,
      latitude: shop.latitude || 0,
      longitude: shop.longitude || 0,
      is_open: typeof shop.is_open === 'boolean' ? shop.is_open : true,
      working_days: shop.working_days || '',
      working_hours: shop.working_hours || '',
    });
    setImagePreview(shop.image_url || null);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleFormChange = (field, value) => {
    setShopForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showSnackbar('Image size should be less than 5MB', 'error', 3000);
        return;
      }
      if (!file.type.startsWith('image/')) {
        showSnackbar('Please select an image file', 'error', 3000);
        return;
      }
      
      setShopForm(prev => ({ ...prev, image_file: file, image_url: '' }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShopSubmit = async () => {
    if (!shopForm.name.trim()) {
      showSnackbar('Shop name is required', 'error', 3000);
      return;
    }

    setSavingShop(true);
    try {
      let imageUrl = shopForm.image_url;

      // Handle image upload if there's a new file
      if (shopForm.image_file) {
        // For now, we'll assume the image is uploaded separately
        // In a real app, you'd upload to a cloud storage service
        imageUrl = imagePreview; // Use the preview as URL for now
      }

      const shopData = {
        ...shopForm,
        image_url: imageUrl,
      };

      let result;
      if (isEditing) {
        result = await shopOwnerApi.updateShop(shopData);
      } else {
        result = await shopOwnerApi.createShop(shopData);
      }

      if (result.success) {
        showSnackbar(isEditing ? 'Shop updated successfully!' : 'Shop created successfully!', 'success', 3000);
        setDialogOpen(false);
        fetchShopData(); // Refresh the shops list
      } else {
        showSnackbar(result.error || 'Failed to save shop', 'error', 3000);
      }
    } catch (error) {
      showSnackbar('An error occurred while saving the shop', 'error', 3000);
    } finally {
      setSavingShop(false);
    }
  };

  const handleAddService = async () => {
    if (!newService.name || !newService.price || !newService.duration_minutes) {
      showSnackbar('Please fill in name, price, and duration', 'error', 3000);
      return;
    }

    setSavingService(true);
    try {
      const payload = {
        name: newService.name,
        description: newService.description,
        price: parseFloat(newService.price),
        duration_minutes: parseInt(newService.duration_minutes),
        image_url: newService.image_url,
      };
      if (newService.category_id) {
        payload.category_id = newService.category_id;
      }
      const result = await shopOwnerApi.addService(payload);

      if (result.success) {
        setServices([...services, result.data]);
        setShowAddServiceModal(false);
        setNewService({ category_id: '', name: '', description: '', price: '', duration_minutes: '', image_url: '' });
        showSnackbar('Service added successfully!', 'success', 3000);
      } else {
        showSnackbar(result.error || 'Failed to add service', 'error', 3000);
      }
    } catch (err) {
      showSnackbar(err.message || 'Failed to add service', 'error', 3000);
    } finally {
      setSavingService(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      const result = await shopOwnerApi.deleteService(serviceId);
      if (result.success) {
        setServices(services.filter((item) => item.id !== serviceId));
        showSnackbar('Service deleted', 'success', 2000);
      } else {
        showSnackbar(result.error || 'Failed to delete service', 'error', 3000);
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
      PENDING: { bg: '#FEF3C7', text: '#92400E' },
      CONFIRMED: { bg: '#DBEAFE', text: '#1E40AF' },
      PREPARING: { bg: '#FED7AA', text: '#9B2C1D' },
      READY: { bg: '#DCFCE7', text: '#166534' },
      DELIVERED: { bg: '#CFFAFE', text: '#0E7490' },
      CANCELLED: { bg: '#FEE2E2', text: '#991B1B' },
    };
    return colors[status] || colors.PENDING;
  };

  const isMobile = windowWidth < 768;
  const activeOrders = orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status)).length;

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem', 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)',
      }}>
        <div>
          <div style={{ 
            fontSize: '18px', 
            color: '#667eea', 
            marginBottom: '1rem',
            fontWeight: '500',
          }}>Loading your dashboard...</div>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '4px solid #e2e8f0', 
            borderTop: '4px solid #667eea', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite', 
            margin: '0 auto' 
          }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      padding: "20px",
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
            Welcome back, {user?.name?.split(' ')[0] || 'Shop Owner'}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your shops and services
          </Typography>
        </Box>

        {/* Create Shop Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateShop}
            sx={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              '&:hover': { background: 'linear-gradient(135deg, #5a6fd8, #6a4190)' },
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Create New Shop
          </Button>
        </Box>

        {shops.length === 0 ? (
          <Paper sx={{ 
            p: 6, 
            textAlign: 'center', 
            borderRadius: '20px',
            background: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <StoreIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#1e293b', mb: 1, fontWeight: 600 }}>
              No shops found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first shop to get started
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {/* Shops List - Left Side */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ 
                p: 2, 
                borderRadius: '16px',
                background: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                maxHeight: '600px',
                overflowY: 'auto'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
                  Your Shops ({shops.length})
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {shops.map((shop) => (
                    <Card
                      key={shop.id}
                      onClick={() => handleShopSelect(shop)}
                      sx={{
                        cursor: 'pointer',
                        borderRadius: '12px',
                        border: selectedShop?.id === shop.id ? '2px solid #667eea' : '1px solid #e2e8f0',
                        background: selectedShop?.id === shop.id ? '#667eea05' : 'white',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            src={shop.image_url}
                            sx={{ width: 50, height: 50, bgcolor: '#667eea20' }}
                          >
                            <StoreIcon sx={{ color: '#667eea' }} />
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                              {shop.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              {shop.address}
                            </Typography>
                            <Chip
                              label={shop.is_open ? 'Open' : 'Closed'}
                              size="small"
                              sx={{
                                mt: 0.5,
                                backgroundColor: shop.is_open ? '#10b98120' : '#ef444420',
                                color: shop.is_open ? '#10b981' : '#ef4444',
                                fontSize: '10px',
                                height: '20px'
                              }}
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Shop Details - Right Side */}
            <Grid item xs={12} md={8}>
              {selectedShop ? (
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: '16px',
                  background: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      {selectedShop.name}
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditShop(selectedShop)}
                      sx={{
                        borderRadius: '10px',
                        textTransform: 'none',
                        borderColor: '#667eea',
                        color: '#667eea',
                        '&:hover': {
                          borderColor: '#5a6fd8',
                          backgroundColor: '#667eea10',
                        }
                      }}
                    >
                      Edit Shop
                    </Button>
                  </Box>

                  <Grid container spacing={3}>
                    {/* Shop Image */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ 
                        height: 250, 
                        borderRadius: '12px', 
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {selectedShop.image_url ? (
                          <img
                            src={selectedShop.image_url}
                            alt={selectedShop.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <StoreIcon sx={{ fontSize: 80, color: 'white' }} />
                        )}
                      </Box>
                    </Grid>

                    {/* Shop Details */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* About */}
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                            About
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedShop.description || 'No description provided'}
                          </Typography>
                        </Box>

                        {/* Contact Info */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOnIcon sx={{ fontSize: 18, color: '#64748b' }} />
                            <Typography variant="body2" color="text.primary">
                              {selectedShop.address || 'Address not provided'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhoneIcon sx={{ fontSize: 18, color: '#64748b' }} />
                            <Typography variant="body2" color="text.primary">
                              {selectedShop.phone || 'Phone not provided'}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Working Hours */}
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                            Working Hours
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTimeIcon sx={{ fontSize: 18, color: '#64748b' }} />
                            <Typography variant="body2" color="text.primary">
                              {selectedShop.working_hours || 'Not specified'}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Working Days */}
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                            Working Days
                          </Typography>
                          <Typography variant="body2" color="text.primary">
                            {selectedShop.working_days || 'Not specified'}
                          </Typography>
                        </Box>

                        {/* Status */}
                        <Box sx={{ mt: 1 }}>
                          <Chip
                            label={selectedShop.is_open ? 'Currently Open' : 'Currently Closed'}
                            sx={{
                              backgroundColor: selectedShop.is_open ? '#10b98120' : '#ef444420',
                              color: selectedShop.is_open ? '#10b981' : '#ef4444',
                              fontWeight: 600
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Tabs */}
                  <Box sx={{ mt: 4, borderBottom: '1px solid #e2e8f0' }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        onClick={() => setActiveTab('services')}
                        sx={{
                          color: activeTab === 'services' ? '#667eea' : '#64748b',
                          fontWeight: activeTab === 'services' ? 600 : 400,
                          borderBottom: activeTab === 'services' ? '2px solid #667eea' : 'none',
                          borderRadius: 0,
                          '&:hover': { backgroundColor: 'transparent' }
                        }}
                      >
                        Services ({services.length})
                      </Button>
                      <Button
                        onClick={() => setActiveTab('orders')}
                        sx={{
                          color: activeTab === 'orders' ? '#667eea' : '#64748b',
                          fontWeight: activeTab === 'orders' ? 600 : 400,
                          borderBottom: activeTab === 'orders' ? '2px solid #667eea' : 'none',
                          borderRadius: 0,
                          '&:hover': { backgroundColor: 'transparent' }
                        }}
                      >
                        Orders ({orders.length})
                      </Button>
                    </Box>
                  </Box>

                  {/* Services Tab */}
                  {activeTab === 'services' && (
                    <Box sx={{ mt: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Services
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => setShowAddServiceModal(true)}
                          sx={{
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            '&:hover': { background: 'linear-gradient(135deg, #5a6fd8, #6a4190)' },
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontSize: '13px'
                          }}
                        >
                          Add Service
                        </Button>
                      </Box>

                      {services.length === 0 ? (
                        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '12px', bgcolor: '#f8fafc' }}>
                          <Typography variant="body2" color="text.secondary">
                            No services added yet. Click "Add Service" to get started.
                          </Typography>
                        </Paper>
                      ) : (
                        <Grid container spacing={2}>
                          {services.map((service) => (
                            <Grid item xs={12} sm={6} key={service.id}>
                              <Card sx={{ borderRadius: '12px', '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } }}>
                                {service.image_url && (
                                  <CardMedia
                                    component="img"
                                    height="140"
                                    image={service.image_url}
                                    alt={service.name}
                                  />
                                )}
                                <CardContent>
                                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                    {service.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {service.description || 'No description'}
                                  </Typography>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h6" sx={{ color: '#667eea', fontWeight: 600 }}>
                                      ${service.price?.toFixed(2)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {service.duration_minutes} min
                                    </Typography>
                                  </Box>
                                  <Button
                                    size="small"
                                    color="error"
                                    onClick={() => handleDeleteService(service.id)}
                                    sx={{ mt: 2 }}
                                  >
                                    Delete
                                  </Button>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    </Box>
                  )}

                  {/* Orders Tab */}
                  {activeTab === 'orders' && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Incoming Orders
                      </Typography>

                      {orders.length === 0 ? (
                        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '12px', bgcolor: '#f8fafc' }}>
                          <Typography variant="body2" color="text.secondary">
                            No orders yet
                          </Typography>
                        </Paper>
                      ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {orders.map((order) => {
                            const statusStyle = getStatusColor(order.status);
                            return (
                              <Paper key={order.id} sx={{ p: 2, borderRadius: '12px' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                  <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                      Order #{order.id}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {order.customer_name || 'Anonymous'}
                                    </Typography>
                                  </Box>
                                  <Chip
                                    label={order.status}
                                    sx={{
                                      backgroundColor: statusStyle.bg,
                                      color: statusStyle.text,
                                      fontWeight: 600
                                    }}
                                  />
                                </Box>
                                
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                  Total: ${order.total_amount?.toFixed(2) || '0.00'}
                                </Typography>

                                <select
                                  value={order.status}
                                  onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                                  style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '13px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <option value="PENDING">Pending</option>
                                  <option value="CONFIRMED">Confirmed</option>
                                  <option value="PREPARING">Preparing</option>
                                  <option value="READY">Ready</option>
                                  <option value="DELIVERED">Delivered</option>
                                  <option value="CANCELLED">Cancelled</option>
                                </select>
                              </Paper>
                            );
                          })}
                        </Box>
                      )}
                    </Box>
                  )}
                </Paper>
              ) : (
                <Paper sx={{ 
                  p: 6, 
                  textAlign: 'center', 
                  borderRadius: '16px',
                  background: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  <StoreIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#1e293b', mb: 1, fontWeight: 600 }}>
                    Select a shop to view details
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click on a shop from the list to see its details and manage services
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>
        )}
      </div>

      {/* Shop Form Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            maxHeight: '90vh',
          }
        }}
      >
        <Box sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {isEditing ? 'Edit Shop' : 'Create New Shop'}
          </Typography>
          <IconButton 
            onClick={() => setDialogOpen(false)} 
            sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Shop Name"
                value={shopForm.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Phone"
                value={shopForm.phone}
                onChange={(e) => handleFormChange('phone', e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Address"
                value={shopForm.address}
                onChange={(e) => handleFormChange('address', e.target.value)}
                multiline
                rows={2}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Description"
                value={shopForm.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Working Days"
                value={shopForm.working_days}
                onChange={(e) => handleFormChange('working_days', e.target.value)}
                placeholder="e.g., Mon-Fri"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Working Hours"
                value={shopForm.working_hours}
                onChange={(e) => handleFormChange('working_hours', e.target.value)}
                placeholder="e.g., 9:00 AM - 6:00 PM"
                sx={{ mb: 2 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={shopForm.is_open}
                    onChange={(e) => handleFormChange('is_open', e.target.checked)}
                    color="primary"
                  />
                }
                label="Shop is open"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Shop Image
              </Typography>
              <Box
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  border: '2px dashed #e2e8f0',
                  borderRadius: '12px',
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#667eea',
                    bgcolor: '#667eea05',
                  }
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Click to upload shop image
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  PNG, JPG up to 5MB
                </Typography>
              </Box>
              {imagePreview && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '150px',
                      borderRadius: '8px',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setDialogOpen(false)}
            sx={{ borderRadius: '10px', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleShopSubmit}
            variant="contained"
            disabled={savingShop}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              '&:hover': { background: 'linear-gradient(135deg, #5a6fd8, #6a4190)' },
            }}
          >
            {savingShop ? 'Saving...' : (isEditing ? 'Update Shop' : 'Create Shop')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Service Modal */}
      <Dialog 
        open={showAddServiceModal} 
        onClose={() => setShowAddServiceModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
          }
        }}
      >
        <Box sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Add Service
          </Typography>
          <IconButton 
            onClick={() => setShowAddServiceModal(false)} 
            sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Service Name"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                required
                InputProps={{ startAdornment: '$' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                value={newService.duration_minutes}
                onChange={(e) => setNewService({ ...newService, duration_minutes: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                value={newService.image_url}
                onChange={(e) => setNewService({ ...newService, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setShowAddServiceModal(false)}
            sx={{ borderRadius: '10px', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddService}
            variant="contained"
            disabled={savingService}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              '&:hover': { background: 'linear-gradient(135deg, #5a6fd8, #6a4190)' },
            }}
          >
            {savingService ? 'Adding...' : 'Add Service'}
          </Button>
        </DialogActions>
      </Dialog>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default ShopOwnerDashboard;