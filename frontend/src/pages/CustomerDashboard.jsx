import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useSnackbar from '../common/Snackbar';
import customerApi from '../services/customerApi';
import AppointmentsDialog from '../components/AppointmentsDialog';

const StarIcon = ({ filled = true }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? '#FFD700' : '#E2E8F0'} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
  </svg>
);

const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#64748b" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.4-1.1-.6-2.3-.6-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z" />
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#667eea" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#94a3b8" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zM7 11h5v5H7v-5z"/>
  </svg>
);

const categories = [
  'Food & Catering',
  'Health & Wellness',
  'Education & Training',
  'Media & Creative Services',
  'Government & Online Services',
  'Home Services',
  'Beauty & Personal Care',
  'Events & Entertainment',
  'Shopping & Retail',
  'Professional Services',
];

function CustomerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [myAppointments, setMyAppointments] = useState([]);
  const [dialogLoading, setDialogLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchShops();
    fetchAppointments();
  }, []);

  const fetchShops = async () => {
    setLoading(true);
    setError('');
    const result = await customerApi.getAllShops();

    if (result.success) {
      setShops(result.data || []);
    } else {
      setError(result.error);
      showSnackbar(result.error, 'error', 3000);
    }
    setLoading(false);
  };

  const fetchAppointments = async () => {
    // Fetch real appointment stats from API
    try {
      const result = await customerApi.getMyBookings();
      if (result.success) {
        const appointmentsData = result.data || [];
        
        // Calculate statistics
        const pending = appointmentsData.filter(a => a.status === 'PENDING').length;
        const confirmed = appointmentsData.filter(a => a.status === 'CONFIRMED').length;
        const completed = appointmentsData.filter(a => a.status === 'COMPLETED').length;
        const cancelled = appointmentsData.filter(a => a.status === 'CANCELLED').length;
        
        setStats({
          total: appointmentsData.length,
          pending,
          confirmed,
          completed,
          cancelled
        });
      } else {
        // Set default stats if API fails
        setStats({
          total: 0,
          pending: 0,
          confirmed: 0,
          completed: 0,
          cancelled: 0
        });
      }
    } catch (err) {
      console.error('Failed to fetch appointments for stats:', err);
      setStats({
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0
      });
    }
  };

  const fetchMyBookings = async () => {
    setDialogLoading(true);
    try {
      // Call the actual API
      const result = await customerApi.getMyBookings();
      if (result.success) {
        setMyAppointments(result.data || []);
        // Also update stats with real data if needed
        if (result.data && result.data.length > 0) {
          const pending = result.data.filter(a => a.status === 'PENDING').length;
          const confirmed = result.data.filter(a => a.status === 'CONFIRMED').length;
          const completed = result.data.filter(a => a.status === 'COMPLETED').length;
          const cancelled = result.data.filter(a => a.status === 'CANCELLED').length;
          
          setStats({
            total: result.data.length,
            pending,
            confirmed,
            completed,
            cancelled
          });
        }
      } else {
        showSnackbar(result.error, 'error', 3000);
        setMyAppointments([]);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      showSnackbar('Failed to fetch bookings', 'error', 3000);
      setMyAppointments([]);
    } finally {
      setDialogLoading(false);
    }
  };

  const handleViewAppointments = async () => {
    await fetchMyBookings();
    setDialogOpen(true);
  };

  const filteredShops = shops.filter((shop) => {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    const shopName = shop.name || '';
    const shopDescription = shop.description || '';
    const shopAddress = shop.address || '';

    const searchMatch =
      !normalizedSearch ||
      shopName.toLowerCase().includes(normalizedSearch) ||
      shopDescription.toLowerCase().includes(normalizedSearch) ||
      shopAddress.toLowerCase().includes(normalizedSearch);

    const locationMatch =
      selectedLocation === 'all' ||
      shopAddress.toLowerCase().includes(selectedLocation.toLowerCase());

    const categoryMatch =
      selectedCategory === 'All Categories' ||
      (shop.category || '').toLowerCase() === selectedCategory.toLowerCase();

    return searchMatch && locationMatch && categoryMatch;
  });

  const locations = ['all', ...new Set(shops.map((s) => s.address).filter(Boolean))];

  const handleShopClick = (shopId) => {
    navigate(`/shop/${shopId}`);
  };

  const isMobile = windowWidth <= 480;
  const isTablet = windowWidth <= 768;

  // Statistics cards data
  const statsCards = [
    { label: "Total Appointments", value: stats.total, icon: "📅", color: "#667eea", bg: "#667eea10" },
    { label: "Pending", value: stats.pending, icon: "⏳", color: "#f59e0b", bg: "#f59e0b10" },
    { label: "Confirmed", value: stats.confirmed, icon: "✓", color: "#10b981", bg: "#10b98110" },
    { label: "Completed", value: stats.completed, icon: "✅", color: "#3b82f6", bg: "#3b82f610" },
    { label: "Cancelled", value: stats.cancelled, icon: "❌", color: "#ef4444", bg: "#ef444410" },
  ];

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
      position: "relative",
    }}>
      {/* Hero Section */}
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: isMobile ? "40px 16px" : "60px 24px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          animation: "float1 20s ease-in-out infinite",
        }} />
  
        

      </div>

      {/* Stats Section - Enhanced with Appointment Statistics */}
      <div style={{
        maxWidth: "1200px",
        margin: "-40px auto 40px",
        padding: isMobile ? "0 16px" : "0 24px",
        position: "relative",
        zIndex: 2,
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(5, 1fr)",
          gap: "15px",
        }}>
          {statsCards.map((stat, index) => (
            <div
              key={index}
              style={{
                background: "white",
                borderRadius: "16px",
                padding: isMobile ? "16px" : "20px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                border: `1px solid ${stat.bg}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}>
                <div style={{
                  fontSize: isMobile ? "24px" : "28px",
                }}>
                  {stat.icon}
                </div>
                <div style={{
                  fontSize: "11px",
                  color: stat.color,
                  fontWeight: "600",
                  background: stat.bg,
                  padding: "4px 8px",
                  borderRadius: "20px",
                }}>
                  {stat.label === "Total Appointments" ? "Total" : stat.label}
                </div>
              </div>
              <div style={{
                fontSize: isMobile ? "24px" : "28px",
                fontWeight: "700",
                color: stat.color,
                lineHeight: 1,
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: "11px",
                color: "#64748b",
                marginTop: "6px",
                fontWeight: "500",
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto 30px",
        padding: isMobile ? "0 16px" : "0 24px",
      }}>
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          border: "1px solid #e2e8f0",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "15px",
          }}>
            <div>
              <h3 style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#1e293b",
                marginBottom: "4px",
              }}>
                Quick Actions
              </h3>
              <p style={{
                fontSize: "13px",
                color: "#64748b",
              }}>
                Manage your appointments and discover new services
              </p>
            </div>
            <div style={{
              display: "flex",
              gap: "12px",
            }}>
              <button
                onClick={handleViewAppointments}
                style={{
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                View My Appointments
              </button>
              
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto 30px",
        padding: isMobile ? "0 16px" : "0 24px",
      }}>
        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "stretch" : "center",
          gap: "15px",
          marginBottom: "20px",
        }}>
          <h2 style={{
            fontSize: isMobile ? "20px" : "24px",
            fontWeight: "700",
            color: "#1e293b",
            margin: 0,
          }}>
            Discover Services
            {filteredShops.length > 0 && ` (${filteredShops.length})`}
          </h2>
          
          <div style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              style={{
                padding: isMobile ? "8px 16px" : "10px 20px",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                background: "white",
                fontSize: "13px",
                color: "#1e293b",
                cursor: "pointer",
                outline: "none",
              }}
            >
              {locations.map(location => (
                <option key={location} value={location}>
                  {location === "all" ? "All Locations" : location}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Categories */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '20px',
        }}>
          <button
            onClick={() => setSelectedCategory('All Categories')}
            style={{
              padding: '8px 16px',
              border: selectedCategory === 'All Categories' ? 'none' : '1px solid #e2e8f0',
              background: selectedCategory === 'All Categories' 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                : 'white',
              color: selectedCategory === 'All Categories' ? 'white' : '#475569',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              boxShadow: selectedCategory === 'All Categories' 
                ? '0 2px 8px rgba(102, 126, 234, 0.3)' 
                : 'none',
            }}
          >
            All
          </button>
          {categories.slice(0, isMobile ? 5 : 10).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px',
                border: selectedCategory === cat ? 'none' : '1px solid #e2e8f0',
                background: selectedCategory === cat 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                  : 'white',
                color: selectedCategory === cat ? 'white' : '#475569',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
              }}
            >
              {cat.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto 1rem', 
          padding: '1rem', 
          background: '#fee2e2', 
          borderLeft: '4px solid #dc2626',
          borderRadius: '12px', 
          color: '#dc2626',
          fontSize: '14px',
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Shops Grid */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: isMobile ? "0 16px 40px" : "0 24px 60px",
      }}>
        {filteredShops.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "white",
            borderRadius: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>🔍</div>
            <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#1e293b", marginBottom: "8px" }}>
              No shops found
            </h3>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px" }}>
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedLocation("all");
                setSelectedCategory("All Categories");
              }}
              style={{
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "white",
                border: "none",
                padding: "10px 24px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile 
              ? "1fr" 
              : isTablet 
                ? "repeat(2, 1fr)" 
                : "repeat(3, 1fr)",
            gap: isMobile ? "20px" : "24px",
          }}>
            {filteredShops.map((shop, index) => (
              <div
                key={index}
                onClick={() => handleShopClick(shop.id)}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  animation: `fadeInUp 0.5s ease forwards ${index * 0.05}s`,
                  border: "1px solid #e2e8f0",
                  opacity: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 24px -8px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
                }}
              >
                {/* Image Section */}
                <div style={{
                  position: "relative",
                  height: isMobile ? "180px" : "200px",
                  overflow: "hidden",
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                }}>
                  {shop.image_url ? (
                    <img
                      src={shop.image_url}
                      alt={shop.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.4s ease",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                    />
                  ) : (
                    <div style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "48px",
                      color: "white",
                    }}>
                      {shop.name?.charAt(0) || '🏪'}
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  {shop.is_open === false && (
                    <div style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      background: "#ef4444",
                      color: "white",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: "600",
                      zIndex: 2,
                    }}>
                      Closed
                    </div>
                  )}
                  
                  {/* Rating Badge */}
                  <div style={{
                    position: "absolute",
                    bottom: "12px",
                    left: "12px",
                    background: "rgba(0,0,0,0.7)",
                    backdropFilter: "blur(4px)",
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    zIndex: 2,
                  }}>
                    <StarIcon filled={true} />
                    <span>{shop.rating || '4.5'}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div style={{
                  padding: isMobile ? "16px" : "20px",
                }}>
                  <h3 style={{
                    fontSize: isMobile ? "16px" : "18px",
                    fontWeight: "700",
                    margin: "0 0 8px 0",
                    color: "#1e293b",
                    lineHeight: 1.3,
                  }}>
                    {shop.name}
                  </h3>
                  
                  <p style={{
                    fontSize: "13px",
                    color: "#64748b",
                    lineHeight: 1.5,
                    margin: "0 0 12px 0",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}>
                    {shop.description || "No description provided."}
                  </p>
                  
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                    color: "#64748b",
                    marginBottom: "12px",
                  }}>
                    <LocationIcon />
                    <span style={{ flex: 1 }}>{shop.address || "Address unavailable"}</span>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShopClick(shop.id);
                    }}
                    style={{
                      width: "100%",
                      background: shop.is_open !== false 
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        : "#cbd5e1",
                      color: "white",
                      border: "none",
                      padding: "10px",
                      borderRadius: "10px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: shop.is_open !== false ? "pointer" : "not-allowed",
                      transition: "all 0.2s ease",
                      marginTop: "8px",
                    }}
                    disabled={shop.is_open === false}
                    onMouseEnter={(e) => {
                      if (shop.is_open !== false) {
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {shop.is_open !== false ? 'Book Appointment →' : 'Currently Closed'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <AppointmentsDialog 
  open={dialogOpen}
  onClose={() => {
    setDialogOpen(false);
    fetchAppointments(); // Refresh stats when dialog closes
  }}
  appointments={myAppointments}
  onRefresh={fetchAppointments}
/>
      </div>

      <style>
        {`
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

          @keyframes float1 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(30px, -30px) rotate(120deg); }
            66% { transform: translate(-20px, 20px) rotate(240deg); }
          }
          
          @keyframes float2 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(-30px, -20px) rotate(-120deg); }
            66% { transform: translate(20px, 30px) rotate(-240deg); }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @media (max-width: 480px) {
            * {
              -webkit-tap-highlight-color: transparent;
            }
            
            input, select, button {
              font-size: 16px !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default CustomerDashboard;