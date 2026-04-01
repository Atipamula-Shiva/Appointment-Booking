import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (isAuthenticated()) {
    const role = user?.role === 'owner' ? 'owner' : 'customer';
    return <Navigate to={role === 'owner' ? '/shop-owner' : '/home'} replace />;
  }

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        lineHeight: 1.5,
        color: '#111827',
      }}
    >
      {/* Hero Section with Gradient */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f3f4f6 0%, #ffffff 100%)',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '60px 24px 80px',
          }}
        >
      

          {/* Main Content */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '60px',
              alignItems: 'center',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease',
            }}
          >
            {/* Left Column */}
            <div>
              <h1
                style={{
                  fontSize: '52px',
                  fontWeight: '700',
                  lineHeight: 1.2,
                  marginBottom: '24px',
                  color: '#111827',
                  letterSpacing: '-0.02em',
                }}
              >
                Smart appointment{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  management
                </span>{' '}
                for modern businesses
              </h1>
              <p
                style={{
                  fontSize: '18px',
                  color: '#6b7280',
                  marginBottom: '32px',
                  lineHeight: 1.6,
                }}
              >
                Spotlo connects customers with local shops and helps business owners 
                streamline their booking process. Simple, efficient, and professional.
              </p>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <button
                  onClick={handleLoginClick}
                  style={{
                    padding: '14px 36px',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: 'white',
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(79, 70, 229, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.2)';
                  }}
                >
                  Get started
                </button>
                <button
                  style={{
                    padding: '14px 36px',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#4f46e5',
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#4f46e5';
                    e.currentTarget.style.background = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.background = 'white';
                  }}
                >
                  Learn more
                </button>
              </div>

              {/* Stats */}
              <div
                style={{
                  display: 'flex',
                  gap: '48px',
                  marginTop: '56px',
                  paddingTop: '32px',
                  borderTop: '1px solid #e5e7eb',
                }}
              >
                <div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#111827' }}>500+</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Active shops</div>
                </div>
                <div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#111827' }}>10k+</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Happy customers</div>
                </div>
                <div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#111827' }}>98%</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Satisfaction rate</div>
                </div>
              </div>
            </div>

            {/* Right Column - Illustration */}
            <div
              style={{
                background: 'linear-gradient(135deg, #f3f4f6, #ffffff)',
                borderRadius: '16px',
                padding: '48px',
                textAlign: 'center',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ fontSize: '72px', marginBottom: '24px' }}>📅</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>
                Simple booking flow
              </h3>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '24px',
                }}
              >
                {['Find', 'Book', 'Confirm'].map((step, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: 'white',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#4f46e5',
                    }}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #e0e7ff, #ede9fe)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '500',
              color: '#4f46e5',
              marginBottom: '16px',
            }}
          >
            Platform Features
          </div>
          <h2
            style={{
              fontSize: '36px',
              fontWeight: '700',
              marginBottom: '16px',
              color: '#111827',
            }}
          >
            Everything you need in one place
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: '#6b7280',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            A complete solution for managing appointments and growing your business
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
          }}
        >
          {[
            {
              icon: '🔍',
              title: 'Discover Shops',
              description: 'Browse local businesses and services in your area with advanced search',
              gradient: 'linear-gradient(135deg, #e0e7ff, #ede9fe)',
            },
            {
              icon: '📅',
              title: 'Smart Booking',
              description: 'Choose time slots that work best for your schedule with real-time availability',
              gradient: 'linear-gradient(135deg, #dbeafe, #eff6ff)',
            },
            {
              icon: '💼',
              title: 'Manage Bookings',
              description: 'View, reschedule, or cancel all your appointments from one dashboard',
              gradient: 'linear-gradient(135deg, #f3e8ff, #fae8ff)',
            },
            {
              icon: '🔔',
              title: 'Smart Reminders',
              description: 'Automatic notifications via email or SMS before your appointments',
              gradient: 'linear-gradient(135deg, #fef3c7, #fffbeb)',
            },
            {
              icon: '📊',
              title: 'Analytics Dashboard',
              description: 'Track booking trends, customer preferences, and business performance',
              gradient: 'linear-gradient(135deg, #dcfce7, #f0fdf4)',
            },
            {
              icon: '🔒',
              title: 'Secure Platform',
              description: 'Your data is protected with enterprise-grade security',
              gradient: 'linear-gradient(135deg, #fee2e2, #fef2f2)',
            },
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                padding: '32px',
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#4f46e5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  background: feature.gradient,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  marginBottom: '20px',
                }}
              >
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.5 }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* For Business Owners Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
          borderTop: '1px solid #e5e7eb',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '60px',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #e0e7ff, #ede9fe)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#4f46e5',
                  marginBottom: '16px',
                }}
              >
                For Shop Owners
              </div>
              <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px', color: '#111827' }}>
                Grow your business with Spotlo
              </h2>
              <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '32px', lineHeight: 1.6 }}>
                Join hundreds of shop owners who use Spotlo to manage appointments,
                reduce no-shows, and provide better service to their customers.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  '✓ Easy appointment management',
                  '✓ Real-time availability updates',
                  '✓ Customer booking history',
                  '✓ Business insights and analytics',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#374151' }}>
                    <span style={{ color: '#4f46e5', fontWeight: 'bold' }}>→</span>
                    {item}
                  </div>
                ))}
              </div>
              <button
                onClick={handleLoginClick}
                style={{
                  marginTop: '32px',
                  padding: '12px 28px',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#4f46e5',
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#4f46e5';
                  e.currentTarget.style.background = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.background = 'white';
                }}
              >
                Start growing →
              </button>
            </div>
            <div
              style={{
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                borderRadius: '16px',
                padding: '48px',
                color: 'white',
                textAlign: 'center',
                boxShadow: '0 20px 40px rgba(79, 70, 229, 0.2)',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>
              <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
                Trusted by businesses
              </h3>
              <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '24px' }}>
                "Spotlo has transformed how we manage appointments. Our no-show rate dropped by 70%."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #f9fafb, #ffffff)',
            borderRadius: '24px',
            padding: '64px 48px',
            border: '1px solid #e5e7eb',
          }}
        >
          <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '16px', color: '#111827' }}>
            Ready to get started?
          </h2>
          <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '32px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
            Join thousands of users who trust Spotlo for their appointment needs
          </p>
          <button
            onClick={handleLoginClick}
            style={{
              padding: '14px 40px',
              fontSize: '16px',
              fontWeight: '500',
              color: 'white',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(79, 70, 229, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.2)';
            }}
          >
            Get started for free
          </button>
          <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '24px' }}>
            No credit card required • Free forever plan available
          </p>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          background: '#111827',
          color: '#9ca3af',
          padding: '48px 24px 32px',
          marginTop: '40px',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '24px',
              marginBottom: '48px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>S</span>
              </div>
              <span style={{ fontSize: '18px', fontWeight: '600', color: 'white' }}>Spotlo</span>
            </div>
            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>About</a>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>Privacy</a>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>Terms</a>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>Contact</a>
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: '13px', paddingTop: '32px', borderTop: '1px solid #374151' }}>
            © 2026 Spotlo. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;