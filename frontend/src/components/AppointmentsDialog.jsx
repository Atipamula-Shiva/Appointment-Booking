import { useState, useEffect } from 'react';
import useSnackbar from '../common/Snackbar';
import customerApi from '../services/customerApi';

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v10zM7 10h5v5H7v-5z"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
  </svg>
);

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleString('en-IN', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusBadge = (status) => {
  const statusConfig = {
    'PENDING': { color: '#f59e0b', bg: '#fef3c7', text: 'Pending', icon: '⏳', glow: '0 0 8px rgba(245, 158, 11, 0.3)' },
    'CONFIRMED': { color: '#10b981', bg: '#d1fae5', text: 'Confirmed', icon: '✓', glow: '0 0 8px rgba(16, 185, 129, 0.3)' },
    'COMPLETED': { color: '#3b82f6', bg: '#dbeafe', text: 'Completed', icon: '✅', glow: '0 0 8px rgba(59, 130, 246, 0.3)' },
    'CANCELLED': { color: '#ef4444', bg: '#fee2e2', text: 'Cancelled', icon: '❌', glow: '0 0 8px rgba(239, 68, 68, 0.3)' },
    'pending': { color: '#f59e0b', bg: '#fef3c7', text: 'Pending', icon: '⏳', glow: '0 0 8px rgba(245, 158, 11, 0.3)' },
    'confirmed': { color: '#10b981', bg: '#d1fae5', text: 'Confirmed', icon: '✓', glow: '0 0 8px rgba(16, 185, 129, 0.3)' },
    'completed': { color: '#3b82f6', bg: '#dbeafe', text: 'Completed', icon: '✅', glow: '0 0 8px rgba(59, 130, 246, 0.3)' },
    'cancelled': { color: '#ef4444', bg: '#fee2e2', text: 'Cancelled', icon: '❌', glow: '0 0 8px rgba(239, 68, 68, 0.3)' }
  };
  
  const config = statusConfig[status] || statusConfig.PENDING;
  
  return (
    <span style={{
      background: config.bg,
      color: config.color,
      padding: '6px 14px',
      borderRadius: '24px',
      fontSize: '12px',
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      boxShadow: config.glow,
      transition: 'all 0.2s ease',
    }}>
      <span style={{ fontSize: '14px' }}>{config.icon}</span>
      {config.text}
    </span>
  );
};

function AppointmentsDialog({ open, onClose, appointments: initialAppointments, onRefresh }) {
  const { showSnackbar } = useSnackbar();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (open && initialAppointments) {
      fetchAppointmentDetails(initialAppointments);
    } else if (open) {
      fetchAppointments();
    }
  }, [open, initialAppointments]);

  const fetchAppointments = async () => {
    setLoading(true);
    const result = await customerApi.getMyBookings();
    if (result.success) {
      setAppointments(result.data || []);
    } else {
      showSnackbar(result.error || 'Failed to fetch appointments', 'error', 3000);
    }
    setLoading(false);
  };

  const fetchAppointmentDetails = async (appointmentsList) => {
    setLoading(true);
    const enrichedAppointments = await Promise.all(
      appointmentsList.map(async (appointment) => {
        try {
          const serviceResult = await customerApi.getService(appointment.service_id);
          const slotResult = await customerApi.getSlot(appointment.slot_id);
          
          return {
            ...appointment,
            service: serviceResult.success ? serviceResult.data : null,
            slot: slotResult.success ? slotResult.data : null,
            shop_id: slotResult.success ? slotResult.data.shop_id : null
          };
        } catch (error) {
          return appointment;
        }
      })
    );
    setAppointments(enrichedAppointments);
    setLoading(false);
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }
    
    setCancellingId(appointmentId);
    const result = await customerApi.cancelAppointment(appointmentId);
    
    if (result.success) {
      showSnackbar('Appointment cancelled successfully', 'success', 3000);
      if (onRefresh) onRefresh();
      fetchAppointments();
    } else {
      showSnackbar(result.error || 'Failed to cancel appointment', 'error', 3000);
    }
    setCancellingId(null);
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetails(true);
  };

  if (!open) return null;

  return (
    <>
      <style>
        {`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(40px) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          @keyframes fadeIn {
            from { opacity: 0; backdrop-filter: blur(0px); }
            to { opacity: 1; backdrop-filter: blur(8px); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          .appointment-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .appointment-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.15);
          }
          .shimmer {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 1000px 100%;
            animation: shimmer 2s infinite;
          }
        `}
      </style>

      {/* Modal Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.8))',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          animation: 'fadeIn 0.3s ease',
        }}
      >
        {/* Modal Content */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
            borderRadius: '32px',
            width: '100%',
            maxWidth: '900px',
            maxHeight: '85vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(102, 126, 234, 0.1)',
            animation: 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Header with Gradient */}
          <div style={{
            padding: '1.75rem 2rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}>
            <div>
              <h2 style={{
                fontSize: '1.75rem',
                fontWeight: '800',
                color: 'white',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}>
                <span style={{ fontSize: '28px' }}>📋</span>
                My Appointments
              </h2>
              <p style={{
                fontSize: '0.875rem',
                color: 'rgba(255,255,255,0.9)',
                margin: '6px 0 0 0',
              }}>
                {appointments.length} appointment{appointments.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: 'none',
                cursor: 'pointer',
                padding: '10px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            >
              <CloseIcon />
            </button>
          </div>

          {/* Content */}
          <div style={{
            padding: '1.75rem 2rem',
            overflowY: 'auto',
            flex: 1,
          }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  border: '4px solid #e2e8f0',
                  borderTop: '4px solid #667eea',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1.5rem',
                }} />
                <p style={{ color: '#64748b', fontSize: '15px' }}>Loading your appointments...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <div style={{
                  fontSize: '80px',
                  marginBottom: '1.5rem',
                  animation: 'pulse 2s ease-in-out infinite',
                }}>📅</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.75rem' }}>
                  No Appointments Yet
                </h3>
                <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '14px' }}>
                  You haven't booked any appointments yet. Browse shops to get started!
                </p>
                <button
                  onClick={onClose}
                  style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 28px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Browse Shops →
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {appointments.map((appointment, idx) => (
                  <div
                    key={appointment.id}
                    className="appointment-card"
                    style={{
                      background: 'white',
                      borderRadius: '20px',
                      padding: '1.5rem',
                      transition: 'all 0.3s ease',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                      animation: `slideUp 0.4s ease ${idx * 0.05}s`,
                    }}
                  >
                    {/* Header */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: '12px',
                      marginBottom: '16px',
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flexWrap: 'wrap',
                          marginBottom: '6px',
                        }}>
                          <h3 style={{
                            fontSize: '1.125rem',
                            fontWeight: '700',
                            color: '#1e293b',
                            margin: 0,
                          }}>
                            {appointment.service?.name || `Booking #${appointment.id.slice(0, 8)}`}
                          </h3>
                          {getStatusBadge(appointment.status)}
                        </div>
                        <p style={{
                          fontSize: '0.75rem',
                          color: '#94a3b8',
                          margin: '4px 0 0 0',
                        }}>
                          Booked on {formatDateTime(appointment.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '12px',
                      marginTop: '16px',
                      marginBottom: '20px',
                      padding: '12px 0',
                      borderTop: '1px solid #f1f5f9',
                      borderBottom: '1px solid #f1f5f9',
                    }}>
                      {appointment.date && (
                        <div style={{ 
                          fontSize: '0.875rem', 
                          color: '#475569',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <CalendarIcon />
                          <span><strong>Date:</strong> {formatDate(appointment.date)}</span>
                        </div>
                      )}
                      {appointment.start_time && (
                        <div style={{ 
                          fontSize: '0.875rem', 
                          color: '#475569',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <ClockIcon />
                          <span><strong>Time:</strong> {appointment.start_time.split('.')[0]} - {appointment.end_time?.split('.')[0]}</span>
                        </div>
                      )}
                      {appointment.service?.price && (
                        <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                          <strong>💰 Price:</strong> <span style={{ color: '#667eea', fontWeight: '700' }}>₹{appointment.service.price}</span>
                        </div>
                      )}
                      {appointment.service?.duration_minutes && (
                        <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                          <strong>⏱️ Duration:</strong> {appointment.service.duration_minutes} mins
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    {appointment.notes && (
                      <div style={{
                        fontSize: '0.875rem',
                        color: '#64748b',
                        background: '#f8fafc',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        marginBottom: '16px',
                        borderLeft: '3px solid #667eea',
                      }}>
                        📝 {appointment.notes}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{
                      display: 'flex',
                      gap: '12px',
                    }}>
                      <button
                        onClick={() => handleViewDetails(appointment)}
                        style={{
                          flex: 1,
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          color: 'white',
                          border: 'none',
                          padding: '10px 16px',
                          borderRadius: '12px',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: '0 2px 6px rgba(102, 126, 234, 0.3)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 6px rgba(102, 126, 234, 0.3)';
                        }}
                      >
                        View Details
                      </button>
                      
                      {(appointment.status === 'PENDING' || appointment.status === 'pending') && (
                        <button
                          onClick={() => handleCancelAppointment(appointment.id)}
                          disabled={cancellingId === appointment.id}
                          style={{
                            flex: 1,
                            background: 'white',
                            border: '1.5px solid #ef4444',
                            color: '#ef4444',
                            padding: '10px 16px',
                            borderRadius: '12px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            cursor: cancellingId === appointment.id ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            opacity: cancellingId === appointment.id ? 0.6 : 1,
                          }}
                          onMouseEnter={(e) => {
                            if (cancellingId !== appointment.id) {
                              e.currentTarget.style.background = '#fef2f2';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          {cancellingId === appointment.id ? 'Cancelling...' : 'Cancel Appointment'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedAppointment && (
        <div
          onClick={() => setShowDetails(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '28px',
              maxWidth: '500px',
              width: '100%',
              padding: '2rem',
              animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
            }}>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '800', 
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0 
              }}>
                Appointment Details
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '12px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
              >
                <CloseIcon />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: '#f8fafc',
                padding: '12px',
                borderRadius: '12px',
              }}>
                <strong style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Booking ID</strong>
                <p style={{ color: '#1e293b', margin: '4px 0 0 0', fontFamily: 'monospace', fontSize: '13px' }}>{selectedAppointment.id}</p>
              </div>
              
              <div style={{
                background: '#f8fafc',
                padding: '12px',
                borderRadius: '12px',
              }}>
                <strong style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Status</strong>
                <div style={{ marginTop: '6px' }}>{getStatusBadge(selectedAppointment.status)}</div>
              </div>
              
              <div style={{
                background: '#f8fafc',
                padding: '12px',
                borderRadius: '12px',
              }}>
                <strong style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Created At</strong>
                <p style={{ color: '#1e293b', margin: '4px 0 0 0' }}>{formatDateTime(selectedAppointment.created_at)}</p>
              </div>
              
              {selectedAppointment.notes && (
                <div style={{
                  background: '#f8fafc',
                  padding: '12px',
                  borderRadius: '12px',
                }}>
                  <strong style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Notes</strong>
                  <p style={{ color: '#1e293b', margin: '4px 0 0 0' }}>{selectedAppointment.notes}</p>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowDetails(false)}
              style={{
                width: '100%',
                marginTop: '2rem',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '14px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AppointmentsDialog;