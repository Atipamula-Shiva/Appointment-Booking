import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import useSnackbar from '../common/Snackbar';
import shopOwnerApi from '../services/shopOwnerApi';

// ─── Icons ───────────────────────────────────────────────────────────────────

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#667eea"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z" fill="#ef4444"/>
  </svg>
);

const AddIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="white"/>
  </svg>
);

const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
);

const OrdersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
  </svg>
);

const SlotIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
  </svg>
);

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

// ─── Mini Calendar ────────────────────────────────────────────────────────────

function MiniCalendar({ selectedDate, onSelectDate }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const toStr = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const todayStr = toStr(today.getFullYear(), today.getMonth(), today.getDate());

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="mini-calendar">
      <div className="cal-header">
        <button className="cal-nav" onClick={prevMonth}><ChevronLeftIcon /></button>
        <span className="cal-month-label">{MONTHS[viewMonth]} {viewYear}</span>
        <button className="cal-nav" onClick={nextMonth}><ChevronRightIcon /></button>
      </div>
      <div className="cal-grid">
        {DAYS.map(d => <div key={d} className="cal-day-name">{d}</div>)}
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const dateStr = toStr(viewYear, viewMonth, day);
          const isPast = dateStr < todayStr;
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === todayStr;
          return (
            <button
              key={dateStr}
              disabled={isPast}
              onClick={() => onSelectDate(dateStr)}
              className={`cal-day ${isSelected ? 'selected' : ''} ${isToday && !isSelected ? 'today' : ''} ${isPast ? 'past' : ''}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Set Slot Modal ───────────────────────────────────────────────────────────

function SetSlotModal({ services, onClose, onSaved }) {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [capacity, setCapacity] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const toISOTime = (timeStr) => {
    const [h, m] = timeStr.split(':');
    return `${h}:${m}:00.000Z`;
  };

  const handleSave = async () => {
    if (!serviceId) { setError('Please select a service.'); return; }
    if (!selectedDate) { setError('Please select a date.'); return; }
    if (startTime >= endTime) { setError('End time must be after start time.'); return; }

    setSaving(true);
    setError('');
    const payload = {
      service_id: serviceId,
      date: selectedDate,
      start_time: toISOTime(startTime),
      end_time: toISOTime(endTime),
      capacity: Number(capacity),
    };
    try {
      const result = await shopOwnerApi.createSlot(payload);
      if (result.success) {
        onSaved(result.data);
        onClose();
      } else {
        setError(result.error || 'Failed to create slot');
      }
    } catch (e) {
      setError(e.message || 'Failed to create slot');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal slot-modal" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">🗓️ Set Time Slot</h3>

        <div className="slot-modal-body">
          {/* Left: Calendar */}
          <div className="slot-cal-side">
            <p className="form-label" style={{marginBottom:'0.75rem'}}>Select Date</p>
            <MiniCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            <div className="selected-date-chip">
              📅 {selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' }) : 'No date selected'}
            </div>
          </div>

          {/* Right: Form fields */}
          <div className="slot-form-side">
            <div className="form-group">
              <label className="form-label">Service *</label>
              <select value={serviceId} onChange={e => setServiceId(e.target.value)} className="form-select">
                <option value="">— Select Service —</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="time-row">
              <div className="form-group">
                <label className="form-label">Start Time *</label>
                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">End Time *</label>
                <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="form-input" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Capacity (max bookings)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={capacity}
                onChange={e => setCapacity(e.target.value)}
                className="form-input"
              />
            </div>

            {error && <p className="slot-error">{error}</p>}

            <div className="slot-preview">
              <div className="slot-preview-row"><span>📋 Service:</span><strong>{services.find(s=>s.id===serviceId)?.name || '—'}</strong></div>
              <div className="slot-preview-row"><span>📅 Date:</span><strong>{selectedDate || '—'}</strong></div>
              <div className="slot-preview-row"><span>⏰ Time:</span><strong>{startTime} → {endTime}</strong></div>
              <div className="slot-preview-row"><span>👥 Capacity:</span><strong>{capacity}</strong></div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="btn-cancel">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? '⏳ Saving...' : '✅ Create Slot'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

function ShopOwnerDashboard() {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [shop, setShop] = useState(null);
  const [shopForm, setShopForm] = useState({ name:'', description:'', address:'', phone:'', image_url:'', latitude:0, longitude:0, is_open:true });
  const [isNewShop, setIsNewShop] = useState(false);
  const [savingShop, setSavingShop] = useState(false);

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Service modals
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showEditServiceModal, setShowEditServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [newService, setNewService] = useState({ name:'', description:'', price:'', duration_minutes:'', image_url:'', category_id:'' });
  const [savingService, setSavingService] = useState(false);

  // Slots
  const [slots, setSlots] = useState([]);
  const [showSetSlotModal, setShowSetSlotModal] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotFilterDate, setSlotFilterDate] = useState('');
  const [slotFilterService, setSlotFilterService] = useState('');

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchShopData();
    fetchCategories();
  }, []);

  // Fetch slots when switching to slots tab
  useEffect(() => {
    if (activeTab === 'slots') fetchSlots();
  }, [activeTab]);

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
      await fetchServices();
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
    if (ordersResult.success) setOrders(ordersResult.data || []);
    setLoading(false);
  };

  const fetchServices = async () => {
    const servicesResult = await shopOwnerApi.getServices();
    if (servicesResult.success) setServices(servicesResult.data || []);
    else showSnackbar(servicesResult.error || 'Failed to fetch services', 'error', 3000);
  };

  const fetchCategories = async () => {
    const result = await shopOwnerApi.getCategories();
    if (result.success) setCategories(result.data || []);
  };

  const fetchSlots = async () => {
    setSlotsLoading(true);
    const result = await shopOwnerApi.getSlots();
    if (result.success) setSlots(result.data || []);
    else showSnackbar(result.error || 'Failed to fetch slots', 'error', 3000);
    setSlotsLoading(false);
  };

  const handleFormChange = (field, value) => setShopForm(prev => ({ ...prev, [field]: value }));

  const handleShopSubmit = async () => {
    setSavingShop(true);
    try {
      const payload = {
        name: shopForm.name, description: shopForm.description,
        address: shopForm.address, phone: shopForm.phone,
        image_url: shopForm.image_url,
        latitude: Number(shopForm.latitude) || 0,
        longitude: Number(shopForm.longitude) || 0,
        ...(isNewShop ? {} : { is_open: shopForm.is_open }),
      };
      const result = isNewShop
        ? await shopOwnerApi.createShop(payload)
        : await shopOwnerApi.updateShop(shop.id, payload);
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

  const handleAddService = async () => {
    if (!newService.name || !newService.price) { showSnackbar('Please fill in name and price', 'error', 3000); return; }
    setSavingService(true);
    const payload = { name: newService.name, description: newService.description, price: parseFloat(newService.price), duration_minutes: parseInt(newService.duration_minutes) || 0, image_url: newService.image_url || '', category_id: newService.category_id || null };
    const result = await shopOwnerApi.addService(payload);
    if (result.success) {
      setServices([...services, result.data]);
      setShowAddServiceModal(false);
      setNewService({ name:'', description:'', price:'', duration_minutes:'', image_url:'', category_id:'' });
      showSnackbar('Service added successfully!', 'success', 3000);
    } else showSnackbar(result.error || 'Failed to add service', 'error', 3000);
    setSavingService(false);
  };

  const handleUpdateService = async () => {
    if (!editingService.name || !editingService.price) { showSnackbar('Please fill in name and price', 'error', 3000); return; }
    setSavingService(true);
    const payload = { name: editingService.name, description: editingService.description, price: parseFloat(editingService.price), duration_minutes: parseInt(editingService.duration_minutes) || 0, image_url: editingService.image_url || '', is_available: editingService.is_available };
    const result = await shopOwnerApi.updateService(editingService.id, payload);
    if (result.success) {
      setServices(services.map(s => s.id === editingService.id ? result.data : s));
      setShowEditServiceModal(false);
      setEditingService(null);
      showSnackbar('Service updated successfully!', 'success', 3000);
    } else showSnackbar(result.error || 'Failed to update service', 'error', 3000);
    setSavingService(false);
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      const result = await shopOwnerApi.deleteService(serviceId);
      if (result.success) { setServices(services.filter(s => s.id !== serviceId)); showSnackbar('Service deleted', 'success', 2000); }
      else showSnackbar(result.error || 'Failed to delete service', 'error', 3000);
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    const result = await shopOwnerApi.updateOrderStatus(orderId, newStatus);
    if (result.success) { setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)); showSnackbar('Order status updated', 'success', 2000); }
    else showSnackbar(result.error || 'Failed to update order', 'error', 3000);
  };

  const handleSlotSaved = (newSlot) => {
    setSlots(prev => [newSlot, ...prev]);
    showSnackbar('Slot created successfully!', 'success', 3000);
  };

  const getStatusColor = (status) => {
    const colors = { PENDING: { bg:'#fef3c7', text:'#92400e' }, CONFIRMED: { bg:'#dbeafe', text:'#1e40af' }, PREPARING: { bg:'#fed7aa', text:'#9b2c1d' }, READY: { bg:'#dcfce7', text:'#166534' }, DELIVERED: { bg:'#cffafe', text:'#0e7490' }, CANCELLED: { bg:'#fee2e2', text:'#991b1b' } };
    return colors[status] || colors.PENDING;
  };

  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : 'Uncategorized';
  };

  const getServiceName = (serviceId) => {
    const s = services.find(sv => sv.id === serviceId);
    return s ? s.name : serviceId?.slice(0,8) + '...';
  };

  const formatTime = (t) => {
    if (!t) return '—';
    const [h, m] = t.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    return `${hour % 12 || 12}:${m} ${ampm}`;
  };

  const isMobile = windowWidth < 768;
  const activeOrders = orders.filter(o => !['DELIVERED','CANCELLED'].includes(o.status)).length;

  // Filtered slots
  const filteredSlots = slots.filter(slot => {
    if (slotFilterDate && slot.date !== slotFilterDate) return false;
    if (slotFilterService && slot.service_id !== slotFilterService) return false;
    return true;
  });

  // Group slots by date
  const slotsByDate = filteredSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard-container">
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }

        .dashboard-container {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          min-height: 100vh;
          padding: ${isMobile ? '1rem' : '2rem'};
        }
        .dashboard-wrapper { max-width: 1400px; margin: 0 auto; }

        /* Header */
        .header { margin-bottom: 2rem; animation: slideDown 0.5s ease; }
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

        /* Stats */
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .stat-card { background: white; border-radius: 20px; padding: 1.5rem; transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: pointer; animation: fadeInUp 0.5s ease; }
        .stat-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); }
        .stat-card-content { display: flex; justify-content: space-between; align-items: center; }
        .stat-title { color: #64748b; font-size: 14px; font-weight: 600; margin-bottom: 0.5rem; }
        .stat-value { font-size: 28px; font-weight: 800; color: #1e293b; }
        .stat-icon { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: rgba(102,126,234,0.1); border-radius: 16px; }

        /* Tabs */
        .tabs-container { background: white; border-radius: 16px; padding: 0.5rem; margin-bottom: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .tabs { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .tab-button { flex: 1; padding: 12px 20px; background: transparent; border: none; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 0.5rem; color: #64748b; }
        .tab-button.active { background: linear-gradient(135deg, #667eea, #764ba2); color: white; box-shadow: 0 4px 6px -1px rgba(102,126,234,0.3); }
        .tab-button:not(.active):hover { background: #f1f5f9; color: #667eea; }

        /* Content card */
        .content-card { background: white; border-radius: 24px; padding: ${isMobile ? '1.5rem' : '2rem'}; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); animation: fadeInUp 0.5s ease; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
        .card-title { font-size: 20px; font-weight: 700; color: #1e293b; }

        /* Forms */
        .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
        .form-group { display: flex; flex-direction: column; }
        .form-label { margin-bottom: 0.5rem; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .form-input, .form-select { border: 2px solid #e2e8f0; border-radius: 12px; padding: 12px 14px; font-size: 14px; transition: all 0.3s ease; font-family: inherit; }
        .form-input:focus, .form-select:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.1); }

        /* Buttons */
        .btn-primary { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 0.5rem; font-size: 14px; }
        .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(102,126,234,0.4); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-cancel { padding: 10px 20px; background: #f1f5f9; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 14px; color: #475569; transition: background 0.2s; }
        .btn-cancel:hover { background: #e2e8f0; }

        /* Services */
        .services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        .service-card { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.25rem; transition: all 0.3s ease; position: relative; overflow: hidden; }
        .service-card:hover { transform: translateY(-4px); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); border-color: #cbd5e1; }
        .service-name { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem; }
        .service-description { font-size: 13px; color: #64748b; margin-bottom: 1rem; line-height: 1.5; }
        .service-duration { font-size: 12px; color: #667eea; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.25rem; }
        .service-category { font-size: 11px; color: #94a3b8; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.25rem; }
        .service-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; }
        .service-price { font-size: 20px; font-weight: 800; color: #667eea; }
        .service-actions { display: flex; gap: 0.5rem; }
        .availability-badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 600; margin-bottom: 0.5rem; }
        .availability-badge.available { background: #dcfce7; color: #166534; }
        .availability-badge.unavailable { background: #fee2e2; color: #991b1b; }
        .icon-button { background: transparent; border: none; cursor: pointer; padding: 8px; border-radius: 8px; transition: all 0.2s ease; }
        .icon-button:hover { background: #f1f5f9; transform: scale(1.1); }

        /* Orders */
        .orders-table-container { overflow-x: auto; }
        .orders-table { width: 100%; border-collapse: collapse; }
        .orders-table th { text-align: left; padding: 1rem; font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; }
        .orders-table td { padding: 1rem; font-size: 14px; color: #1e293b; border-bottom: 1px solid #e2e8f0; }
        .orders-table tr { transition: background-color 0.2s ease; }
        .orders-table tr:hover { background-color: #f8fafc; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .status-select { padding: 6px 10px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 12px; cursor: pointer; transition: all 0.2s ease; }
        .status-select:focus { outline: none; border-color: #667eea; }

        /* ── Slots Tab ── */
        .slots-toolbar {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          align-items: flex-end;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
        }
        .slots-toolbar .form-group { flex: 1; min-width: 180px; }
        .slots-date-group { display: flex; flex-direction: column; }

        .slot-date-section { margin-bottom: 2rem; }
        .slot-date-heading {
          font-size: 13px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .slot-date-heading::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }
        .slots-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; }
        .slot-card {
          background: white;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          padding: 1rem 1.25rem;
          transition: all 0.25s ease;
          position: relative;
        }
        .slot-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px -4px rgba(102,126,234,0.15); border-color: #c7d2fe; }
        .slot-card-service {
          font-size: 15px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .slot-time-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 13px;
          color: #667eea;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .slot-meta {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-top: 0.5rem;
        }
        .slot-pill {
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }
        .slot-pill.capacity { background: #ede9fe; color: #5b21b6; }
        .slot-pill.booked { background: #fee2e2; color: #991b1b; }
        .slot-pill.available { background: #dcfce7; color: #166534; }
        .slot-pill.unavailable { background: #f1f5f9; color: #94a3b8; }
        .slots-empty {
          text-align: center;
          padding: 4rem 2rem;
          color: #94a3b8;
        }
        .slots-empty-icon { font-size: 48px; margin-bottom: 1rem; }
        .slots-empty-text { font-size: 16px; font-weight: 600; color: #64748b; margin-bottom: 0.5rem; }

        /* ── Set Slot Modal ── */
        .slot-modal {
          max-width: 820px !important;
          width: 95% !important;
        }
        .slot-modal-body {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .slot-cal-side { flex: 0 0 auto; }
        .slot-form-side { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 1rem; }
        .time-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        /* Mini calendar */
        .mini-calendar {
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 16px;
          padding: 1rem;
          min-width: 280px;
        }
        .cal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .cal-month-label { font-size: 14px; font-weight: 700; color: #1e293b; }
        .cal-nav {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          color: #64748b;
          transition: all 0.2s;
        }
        .cal-nav:hover { background: #e2e8f0; color: #667eea; }
        .cal-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }
        .cal-day-name { text-align: center; font-size: 11px; font-weight: 700; color: #94a3b8; padding: 4px 0; text-transform: uppercase; }
        .cal-day {
          aspect-ratio: 1;
          border: none;
          background: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #1e293b;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cal-day:hover:not(:disabled):not(.selected) { background: #e0e7ff; color: #4f46e5; }
        .cal-day.selected { background: linear-gradient(135deg, #667eea, #764ba2); color: white; font-weight: 700; box-shadow: 0 2px 8px rgba(102,126,234,0.4); }
        .cal-day.today { border: 2px solid #667eea; color: #667eea; font-weight: 700; }
        .cal-day.past { color: #cbd5e1; cursor: not-allowed; }
        .selected-date-chip {
          margin-top: 0.75rem;
          text-align: center;
          font-size: 12px;
          color: #667eea;
          font-weight: 600;
          background: #ede9fe;
          border-radius: 10px;
          padding: 0.5rem;
          line-height: 1.4;
        }

        .slot-preview {
          background: linear-gradient(135deg, #f0f4ff, #f8fafc);
          border: 1.5px solid #c7d2fe;
          border-radius: 12px;
          padding: 1rem;
          margin-top: auto;
        }
        .slot-preview-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #475569;
          padding: 3px 0;
        }
        .slot-preview-row strong { color: #1e293b; }
        .slot-error { color: #ef4444; font-size: 13px; font-weight: 600; background: #fef2f2; padding: 8px 12px; border-radius: 8px; border: 1px solid #fecaca; }

        /* Modal generic */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.3s ease; overflow-y: auto; padding: 1rem; }
        .modal { background: white; border-radius: 24px; padding: 2rem; max-width: 500px; width: 90%; animation: slideUp 0.3s ease; }
        .modal-title { font-size: 24px; font-weight: 700; color: #1e293b; margin-bottom: 1.5rem; }
        .modal-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; }

        /* Loading */
        .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; gap: 1rem; }
        .loading-spinner { width: 50px; height: 50px; border: 4px solid #e2e8f0; border-top: 4px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite; }
        .loading-text { color: #64748b; font-size: 16px; }

        /* Animations */
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="dashboard-wrapper">
        {/* Header */}
        <div className="header">
          <h1 className="greeting">Welcome back, {user?.name?.split(' ')[0] || 'Shop Owner'}! 👋</h1>
          {shop && (
            <div className="shop-badge">
              <span>🏪</span>
              <span>Managing {shop.name}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        {!isNewShop && (
          <div className="stats-grid">
            <StatCard title="Total Services" value={services.length} icon={<MenuIcon />} color="#667eea" />
            <StatCard title="Active Orders" value={activeOrders} icon={<OrdersIcon />} color="#f59e0b" />
            <StatCard title="Total Orders" value={orders.length} icon={<DashboardIcon />} color="#10b981" />
            <StatCard title="Total Slots" value={slots.length} icon={<SlotIcon />} color="#8b5cf6" />
          </div>
        )}

        {/* Tabs */}
        <div className="tabs-container">
          <div className="tabs">
            {[
              { id:'overview', label:'Overview', icon:<DashboardIcon /> },
              { id:'services', label:'Services', icon:<MenuIcon /> },
              { id:'orders', label:'Orders', icon:<OrdersIcon /> },
              { id:'slots', label:'Slots', icon:<SlotIcon /> },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}>
                {tab.icon}<span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Overview ── */}
        {activeTab === 'overview' && (
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-title">{isNewShop ? '✨ Create Your Shop' : '⚙️ Shop Settings'}</h2>
            </div>
            <p style={{ color:'#64748b', marginBottom:'1.5rem' }}>
              {isNewShop ? 'Get started by creating your shop. Fill in the details below to list your business.' : 'Keep your shop information up to date to provide the best experience for your customers.'}
            </p>
            <div className="form-grid">
              {[
                { label:'🏪 Shop Name', key:'name', placeholder:'Your amazing shop name', type:'text' },
                { label:'📞 Phone', key:'phone', placeholder:'+1 555 1234', type:'text' },
                { label:'📍 Address', key:'address', placeholder:'Full shop address', type:'text' },
                { label:'🗺️ Latitude', key:'latitude', placeholder:'0.0000', type:'number' },
                { label:'🗺️ Longitude', key:'longitude', placeholder:'0.0000', type:'number' },
                { label:'🖼️ Image URL', key:'image_url', placeholder:'https://...', type:'text' },
              ].map(field => (
                <div key={field.key} className="form-group">
                  <label className="form-label">{field.label}</label>
                  <input type={field.type} value={shopForm[field.key] ?? ''} placeholder={field.placeholder} onChange={e => handleFormChange(field.key, e.target.value)} className="form-input" />
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">🔌 Shop Status</label>
                <select value={shopForm.is_open ? 'open' : 'closed'} onChange={e => handleFormChange('is_open', e.target.value === 'open')} className="form-select">
                  <option value="open">🟢 Open for Business</option>
                  <option value="closed">🔴 Currently Closed</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">📝 Description</label>
                <textarea value={shopForm.description ?? ''} placeholder="Tell customers about your shop..." onChange={e => handleFormChange('description', e.target.value)} className="form-input" rows="3" style={{ resize:'vertical' }} />
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap' }}>
              <button onClick={handleShopSubmit} disabled={savingShop} className="btn-primary">
                {savingShop ? '⏳ Saving...' : (isNewShop ? '✨ Create Shop' : '💾 Save Changes')}
              </button>
              {!isNewShop && shop && (
                <span style={{ color:'#475569', fontSize:'14px' }}>
                  Status: <strong style={{ color: shopForm.is_open ? '#10b981' : '#ef4444' }}>{shopForm.is_open ? 'Open' : 'Closed'}</strong>
                </span>
              )}
            </div>
          </div>
        )}

        {/* ── Services ── */}
        {activeTab === 'services' && (
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-title">💇 Services</h2>
              <button onClick={() => setShowAddServiceModal(true)} className="btn-primary"><AddIcon /> Add Service</button>
            </div>
            {services.length === 0 ? (
              <div style={{ textAlign:'center', padding:'3rem' }}>
                <p style={{ color:'#64748b', marginBottom:'1rem' }}>No services added yet</p>
                <button onClick={() => setShowAddServiceModal(true)} className="btn-primary"><AddIcon /> Add Your First Service</button>
              </div>
            ) : (
              <div className="services-grid">
                {services.map(service => (
                  <div key={service.id} className="service-card">
                    <div className={`availability-badge ${service.is_available !== false ? 'available' : 'unavailable'}`}>
                      {service.is_available !== false ? '✓ Available' : '✗ Unavailable'}
                    </div>
                    <h3 className="service-name">{service.name}</h3>
                    {service.category_id && <div className="service-category"><span>📁</span><span>{getCategoryName(service.category_id)}</span></div>}
                    {service.description && <p className="service-description">{service.description}</p>}
                    {service.duration_minutes > 0 && <div className="service-duration"><span>⏱️</span><span>{service.duration_minutes} minutes</span></div>}
                    <div className="service-footer">
                      <span className="service-price">₹{service.price?.toFixed(2) || '0.00'}</span>
                      <div className="service-actions">
                        <button onClick={() => { setEditingService(service); setShowEditServiceModal(true); }} className="icon-button" title="Edit"><EditIcon /></button>
                        <button onClick={() => handleDeleteService(service.id)} className="icon-button" title="Delete"><DeleteIcon /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Orders ── */}
        {activeTab === 'orders' && (
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-title">📦 Incoming Orders</h2>
              <div className="shop-badge"><span>{activeOrders} active orders</span></div>
            </div>
            {orders.length === 0 ? (
              <div style={{ textAlign:'center', padding:'3rem' }}>
                <p style={{ color:'#64748b' }}>No orders yet</p>
                <p style={{ color:'#94a3b8', fontSize:'14px', marginTop:'0.5rem' }}>When customers place orders, they'll appear here</p>
              </div>
            ) : (
              <div className="orders-table-container">
                <table className="orders-table">
                  <thead>
                    <tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {orders.map(order => {
                      const statusStyle = getStatusColor(order.status);
                      return (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>
                            <div style={{ fontWeight:'600' }}>{order.customer_name || 'Anonymous'}</div>
                            {order.customer_phone && <div style={{ fontSize:'12px', color:'#64748b' }}>{order.customer_phone}</div>}
                          </td>
                          <td><strong>₹{order.total_amount?.toFixed(2) || '0.00'}</strong></td>
                          <td><span className="status-badge" style={{ background: statusStyle.bg, color: statusStyle.text }}>{order.status}</span></td>
                          <td>
                            <select value={order.status} onChange={e => handleOrderStatusChange(order.id, e.target.value)} className="status-select">
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

        {/* ── Slots ── */}
        {activeTab === 'slots' && (
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-title">🗓️ Time Slots</h2>
              <button onClick={() => setShowSetSlotModal(true)} className="btn-primary" disabled={services.length === 0}>
                <AddIcon /> Set Slot
              </button>
            </div>
            {services.length === 0 && (
              <p style={{ color:'#f59e0b', fontSize:'13px', marginBottom:'1rem', background:'#fef3c7', padding:'10px 14px', borderRadius:'10px' }}>
                ⚠️ You need to add services before creating slots.
              </p>
            )}

            {/* Filters */}
            <div className="slots-toolbar">
              <div className="form-group">
                <label className="form-label">Filter by Date</label>
                <input type="date" value={slotFilterDate} onChange={e => setSlotFilterDate(e.target.value)} className="form-input" style={{ fontSize:'13px' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Filter by Service</label>
                <select value={slotFilterService} onChange={e => setSlotFilterService(e.target.value)} className="form-select" style={{ fontSize:'13px' }}>
                  <option value="">All Services</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              {(slotFilterDate || slotFilterService) && (
                <button onClick={() => { setSlotFilterDate(''); setSlotFilterService(''); }} className="btn-cancel" style={{ alignSelf:'flex-end' }}>
                  ✕ Clear
                </button>
              )}
              <button onClick={fetchSlots} className="btn-cancel" style={{ alignSelf:'flex-end' }} disabled={slotsLoading}>
                {slotsLoading ? '⏳' : '🔄'} Refresh
              </button>
            </div>

            {slotsLoading ? (
              <div style={{ textAlign:'center', padding:'3rem', color:'#64748b' }}>
                <div className="loading-spinner" style={{ margin:'0 auto 1rem' }}></div>
                Loading slots...
              </div>
            ) : filteredSlots.length === 0 ? (
              <div className="slots-empty">
                <div className="slots-empty-icon">🗓️</div>
                <div className="slots-empty-text">No slots found</div>
                <p style={{ fontSize:'14px' }}>Click "Set Slot" to create your first time slot</p>
              </div>
            ) : (
              Object.keys(slotsByDate).sort().map(date => (
                <div key={date} className="slot-date-section">
                  <div className="slot-date-heading">
                    📅 {new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
                    <span style={{ background:'#ede9fe', color:'#5b21b6', padding:'2px 8px', borderRadius:'20px', fontSize:'11px', fontWeight:'700', marginLeft:'0.5rem' }}>
                      {slotsByDate[date].length} slot{slotsByDate[date].length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="slots-grid">
                    {slotsByDate[date].map(slot => (
                      <div key={slot.id} className="slot-card">
                        <div className="slot-card-service">{getServiceName(slot.service_id)}</div>
                        <div className="slot-time-row">
                          <ClockIcon />
                          {formatTime(slot.start_time)} — {formatTime(slot.end_time)}
                        </div>
                        <div className="slot-meta">
                          <span className="slot-pill capacity">👥 Capacity: {slot.capacity}</span>
                          <span className="slot-pill booked">🔖 Booked: {slot.booked}</span>
                          <span className={`slot-pill ${slot.is_available ? 'available' : 'unavailable'}`}>
                            {slot.is_available ? '✓ Available' : '✗ Full'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ── Add Service Modal ── */}
      {showAddServiceModal && (
        <div className="modal-overlay" onClick={() => setShowAddServiceModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Add New Service</h3>
            <div className="form-group">
              <label className="form-label">Service Name *</label>
              <input type="text" value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })} placeholder="e.g., Haircut, Massage, Facial" className="form-input" autoFocus />
            </div>
            <div className="form-group" style={{ marginTop:'1rem' }}>
              <label className="form-label">Category</label>
              <select value={newService.category_id} onChange={e => setNewService({ ...newService, category_id: e.target.value })} className="form-select">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginTop:'1rem' }}>
              <label className="form-label">Description</label>
              <textarea value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })} placeholder="Brief description..." className="form-input" rows="3" />
            </div>
            <div className="form-group" style={{ marginTop:'1rem' }}>
              <label className="form-label">Price * (₹)</label>
              <input type="number" step="0.01" value={newService.price} onChange={e => setNewService({ ...newService, price: e.target.value })} placeholder="0.00" className="form-input" />
            </div>
            <div className="form-group" style={{ marginTop:'1rem' }}>
              <label className="form-label">Duration (minutes)</label>
              <input type="number" step="5" value={newService.duration_minutes} onChange={e => setNewService({ ...newService, duration_minutes: e.target.value })} placeholder="e.g., 30" className="form-input" />
            </div>
            <div className="form-group" style={{ marginTop:'1rem' }}>
              <label className="form-label">Image URL (optional)</label>
              <input type="text" value={newService.image_url} onChange={e => setNewService({ ...newService, image_url: e.target.value })} placeholder="https://..." className="form-input" />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowAddServiceModal(false)} className="btn-cancel">Cancel</button>
              <button onClick={handleAddService} disabled={savingService} className="btn-primary">
                {savingService ? 'Adding...' : 'Add Service'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Service Modal ── */}
      {showEditServiceModal && editingService && (
        <div className="modal-overlay" onClick={() => setShowEditServiceModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Edit Service</h3>
            <div className="form-group">
              <label className="form-label">Service Name *</label>
              <input type="text" value={editingService.name} onChange={e => setEditingService({ ...editingService, name: e.target.value })} className="form-input" />
            </div>
            <div className="form-group" style={{ marginTop:'1rem' }}>
              <label className="form-label">Description</label>
              <textarea value={editingService.description || ''} onChange={e => setEditingService({ ...editingService, description: e.target.value })} className="form-input" rows="3" />
            </div>
            <div className="form-group" style={{ marginTop:'1rem' }}>
              <label className="form-label">Price * (₹)</label>
              <input type="number" step="0.01" value={editingService.price} onChange={e => setEditingService({ ...editingService, price: e.target.value })} className="form-input" />
            </div>
            <div className="form-group" style={{ marginTop:'1rem' }}>
              <label className="form-label">Duration (minutes)</label>
              <input type="number" step="5" value={editingService.duration_minutes || 0} onChange={e => setEditingService({ ...editingService, duration_minutes: e.target.value })} className="form-input" />
            </div>
            <div className="form-group" style={{ marginTop:'1rem' }}>
              <label className="form-label">Availability</label>
              <select value={editingService.is_available !== false} onChange={e => setEditingService({ ...editingService, is_available: e.target.value === 'true' })} className="form-select">
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowEditServiceModal(false)} className="btn-cancel">Cancel</button>
              <button onClick={handleUpdateService} disabled={savingService} className="btn-primary">
                {savingService ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Set Slot Modal ── */}
      {showSetSlotModal && (
        <SetSlotModal
          services={services}
          onClose={() => setShowSetSlotModal(false)}
          onSaved={handleSlotSaved}
        />
      )}
    </div>
  );
}

export default ShopOwnerDashboard;