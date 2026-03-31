import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useSnackbar from "../common/Snackbar";
import customerApi from "../services/customerApi";


const ChevronLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#94a3b8" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 12 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </svg>
);

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#64748b" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

const StarIcon2 = ({ filled = true }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? '#FFD700' : '#E2E8F0'} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
  </svg>
);

const dummyMenuItems = [
  { id: 1, name: 'Haircut', description: 'Professional haircut service', price: 500, duration: '30 mins' },
  { id: 2, name: 'Hair Coloring', description: 'Premium hair coloring treatment', price: 1200, duration: '60 mins' },
  { id: 3, name: 'Beard Trimming', description: 'Expert beard shaping and trim', price: 300, duration: '20 mins' },
  { id: 4, name: 'Hair Spa', description: 'Relaxing hair spa treatment', price: 800, duration: '45 mins' },
  { id: 5, name: 'Massage', description: 'Full body relaxation massage', price: 1500, duration: '60 mins' },
  { id: 6, name: 'Facial Treatment', description: 'Complete facial grooming service', price: 600, duration: '40 mins' },
];

const dummyShopDetails = {
  name: 'Premium Salon & Spa',
  address: '123 Main Street, Downtown District',
  about: 'We are a professional salon and spa offering premium grooming and wellness services for over 10 years. Our expert team ensures the best experience.',
  rating: 4.8,
  reviews: 245,
  timings: '9:00 AM - 9:00 PM',
  workingDays: 'Monday - Sunday (Closed on Holidays)',
  phone: '+1 555-1234',
};

function BookingPage() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [menuItems, setMenuItems] = useState(null);
  const [shopDetails, setShopDetails] = useState(dummyShopDetails);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchMenuItems();
  }, [shopId]);

  const fetchMenuItems = async () => {
    setLoading(true);
    const result = await customerApi.getShopMenu(shopId);

    if (result.success && result.data && result.data.length > 0) {
      setMenuItems(result.data);
    } else {
      // No data from API, use dummy data
      setMenuItems(dummyMenuItems);
      if (!result.success) {
        showSnackbar('Showing sample services. API: ' + result.error, 'info', 3000);
      }
    }
    setLoading(false);
  };

  const handleBookService = (service) => {
    setSelectedService(service);
    showSnackbar(`${service.name} selected for booking!`, 'success', 2000);
  };

  const isMobile = windowWidth < 768;

  if (loading) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '2rem',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f1f5f9',
        }}
      >
        <div>
          <div style={{ fontSize: '18px', color: '#667eea', marginBottom: '1rem' }}>Loading shop details...</div>
          <div
            style={{
              width: '50px',
              height: '50px',
              border: '4px solid #e2e8f0',
              borderTop: '4px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto',
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh', padding: isMobile ? '1rem' : '2rem' }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'white',
            border: '1px solid #e2e8f0',
            padding: '12px 20px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            color: '#667eea',
            marginBottom: '2rem',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f8fafc';
            e.currentTarget.style.borderColor = '#667eea';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        >
          <ChevronLeftIcon />
          Back to Shops
        </button>

        {/* Shop Details Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '2rem',
            marginBottom: '3rem',
            background: 'white',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          }}
        >
          {/* Left - Image */}
          <div
            style={{
              height: isMobile ? '300px' : '500px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '64px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div style={{ textAlign: 'center', zIndex: 1 }}>
              <div style={{ fontSize: '80px', marginBottom: '12px' }}>💇</div>
              <div style={{ fontSize: '20px', fontWeight: '700' }}>Premium Salon</div>
            </div>
          </div>

          {/* Right - Shop Details */}
          <div
            style={{
              padding: isMobile ? '1.5rem' : '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <h1 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '800', color: '#1e293b', margin: '0 0 12px 0' }}>
              {shopDetails.name}
            </h1>

            {/* Rating */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              {[...Array(5)].map((_, i) => (
                <StarIcon2 key={i} filled={i < Math.floor(shopDetails.rating)} />
              ))}
              <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>
                {shopDetails.rating} ({shopDetails.reviews} reviews)
              </span>
            </div>

            {/* Location */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              <LocationIcon />
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Address</div>
                <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{shopDetails.address}</div>
              </div>
            </div>

            {/* Timings */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              <ClockIcon />
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Timings</div>
                <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{shopDetails.timings}</div>
              </div>
            </div>

            {/* Working Days */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Working Days</div>
              <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{shopDetails.workingDays}</div>
            </div>

            {/* About */}
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '8px' }}>About</div>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', margin: 0 }}>{shopDetails.about}</p>
            </div>
          </div>
        </div>

        {/* Menu Items Section */}
        <div>
          <h2 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>
            Services & Menu
          </h2>

          {(!menuItems || menuItems.length === 0) ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px',
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <p style={{ color: '#64748b', fontSize: '14px' }}>No services available at the moment.</p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {menuItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                      {item.name || 'Service'}
                    </h3>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#667eea' }}>
                      ₹{item.price || 0}
                    </div>
                  </div>

                  {item.description && (
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 12px 0', lineHeight: '1.5' }}>
                      {item.description}
                    </p>
                  )}

                  {item.duration && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', fontSize: '12px', color: '#64748b' }}>
                      <ClockIcon />
                      <span>{item.duration}</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleBookService(item)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
                    onMouseLeave={(e) => (e.target.style.opacity = '1')}
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingPage;