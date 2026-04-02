import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useSnackbar from "../common/Snackbar";
import customerApi from "../services/customerApi";

// ─── Icons ───────────────────────────────────────────────────────────────────

const ChevronLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronLeftSmall = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
  </svg>
);

const ChevronRightSmall = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 12 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#64748b">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="#10b981">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatTime = (t) => {
  if (!t) return '—';
  // Remove microseconds if present
  const cleanTime = t.split('.')[0];
  const [h, m] = cleanTime.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
};

// Generate time slots based on service duration
const generateTimeSlotsForService = (serviceDurationMinutes, selectedDate, bookedSlots = []) => {
  const slots = [];
  
  // Business hours: 10 AM to 10 PM
  const startHour = 10;
  const endHour = 22; // 10 PM
  
  // Calculate total minutes in business hours
  const totalBusinessMinutes = (endHour - startHour) * 60;
  const numberOfSlots = Math.floor(totalBusinessMinutes / serviceDurationMinutes);
  
  // Generate slots based on service duration
  for (let i = 0; i < numberOfSlots; i++) {
    const slotStartMinutes = startHour * 60 + (i * serviceDurationMinutes);
    const slotEndMinutes = slotStartMinutes + serviceDurationMinutes;
    
    // Don't exceed business hours
    if (slotEndMinutes > endHour * 60) break;
    
    const startHour24 = Math.floor(slotStartMinutes / 60);
    const startMinute = slotStartMinutes % 60;
    const endHour24 = Math.floor(slotEndMinutes / 60);
    const endMinute = slotEndMinutes % 60;
    
    const startTime = `${startHour24.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}:00`;
    const endTime = `${endHour24.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}:00`;
    
    // Check if this slot is already booked
    const existingSlot = bookedSlots.find(slot => {
      const slotStartTime = slot.start_time.split('.')[0];
      return slotStartTime === startTime && slot.date === selectedDate;
    });
    
    const isBooked = existingSlot ? existingSlot.booked >= existingSlot.capacity : false;
    const bookedCount = existingSlot ? existingSlot.booked : 0;
    const capacity = existingSlot ? existingSlot.capacity : 1; // Default capacity 1
    
    slots.push({
      id: existingSlot?.id || `${selectedDate}-${startTime}`,
      date: selectedDate,
      start_time: startTime,
      end_time: endTime,
      capacity: capacity,
      booked: bookedCount,
      is_available: !isBooked && (capacity - bookedCount) > 0,
      service_duration: serviceDurationMinutes
    });
  }
  
  return slots;
};

// ─── Mini Calendar ────────────────────────────────────────────────────────────

function SlotCalendar({ availableDates, selectedDate, onSelectDate }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  const toStr = (y, m, d) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y-1); }
    else setViewMonth(m => m-1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y+1); }
    else setViewMonth(m => m+1);
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div style={{
      background: '#f8fafc',
      border: '1.5px solid #e2e8f0',
      borderRadius: '16px',
      padding: '1.25rem',
      width: '100%',
    }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
        <button onClick={prevMonth} style={{ background:'none', border:'none', cursor:'pointer', padding:'6px', borderRadius:'8px', display:'flex', color:'#64748b', transition:'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background='#e2e8f0'}
          onMouseLeave={e => e.currentTarget.style.background='none'}
        >
          <ChevronLeftSmall />
        </button>
        <span style={{ fontWeight:'700', fontSize:'14px', color:'#1e293b' }}>{MONTHS[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} style={{ background:'none', border:'none', cursor:'pointer', padding:'6px', borderRadius:'8px', display:'flex', color:'#64748b', transition:'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background='#e2e8f0'}
          onMouseLeave={e => e.currentTarget.style.background='none'}
        >
          <ChevronRightSmall />
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'2px', marginBottom:'4px' }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign:'center', fontSize:'11px', fontWeight:'700', color:'#94a3b8', padding:'4px 0', textTransform:'uppercase' }}>{d}</div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'2px' }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const dateStr = toStr(viewYear, viewMonth, day);
          const isPast = dateStr < todayStr;
          const hasSlots = availableDates.includes(dateStr);
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === todayStr;

          return (
            <button
              key={dateStr}
              disabled={isPast || !hasSlots}
              onClick={() => onSelectDate(dateStr)}
              style={{
                aspectRatio: '1',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: isSelected ? '700' : hasSlots ? '600' : '400',
                cursor: (!isPast && hasSlots) ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s',
                position: 'relative',
                background: isSelected
                  ? 'linear-gradient(135deg, #667eea, #764ba2)'
                  : hasSlots && !isPast
                    ? '#ede9fe'
                    : 'transparent',
                color: isSelected
                  ? 'white'
                  : hasSlots && !isPast
                    ? '#5b21b6'
                    : isPast
                      ? '#cbd5e1'
                      : '#94a3b8',
                boxShadow: isSelected ? '0 2px 8px rgba(102,126,234,0.4)' : 'none',
                outline: isToday && !isSelected ? '2px solid #667eea' : 'none',
              }}
            >
              {day}
              {hasSlots && !isPast && !isSelected && (
                <span style={{
                  position:'absolute', bottom:'3px', left:'50%', transform:'translateX(-50%)',
                  width:'4px', height:'4px', borderRadius:'50%', background:'#667eea', display:'block',
                }} />
              )}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop:'0.75rem', display:'flex', gap:'1rem', fontSize:'11px', color:'#64748b', flexWrap:'wrap' }}>
        <span style={{ display:'flex', alignItems:'center', gap:'4px' }}>
          <span style={{ width:10, height:10, borderRadius:'50%', background:'#ede9fe', border:'1px solid #a78bfa', display:'inline-block' }} />
          Has slots
        </span>
        <span style={{ display:'flex', alignItems:'center', gap:'4px' }}>
          <span style={{ width:10, height:10, borderRadius:'50%', background:'linear-gradient(135deg,#667eea,#764ba2)', display:'inline-block' }} />
          Selected
        </span>
      </div>
    </div>
  );
}

// ─── Booking Dialog ───────────────────────────────────────────────────────────

function BookingDialog({ service, shopId, onClose, onBooked }) {
  const { showSnackbar } = useSnackbar();

  const [step, setStep] = useState('calendar');
  const [availableDates, setAvailableDates] = useState([]);
  const [slotsForDate, setSlotsForDate] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [dateSlotsLoading, setDateSlotsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);

  // Get service duration (support multiple field names)
  const serviceDuration = service.duration_minutes || service.duration || 30;

  // Fetch booked slots for date range to determine available dates
  useEffect(() => {
    const fetchAvailableDates = async () => {
      setSlotsLoading(true);
      const today = new Date();
      const datesToFetch = [];
      
      // Check next 30 days for availability
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        datesToFetch.push(date.toISOString().split('T')[0]);
      }
      
      // Fetch booked slots for all dates
      const promises = datesToFetch.map(date => 
        customerApi.getServiceSlots(service.id, date)
      );
      
      const results = await Promise.all(promises);
      const allDatesWithSlots = [];
      
      results.forEach((result, index) => {
        if (result.success && result.data) {
          const date = datesToFetch[index];
          const bookedSlots = result.data;
          
          // Check if there are any available slots for this date
          const hasAvailableSlots = generateTimeSlotsForService(
            serviceDuration, 
            date, 
            bookedSlots
          ).some(slot => slot.is_available);
          
          if (hasAvailableSlots) {
            allDatesWithSlots.push(date);
          }
        }
      });
      
      setAvailableDates(allDatesWithSlots);
      setSlotsLoading(false);
    };
    
    if (service.id) {
      fetchAvailableDates();
    }
  }, [service.id, serviceDuration]);

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setStep('slot');
    setDateSlotsLoading(true);
    
    // Fetch booked slots for the selected date
    const result = await customerApi.getServiceSlots(service.id, date);
    
    if (result.success) {
      const bookedSlots = result.data || [];
      // Generate all possible slots based on service duration
      const generatedSlots = generateTimeSlotsForService(serviceDuration, date, bookedSlots);
      setSlotsForDate(generatedSlots);
    } else {
      showSnackbar('Could not load slots for this date', 'error', 3000);
      setSlotsForDate([]);
    }
    setDateSlotsLoading(false);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setStep('confirm');
  };

  const handleBook = async () => {
    if (!selectedSlot) return;
    setBooking(true);
    
    const result = await customerApi.createBooking({
      service_id: service.id,
      slot_id: selectedSlot.id,
      date: selectedDate,
      start_time: selectedSlot.start_time,
      end_time: selectedSlot.end_time,
      notes: notes.trim() || undefined,
    });
    
    if (result.success) {
      setStep('success');
      onBooked && onBooked(result.data);
    } else {
      showSnackbar(result.error || 'Booking failed', 'error', 3000);
    }
    setBooking(false);
  };

  return (
    <>
      <style>{`
        @keyframes dialogSlideUp {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)     scale(1);    }
        }
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes successPop {
          0%   { transform: scale(0.5); opacity:0; }
          70%  { transform: scale(1.1); }
          100% { transform: scale(1); opacity:1; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .slot-tile { transition: all 0.2s ease; }
        .slot-tile:hover:not(:disabled) { transform: translateY(-2px); }
      `}</style>

      <div
        onClick={onClose}
        style={{
          position:'fixed', inset:0, background:'rgba(15,23,42,0.55)', backdropFilter:'blur(6px)',
          zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem',
          animation:'overlayFadeIn 0.25s ease',
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background:'white', borderRadius:'24px', width:'100%', maxWidth:'620px',
            maxHeight:'90vh', overflowY:'auto', position:'relative',
            boxShadow:'0 32px 64px -12px rgba(0,0,0,0.35)',
            animation:'dialogSlideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          <div style={{
            padding:'1.5rem 1.75rem 0',
            position:'sticky', top:0, background:'white', zIndex:10,
            borderRadius:'24px 24px 0 0',
            borderBottom: step === 'success' ? 'none' : '1px solid #f1f5f9',
            paddingBottom: step === 'success' ? 0 : '1rem',
          }}>
            {step !== 'success' && (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'2px' }}>
                    {step !== 'calendar' && (
                      <button
                        onClick={() => setStep(step === 'confirm' ? 'slot' : 'calendar')}
                        style={{ background:'none', border:'none', cursor:'pointer', padding:'2px', color:'#667eea', display:'flex', alignItems:'center' }}
                      >
                        <ChevronLeftSmall />
                      </button>
                    )}
                    <h2 style={{ fontSize:'18px', fontWeight:'800', color:'#1e293b', margin:0 }}>
                      {step === 'calendar' && '📅 Select a Date'}
                      {step === 'slot'     && '⏰ Choose a Time Slot'}
                      {step === 'confirm'  && '✅ Confirm Booking'}
                    </h2>
                  </div>
                  <p style={{ fontSize:'13px', color:'#64748b', margin:0 }}>
                    {service.name} · <span style={{ color:'#667eea', fontWeight:'600' }}>₹{service.price}</span>
                  </p>
                </div>
                <button onClick={onClose} style={{ background:'#f1f5f9', border:'none', cursor:'pointer', padding:'8px', borderRadius:'10px', display:'flex', color:'#64748b', transition:'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background='#e2e8f0'}
                  onMouseLeave={e => e.currentTarget.style.background='#f1f5f9'}
                >
                  <CloseIcon />
                </button>
              </div>
            )}

            {step !== 'success' && (
              <div style={{ display:'flex', alignItems:'center', gap:'6px', marginTop:'1rem' }}>
                {['calendar','slot','confirm'].map((s, i) => (
                  <div key={s} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <div style={{
                      width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:'12px', fontWeight:'700',
                      background: s === step ? 'linear-gradient(135deg,#667eea,#764ba2)' : ['calendar','slot','confirm'].indexOf(step) > i ? '#dcfce7' : '#f1f5f9',
                      color: s === step ? 'white' : ['calendar','slot','confirm'].indexOf(step) > i ? '#166534' : '#94a3b8',
                      transition:'all 0.3s',
                    }}>
                      {['calendar','slot','confirm'].indexOf(step) > i ? '✓' : i+1}
                    </div>
                    <span style={{ fontSize:'11px', color: s === step ? '#667eea' : '#94a3b8', fontWeight: s === step ? '700' : '400' }}>
                      {s === 'calendar' ? 'Date' : s === 'slot' ? 'Time' : 'Book'}
                    </span>
                    {i < 2 && <div style={{ width:24, height:2, background:'#e2e8f0', borderRadius:2 }} />}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ padding:'1.5rem 1.75rem' }}>
            {slotsLoading && (
              <div style={{ textAlign:'center', padding:'3rem' }}>
                <div style={{ width:40, height:40, border:'4px solid #e2e8f0', borderTop:'4px solid #667eea', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto 1rem' }} />
                <p style={{ color:'#64748b', fontSize:'14px' }}>Fetching available slots…</p>
              </div>
            )}

            {!slotsLoading && availableDates.length === 0 && step !== 'success' && (
              <div style={{ textAlign:'center', padding:'3rem' }}>
                <div style={{ fontSize:'48px', marginBottom:'1rem' }}>😔</div>
                <p style={{ fontSize:'16px', fontWeight:'700', color:'#1e293b', marginBottom:'6px' }}>No slots available</p>
                <p style={{ fontSize:'13px', color:'#64748b' }}>This service has no open time slots right now. Please check back later.</p>
              </div>
            )}

            {!slotsLoading && step === 'calendar' && availableDates.length > 0 && (
              <div>
                <p style={{ fontSize:'13px', color:'#64748b', marginBottom:'1rem' }}>
                  Dates with <span style={{ color:'#5b21b6', fontWeight:'600' }}>purple dots</span> have available slots. Select a date to continue.
                </p>
                <SlotCalendar
                  availableDates={availableDates}
                  selectedDate={selectedDate}
                  onSelectDate={handleDateSelect}
                />
              </div>
            )}

            {!slotsLoading && step === 'slot' && (
              <div>
                <div style={{ background:'#f0f4ff', borderRadius:'12px', padding:'10px 14px', marginBottom:'1.25rem', fontSize:'13px', color:'#4338ca', fontWeight:'600', display:'flex', alignItems:'center', gap:'8px' }}>
                  <CalendarIcon />
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
                </div>

                {dateSlotsLoading ? (
                  <div style={{ textAlign:'center', padding:'2rem' }}>
                    <div style={{ width:32, height:32, border:'3px solid #e2e8f0', borderTop:'3px solid #667eea', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto 0.75rem' }} />
                    <p style={{ color:'#64748b', fontSize:'13px' }}>Loading time slots…</p>
                  </div>
                ) : slotsForDate.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'2rem', color:'#64748b', fontSize:'14px' }}>
                    No available slots for this date. Please select another date.
                    <br />
                    <button onClick={() => setStep('calendar')} style={{ marginTop:'1rem', background:'#667eea', color:'white', border:'none', padding:'8px 18px', borderRadius:'8px', cursor:'pointer', fontWeight:'600', fontSize:'13px' }}>
                      ← Back to Calendar
                    </button>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize:'13px', color:'#64748b', marginBottom:'1rem' }}>
                      Business hours: 10:00 AM - 10:00 PM · Duration: {serviceDuration} minutes
                    </p>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:'0.75rem' }}>
                      {slotsForDate.filter(slot => slot.is_available).map(slot => {
                        const spotsLeft = slot.capacity - slot.booked;
                        return (
                          <button
                            key={slot.id}
                            onClick={() => handleSlotSelect(slot)}
                            className="slot-tile"
                            style={{
                              background: selectedSlot?.id === slot.id ? 'linear-gradient(135deg,#667eea,#764ba2)' : 'white',
                              border: '1.5px solid',
                              borderColor: selectedSlot?.id === slot.id ? 'transparent' : '#e2e8f0',
                              borderRadius:'14px',
                              padding:'1rem',
                              cursor:'pointer',
                              textAlign:'left',
                              color: selectedSlot?.id === slot.id ? 'white' : '#1e293b',
                              boxShadow: selectedSlot?.id === slot.id ? '0 4px 12px rgba(102,126,234,0.35)' : '0 1px 3px rgba(0,0,0,0.06)',
                            }}
                          >
                            <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'6px', fontWeight:'700', fontSize:'15px' }}>
                              <ClockIcon />
                              {formatTime(slot.start_time)}
                            </div>
                            <div style={{ fontSize:'12px', opacity:0.75 }}>
                              → {formatTime(slot.end_time)}
                            </div>
                            <div style={{ fontSize:'11px', color:'#64748b', marginTop:'4px' }}>
                              ⏱️ {serviceDuration} mins
                            </div>
                            <div style={{
                              marginTop:'8px', fontSize:'11px', fontWeight:'600',
                              color: selectedSlot?.id === slot.id ? 'rgba(255,255,255,0.85)' : spotsLeft <= 2 ? '#dc2626' : '#10b981',
                              background: selectedSlot?.id === slot.id ? 'rgba(255,255,255,0.15)' : spotsLeft <= 2 ? '#fef2f2' : '#f0fdf4',
                              padding:'3px 8px', borderRadius:'20px', display:'inline-block',
                            }}>
                              {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!slotsLoading && step === 'confirm' && selectedSlot && (
              <div>
                <div style={{ background:'linear-gradient(135deg,#f0f4ff,#faf5ff)', border:'1.5px solid #c7d2fe', borderRadius:'16px', padding:'1.25rem', marginBottom:'1.25rem' }}>
                  <h3 style={{ fontSize:'13px', fontWeight:'700', color:'#4338ca', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'1rem' }}>Booking Summary</h3>
                  {[
                    { icon:'💇', label:'Service', value: service.name },
                    { icon:'💰', label:'Price', value: `₹${service.price}` },
                    { icon:'⏱️', label:'Duration', value: `${serviceDuration} minutes` },
                    { icon:'📅', label:'Date', value: new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' }) },
                    { icon:'⏰', label:'Time', value: `${formatTime(selectedSlot.start_time)} – ${formatTime(selectedSlot.end_time)}` },
                    { icon:'👥', label:'Spots left', value: `${selectedSlot.capacity - selectedSlot.booked}` },
                  ].map(row => (
                    <div key={row.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 0', borderBottom:'1px solid rgba(199,210,254,0.5)', fontSize:'13px' }}>
                      <span style={{ color:'#64748b' }}>{row.icon} {row.label}</span>
                      <strong style={{ color:'#1e293b' }}>{row.value}</strong>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom:'1.25rem' }}>
                  <label style={{ display:'block', fontSize:'12px', fontWeight:'700', color:'#64748b', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'6px' }}>
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Any special requests or information for the shop..."
                    rows={3}
                    style={{
                      width:'100%', border:'2px solid #e2e8f0', borderRadius:'12px', padding:'12px 14px',
                      fontSize:'14px', fontFamily:'inherit', resize:'vertical', outline:'none', transition:'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor='#667eea'}
                    onBlur={e => e.target.style.borderColor='#e2e8f0'}
                  />
                </div>

                <button
                  onClick={handleBook}
                  disabled={booking}
                  style={{
                    width:'100%', background: booking ? '#cbd5e1' : 'linear-gradient(135deg,#667eea,#764ba2)',
                    color:'white', border:'none', padding:'14px', borderRadius:'14px',
                    fontSize:'15px', fontWeight:'700', cursor: booking ? 'not-allowed' : 'pointer',
                    transition:'all 0.3s', letterSpacing:'0.3px',
                    boxShadow: booking ? 'none' : '0 6px 16px rgba(102,126,234,0.4)',
                  }}
                  onMouseEnter={e => { if(!booking) e.currentTarget.style.transform='translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; }}
                >
                  {booking ? '⏳ Booking...' : '🎉 Book Appointment'}
                </button>
              </div>
            )}

            {step === 'success' && (
              <div style={{ textAlign:'center', padding:'2.5rem 1rem' }}>
                <div style={{ animation:'successPop 0.5s cubic-bezier(0.34,1.56,0.64,1)', display:'inline-block', marginBottom:'1.25rem' }}>
                  <CheckCircleIcon />
                </div>
                <h2 style={{ fontSize:'22px', fontWeight:'800', color:'#1e293b', marginBottom:'8px' }}>Appointment Booked!</h2>
                <p style={{ fontSize:'14px', color:'#64748b', marginBottom:'1.5rem', lineHeight:'1.6' }}>
                  Your <strong style={{ color:'#667eea' }}>{service.name}</strong> appointment on{' '}
                  <strong>{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'long' })}</strong>{' '}
                  at <strong>{formatTime(selectedSlot?.start_time)}</strong> has been confirmed!
                </p>
                <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'12px', padding:'1rem', marginBottom:'1.5rem', fontSize:'13px', color:'#166534' }}>
                  📱 You'll receive a confirmation shortly. Please arrive 5 minutes early.
                </div>
                <button
                  onClick={onClose}
                  style={{
                    background:'linear-gradient(135deg,#667eea,#764ba2)', color:'white', border:'none',
                    padding:'12px 32px', borderRadius:'12px', fontSize:'14px', fontWeight:'700', cursor:'pointer',
                    boxShadow:'0 4px 12px rgba(102,126,234,0.35)',
                  }}
                >
                  Done ✓
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Dummy fallbacks ──────────────────────────────────────────────────────────

const dummyMenuItems = [
  { id: 1, name: 'Haircut', description: 'Professional haircut service', price: 500, duration_minutes: 30 },
  { id: 2, name: 'Hair Coloring', description: 'Premium hair coloring treatment', price: 1200, duration_minutes: 60 },
  { id: 3, name: 'Beard Trimming', description: 'Expert beard shaping and trim', price: 300, duration_minutes: 20 },
  { id: 4, name: 'Hair Spa', description: 'Relaxing hair spa treatment', price: 800, duration_minutes: 45 },
  { id: 5, name: 'Massage', description: 'Full body relaxation massage', price: 1500, duration_minutes: 60 },
  { id: 6, name: 'Facial Treatment', description: 'Complete facial grooming service', price: 600, duration_minutes: 40 },
];

const dummyShopDetails = {
  name: 'Premium Salon & Spa',
  address: '123 Main Street, Downtown District',
  about: 'Professional salon and spa offering premium grooming services for over 10 years.',
  rating: 4.8,
  phone: '+1 555-1234',
};

// ─── Main BookingPage ─────────────────────────────────────────────────────────

function BookingPage() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [menuItems, setMenuItems] = useState(null);
  const [shopDetails, setShopDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [bookingService, setBookingService] = useState(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchShopDetails();
    fetchMenuItems();
  }, [shopId]);

  const fetchShopDetails = async () => {
    const result = await customerApi.getShop(shopId);
    if (result.success) setShopDetails(result.data);
    else setShopDetails(dummyShopDetails);
  };

  const fetchMenuItems = async () => {
    setLoading(true);
    const result = await customerApi.getShopMenu(shopId);
    if (result.success && result.data && result.data.length > 0) setMenuItems(result.data);
    else setMenuItems(dummyMenuItems);
    setLoading(false);
  };

  const handleBookService = (service) => {
    const normalized = {
      ...service,
      id: service.id ?? service.service_id ?? service._id,
    };
    if (!normalized.id) {
      showSnackbar('Cannot book: service ID is missing', 'error', 3000);
      return;
    }
    setBookingService(normalized);
    setBookingDialogOpen(true);
  };

  const handleBookingSuccess = (bookingData) => {
    showSnackbar('Appointment booked successfully! 🎉', 'success', 4000);
  };

  const isMobile = windowWidth < 768;

  if (loading) {
    return (
      <div style={{ textAlign:'center', padding:'2rem', minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f1f5f9' }}>
        <div>
          <div style={{ fontSize:'18px', color:'#667eea', marginBottom:'1rem' }}>Loading shop details...</div>
          <div style={{ width:'50px', height:'50px', border:'4px solid #e2e8f0', borderTop:'4px solid #667eea', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto' }} />
        </div>
      </div>
    );
  }

  const services = shopDetails?.services || menuItems || dummyMenuItems;

  return (
    <div style={{ background:'#f1f5f9', minHeight:'100vh', padding: isMobile ? '1rem' : '2rem' }}>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <div style={{ maxWidth:'1400px', margin:'0 auto' }}>
        <button
          onClick={() => navigate('/home')}
          style={{ display:'flex', alignItems:'center', gap:'8px', background:'white', border:'1px solid #e2e8f0', padding:'12px 20px', borderRadius:'12px', cursor:'pointer', fontSize:'14px', fontWeight:'600', color:'#667eea', marginBottom:'2rem', transition:'all 0.2s ease' }}
          onMouseEnter={e => { e.currentTarget.style.background='#f8fafc'; e.currentTarget.style.borderColor='#667eea'; }}
          onMouseLeave={e => { e.currentTarget.style.background='white'; e.currentTarget.style.borderColor='#e2e8f0'; }}
        >
          <ChevronLeftIcon /> Back to Shops
        </button>

        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:'2rem', marginBottom:'3rem', background:'white', borderRadius:'20px', overflow:'hidden', boxShadow:'0 10px 30px rgba(0,0,0,0.1)' }}>
          <div style={{ height: isMobile ? '300px' : '500px', background:'linear-gradient(135deg,#667eea,#764ba2)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
            {shopDetails?.image_url ? (
              <img src={shopDetails.image_url} alt={shopDetails.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            ) : (
              <div style={{ textAlign:'center', color:'white' }}>
                <div style={{ fontSize:'80px', marginBottom:'12px' }}>💇</div>
                <div style={{ fontSize:'20px', fontWeight:'700' }}>Premium Salon</div>
              </div>
            )}
          </div>

          <div style={{ padding: isMobile ? '1.5rem' : '2.5rem', display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <h1 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight:'800', color:'#1e293b', margin:'0 0 12px 0' }}>{shopDetails?.name}</h1>
            {shopDetails?.description && (
              <p style={{ fontSize:'14px', color:'#475569', lineHeight:'1.6', marginBottom:'16px' }}>{shopDetails.description}</p>
            )}
            <div style={{ display:'flex', alignItems:'flex-start', gap:'12px', marginBottom:'16px' }}>
              <LocationIcon />
              <div>
                <div style={{ fontSize:'12px', color:'#64748b', fontWeight:'600' }}>Address</div>
                <div style={{ fontSize:'14px', color:'#1e293b', fontWeight:'500' }}>{shopDetails?.address}</div>
              </div>
            </div>
            {shopDetails?.phone && (
              <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
                <div style={{ fontSize:'12px', color:'#64748b', fontWeight:'600' }}>📞 Phone</div>
                <div style={{ fontSize:'14px', color:'#1e293b', fontWeight:'500' }}>{shopDetails.phone}</div>
              </div>
            )}
            <div style={{ background:'#f0f9ff', border:'1px solid #bae6fd', borderRadius:'10px', padding:'10px 14px', fontSize:'13px', color:'#0369a1', fontWeight:'600' }}>
              🟢 Available for booking · Select a service below
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight:'800', color:'#1e293b', marginBottom:'1.5rem' }}>
          Services & Menu
        </h2>

        {(!services || services.length === 0) ? (
          <div style={{ textAlign:'center', padding:'40px', background:'white', borderRadius:'20px' }}>
            <p style={{ color:'#64748b', fontSize:'14px' }}>No services available at the moment.</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap:'1.5rem' }}>
            {services.map((item, idx) => (
              <div
                key={item.id || idx}
                style={{
                  background:'white', borderRadius:'16px', padding:'1.5rem',
                  boxShadow:'0 2px 8px rgba(0,0,0,0.05)', border:'1px solid #e2e8f0',
                  transition:'all 0.3s ease', cursor:'pointer',
                  animation:`fadeInUp 0.4s ease forwards ${idx * 0.05}s`, opacity:0,
                }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 10px 25px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.05)'; }}
              >
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                  <h3 style={{ fontSize:'16px', fontWeight:'700', color:'#1e293b', margin:0 }}>{item.name || 'Service'}</h3>
                  <div style={{ fontSize:'18px', fontWeight:'800', color:'#667eea', whiteSpace:'nowrap' }}>₹{item.price || 0}</div>
                </div>

                {item.description && (
                  <p style={{ fontSize:'13px', color:'#64748b', margin:'0 0 12px 0', lineHeight:'1.5' }}>{item.description}</p>
                )}

                {(item.duration_minutes || item.duration) && (
                  <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'12px', fontSize:'12px', color:'#64748b' }}>
                    <ClockIcon />
                    <span>{item.duration_minutes ? `${item.duration_minutes} mins` : item.duration}</span>
                  </div>
                )}

                <button
                  onClick={() => handleBookService(item)}
                  style={{
                    width:'100%', padding:'12px',
                    background:'linear-gradient(135deg,#667eea,#764ba2)',
                    color:'white', border:'none', borderRadius:'10px',
                    fontWeight:'700', cursor:'pointer', transition:'all 0.2s ease',
                    fontSize:'14px', letterSpacing:'0.2px',
                    boxShadow:'0 3px 8px rgba(102,126,234,0.3)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 14px rgba(102,126,234,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 3px 8px rgba(102,126,234,0.3)'; }}
                >
                  Book Now →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {bookingDialogOpen && bookingService && (
        <BookingDialog
          service={bookingService}
          shopId={shopId}
          onClose={() => { setBookingDialogOpen(false); setBookingService(null); }}
          onBooked={handleBookingSuccess}
        />
      )}
    </div>
  );
}

export default BookingPage;