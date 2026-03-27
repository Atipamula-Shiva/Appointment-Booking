// import { useState } from "react";
// import { useParams } from "react-router-dom";
// import shops from "../data/shops";

// // MUI
// import {
//   TextField,
//   Button,
//   MenuItem,
//   Box,
//   Typography,
//   Paper,
//   Avatar,
//   Chip,
//   Divider,
//   Fade,
//   Zoom,
//   Grow,
//   Rating,
//   IconButton
// } from "@mui/material";

// // Icons
// import PersonIcon from "@mui/icons-material/Person";
// import PhoneIcon from "@mui/icons-material/Phone";
// import BuildIcon from "@mui/icons-material/Build";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import WhatsAppIcon from "@mui/icons-material/WhatsApp";
// import StorefrontIcon from "@mui/icons-material/Storefront";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import StarIcon from "@mui/icons-material/Star";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import VerifiedIcon from "@mui/icons-material/Verified";

// // Date Picker
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import dayjs from "dayjs";

// function BookingPage() {
//   const { shopName } = useParams();
//   const shop = shops[shopName];

//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [service, setService] = useState(shop?.services?.[0] || "");
//   const [dateTime, setDateTime] = useState(dayjs());
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [imageError, setImageError] = useState(false);

//   // Handle image loading error
//   const handleImageError = () => {
//     setImageError(true);
//   };

//   // 🔴 Subscription / inactive
//   if (!shop || !shop.isActive) {
//     return (
//       <Fade in={true} timeout={1000}>
//         <Box sx={styles.container}>
//           <Zoom in={true} style={{ transitionDelay: '200ms' }}>
//             <Paper sx={styles.inactiveCard} elevation={8}>
//               {shop?.image && !imageError ? (
//                 <Box sx={styles.inactiveImageWrapper}>
//                   <Box
//                     component="img"
//                     src={shop.image}
//                     alt={shop.name}
//                     sx={styles.inactiveImage}
//                     onError={handleImageError}
//                   />
//                   <Box sx={styles.inactiveImageOverlay} />
//                 </Box>
//               ) : (
//                 <Avatar sx={styles.inactiveAvatar}>
//                   <StorefrontIcon />
//                 </Avatar>
//               )}
              
//               <Typography variant="h5" textAlign="center" sx={styles.inactiveTitle}>
//                 {shop?.name || 'Business Page'}
//               </Typography>

//               <Divider sx={{ my: 2 }}>
//                 <Chip label="STATUS" size="small" color="error" />
//               </Divider>

//               <Box sx={styles.inactiveContent}>
//                 <Typography variant="body1" textAlign="center" sx={{ mb: 2, color: '#f44336', fontWeight: 600 }}>
//                   ⏰ Currently Unavailable
//                 </Typography>
                
//                 <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ mb: 3 }}>
//                   This business needs to activate their booking system
//                 </Typography>
//               </Box>

//               {shop && (
//                 <Grow in={true} style={{ transformOrigin: '0 0 0' }} timeout={1000}>
//                   <Button
//                     href={`https://wa.me/${shop.phone}?text=Hi, I want to activate my booking system`}
//                     variant="contained"
//                     startIcon={<WhatsAppIcon />}
//                     sx={styles.activateButton}
//                   >
//                     Activate Booking System
//                   </Button>
//                 </Grow>
//               )}
//             </Paper>
//           </Zoom>
//         </Box>
//       </Fade>
//     );
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     if (!name || !phone || !dateTime) {
//       alert("Please fill all fields");
//       setIsSubmitting(false);
//       return;
//     }

//     const message = `*New Appointment Request from SPOTLO*

// ━━━━━━━━━━━━━━━━━━
// *Customer Details:*
// ━━━━━━━━━━━━━━━━━━
// *Name:* ${name}
// *Phone:* ${phone}
// *Service:* ${service}
// *Date:* ${dateTime.format("dddd, DD MMMM YYYY")}
// *Time:* ${dateTime.format("hh:mm A")}
// ━━━━━━━━━━━━━━━━━━

// _Booked via ${shop.name} Booking System_ ✨`;

//     const url = `https://wa.me/${shop.phone}?text=${encodeURIComponent(message)}`;
    
//     setTimeout(() => {
//       window.open(url, "_blank");
//       setIsSubmitting(false);
//     }, 500);
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Box sx={styles.container}>
//         <Fade in={true} timeout={1000}>
//           <Paper sx={styles.modernCard} elevation={8}>
//             {/* Header Section with Shop Image */}
//             <Box sx={styles.headerSection}>
//               {/* Background Image */}
//               {shop.image && (
//                 <Box
//                   sx={styles.headerBackground}
//                   style={{
//                     backgroundImage: `url(${shop.image})`,
//                   }}
//                 />
//               )}
              
//               {/* Dark Overlay */}
//               <Box sx={styles.headerOverlay} />
              
//               {/* Content */}
//               <Box sx={styles.headerContent}>
//                 {/* Back Button */}
//                 <IconButton 
//                   sx={styles.backButton}
//                   onClick={() => window.history.back()}
//                 >
//                   <ArrowBackIcon />
//                 </IconButton>

//                 {/* Shop Logo/Avatar */}
//                 <Zoom in={true}>
//                   <Avatar 
//                     src={shop.logo} 
//                     sx={styles.shopAvatar}
//                     onError={handleImageError}
//                   >
//                     <StorefrontIcon />
//                   </Avatar>
//                 </Zoom>

//                 {/* Shop Info */}
//                 <Zoom in={true} style={{ transitionDelay: '100ms' }}>
//                   <Box sx={styles.shopInfo}>
//                     <Box sx={styles.shopNameWrapper}>
//                       <Typography variant="h4" sx={styles.shopName}>
//                         {shop.name}
//                       </Typography>
//                       {shop.rating >= 4.5 && (
//                         <VerifiedIcon sx={styles.verifiedIcon} />
//                       )}
//                     </Box>

//                     {/* Location */}
//                     {shop.location && (
//                       <Box sx={styles.locationWrapper}>
//                         <LocationOnIcon sx={styles.locationIcon} />
//                         <Typography variant="body2" sx={styles.locationText}>
//                           {shop.location}
//                         </Typography>
//                       </Box>
//                     )}

//                     {/* Rating */}
//                     {shop.rating && (
//                       <Box sx={styles.ratingWrapper}>
//                         <Rating 
//                           value={shop.rating} 
//                           precision={0.1} 
//                           readOnly 
//                           size="small"
//                           icon={<StarIcon sx={styles.starIcon} />}
//                           emptyIcon={<StarIcon sx={styles.starIconEmpty} />}
//                         />
//                         <Typography variant="body2" sx={styles.ratingText}>
//                           {shop.rating}
//                         </Typography>
//                       </Box>
//                     )}

//                     {/* Service Count */}
//                     <Chip 
//                       icon={<CheckCircleIcon />} 
//                       label={`${shop.services.length} Services`}
//                       size="small"
//                       sx={styles.serviceChip}
//                     />
//                   </Box>
//                 </Zoom>
//               </Box>
//             </Box>

//             <Divider sx={styles.divider}>
//               <Chip 
//                 label="BOOK APPOINTMENT" 
//                 size="small" 
//                 sx={styles.dividerChip}
//                 avatar={<CalendarMonthIcon />}
//               />
//             </Divider>

//             {/* Form Section */}
//             <form onSubmit={handleSubmit}>
//               <Box sx={styles.formContainer}>
//                 {/* Name Field */}
//                 <Zoom in={true} style={{ transitionDelay: '100ms' }}>
//                   <TextField
//                     fullWidth
//                     label="Full Name"
//                     placeholder="Enter your full name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     margin="normal"
//                     required
//                     InputProps={{
//                       startAdornment: <PersonIcon sx={styles.inputIcon} />,
//                     }}
//                     sx={styles.textField}
//                   />
//                 </Zoom>

//                 {/* Phone Field */}
//                 <Zoom in={true} style={{ transitionDelay: '200ms' }}>
//                   <TextField
//                     fullWidth
//                     label="Phone Number"
//                     placeholder="Enter WhatsApp number"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     margin="normal"
//                     required
//                     InputProps={{
//                       startAdornment: <PhoneIcon sx={styles.inputIcon} />,
//                     }}
//                     sx={styles.textField}
//                   />
//                 </Zoom>

//                 {/* Service Selection */}
//                 <Zoom in={true} style={{ transitionDelay: '300ms' }}>
//                   <TextField
//                     select
//                     fullWidth
//                     label="Select Service"
//                     value={service}
//                     onChange={(e) => setService(e.target.value)}
//                     margin="normal"
//                     required
//                     InputProps={{
//                       startAdornment: <BuildIcon sx={styles.inputIcon} />,
//                     }}
//                     sx={styles.textField}
//                   >
//                     {shop.services.map((s, i) => (
//                       <MenuItem key={i} value={s} sx={styles.menuItem}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <BuildIcon fontSize="small" sx={{ color: '#667eea' }} />
//                           {s}
//                         </Box>
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </Zoom>

//                 {/* Date & Time Picker */}
//                 <Zoom in={true} style={{ transitionDelay: '400ms' }}>
//                   <Box sx={styles.dateTimeWrapper}>
//                     <DateTimePicker
//                       label="Select Date & Time"
//                       value={dateTime}
//                       onChange={(newValue) => setDateTime(newValue)}
//                       slotProps={{
//                         textField: {
//                           fullWidth: true,
//                           margin: "normal",
//                           required: true,
//                           InputProps: {
//                             startAdornment: <CalendarMonthIcon sx={styles.inputIcon} />,
//                           },
//                           sx: styles.textField
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Zoom>

//                 {/* Submit Button */}
//                 <Grow in={true} style={{ transitionDelay: '500ms' }}>
//                   <Button
//                     type="submit"
//                     fullWidth
//                     variant="contained"
//                     disabled={isSubmitting}
//                     startIcon={<WhatsAppIcon />}
//                     sx={styles.submitButton}
//                   >
//                     {isSubmitting ? 'Processing...' : 'Book via WhatsApp'}
//                   </Button>
//                 </Grow>

//                 {/* Footer Note */}
//                 <Typography variant="caption" sx={styles.footerNote}>
//                   📱 You'll be redirected to WhatsApp to confirm your booking
//                 </Typography>
//               </Box>
//             </form>
//           </Paper>
//         </Fade>
//       </Box>
//     </LocalizationProvider>
//   );
// }

// const styles = {
//   container: {
//     minHeight: "100vh",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     background: "linear-gradient(145deg, #f6f9fc 0%, #eef2f6 100%)",
//     p: 2,
//     position: "relative",
//   },
  
//   // Active card styles
//   modernCard: {
//     width: "100%",
//     maxWidth: "500px",
//     borderRadius: "28px",
//     overflow: "hidden",
//     background: "#ffffff",
//     boxShadow: "0 30px 60px -20px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.05)",
//     position: "relative",
//     zIndex: 1,
//   },
  
//   headerSection: {
//     position: "relative",
//     height: "280px",
//     overflow: "hidden",
//   },
  
//   headerBackground: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     transition: "transform 0.3s ease",
//     "&:hover": {
//       transform: "scale(1.05)",
//     },
//   },
  
//   headerOverlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 90%)",
//   },
  
//   headerContent: {
//     position: "relative",
//     height: "100%",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "flex-end",
//     p: 3,
//     color: "white",
//   },
  
//   backButton: {
//     position: "absolute",
//     top: 16,
//     left: 16,
//     bgcolor: "rgba(255,255,255,0.2)",
//     backdropFilter: "blur(5px)",
//     color: "white",
//     "&:hover": {
//       bgcolor: "rgba(255,255,255,0.3)",
//     },
//   },
  
//   shopAvatar: {
//     width: 80,
//     height: 80,
//     border: "4px solid white",
//     boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
//     mb: 2,
//     bgcolor: "#667eea",
//   },
  
//   shopInfo: {
//     textAlign: "left",
//   },
  
//   shopNameWrapper: {
//     display: "flex",
//     alignItems: "center",
//     gap: 1,
//     mb: 1,
//   },
  
//   shopName: {
//     fontWeight: 800,
//     fontSize: "1.8rem",
//     lineHeight: 1.2,
//     textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
//   },
  
//   verifiedIcon: {
//     color: "#4CAF50",
//     fontSize: "1.2rem",
//     filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
//   },
  
//   locationWrapper: {
//     display: "flex",
//     alignItems: "center",
//     gap: 0.5,
//     mb: 1,
//   },
  
//   locationIcon: {
//     fontSize: "1rem",
//     opacity: 0.9,
//   },
  
//   locationText: {
//     fontSize: "0.9rem",
//     opacity: 0.9,
//   },
  
//   ratingWrapper: {
//     display: "flex",
//     alignItems: "center",
//     gap: 1,
//     mb: 1,
//   },
  
//   starIcon: {
//     color: "#FFD700",
//   },
  
//   starIconEmpty: {
//     color: "rgba(255,255,255,0.3)",
//   },
  
//   ratingText: {
//     fontSize: "0.9rem",
//     fontWeight: 600,
//   },
  
//   serviceChip: {
//     bgcolor: "rgba(255, 255, 255, 0.2)",
//     color: "white",
//     border: "1px solid rgba(255, 255, 255, 0.3)",
//     backdropFilter: "blur(5px)",
//     "& .MuiChip-icon": {
//       color: "white",
//     },
//     "&:hover": {
//       bgcolor: "rgba(255, 255, 255, 0.3)",
//     },
//   },
  
//   divider: {
//     my: 0,
//   },
  
//   dividerChip: {
//     bgcolor: "#667eea",
//     color: "white",
//     fontWeight: 600,
//     "& .MuiChip-label": {
//       px: 2,
//     },
//     "& .MuiChip-avatar": {
//       color: "white",
//     },
//   },
  
//   formContainer: {
//     p: 3,
//   },
  
//   textField: {
//     "& .MuiOutlinedInput-root": {
//       borderRadius: "14px",
//       transition: "all 0.3s ease",
//       bgcolor: "#f8fafc",
//       "&:hover": {
//         transform: "translateY(-2px)",
//         boxShadow: "0 8px 20px rgba(102, 126, 234, 0.15)",
//         bgcolor: "#ffffff",
//       },
//       "&.Mui-focused": {
//         transform: "translateY(-2px)",
//         boxShadow: "0 8px 25px rgba(102, 126, 234, 0.25)",
//         bgcolor: "#ffffff",
//       },
//     },
//   },
  
//   inputIcon: {
//     mr: 1,
//     color: "#667eea",
//   },
  
//   menuItem: {
//     "&:hover": {
//       bgcolor: "rgba(102, 126, 234, 0.08)",
//     },
//   },
  
//   dateTimeWrapper: {
//     width: "100%",
//   },
  
//   submitButton: {
//     mt: 3,
//     py: 1.5,
//     borderRadius: "14px",
//     fontSize: "1.1rem",
//     fontWeight: 600,
//     textTransform: "none",
//     background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
//     boxShadow: "0 10px 25px -5px rgba(37, 211, 102, 0.5)",
//     transition: "all 0.3s ease",
//     "&:hover": {
//       transform: "translateY(-2px)",
//       boxShadow: "0 15px 30px -5px rgba(37, 211, 102, 0.6)",
//       background: "linear-gradient(135deg, #128C7E 0%, #25D366 100%)",
//     },
//     "&:disabled": {
//       background: "#ccc",
//     },
//   },
  
//   footerNote: {
//     display: "block",
//     textAlign: "center",
//     mt: 2,
//     color: "#64748b",
//     fontStyle: "italic",
//     fontSize: "0.75rem",
//   },
  
//   // Inactive card styles
//   inactiveCard: {
//     width: "100%",
//     maxWidth: "400px",
//     borderRadius: "24px",
//     overflow: "hidden",
//     textAlign: "center",
//     background: "#ffffff",
//     boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.2)",
//   },
  
//   inactiveImageWrapper: {
//     position: "relative",
//     height: "150px",
//     overflow: "hidden",
//   },
  
//   inactiveImage: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//   },
  
//   inactiveImageOverlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     background: "linear-gradient(135deg, rgba(244,67,54,0.3) 0%, rgba(244,67,54,0.6) 100%)",
//   },
  
//   inactiveAvatar: {
//     width: 80,
//     height: 80,
//     margin: "20px auto 0",
//     bgcolor: "#f44336",
//     border: "3px solid rgba(244, 67, 54, 0.2)",
//   },
  
//   inactiveTitle: {
//     fontWeight: 700,
//     color: "#333",
//     mt: 1,
//     mb: 1,
//   },
  
//   inactiveContent: {
//     p: 2,
//     mx: 2,
//     borderRadius: "12px",
//     bgcolor: "rgba(244, 67, 54, 0.05)",
//     mb: 3,
//   },
  
//   activateButton: {
//     mx: 3,
//     mb: 3,
//     py: 1.5,
//     borderRadius: "12px",
//     fontSize: "1rem",
//     fontWeight: 600,
//     textTransform: "none",
//     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     "&:hover": {
//       background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
//     },
//   },
// };

// export default BookingPage;


import { useState } from "react";
import { useParams } from "react-router-dom";
import shops from "../data/shops";

// MUI
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
  Divider,
  Fade,
  Zoom,
  Grow,
  Rating,
  IconButton,
  Alert,
  Snackbar
} from "@mui/material";

// Icons
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import BuildIcon from "@mui/icons-material/Build";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VerifiedIcon from "@mui/icons-material/Verified";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

// Date Picker
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

function BookingPage() {
  const { shopName } = useParams();
  const shop = shops[shopName];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(shop?.services?.[0] || "");
  const [dateTime, setDateTime] = useState(dayjs());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };

  // Format phone number
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      return cleaned;
    }
    return cleaned.slice(0, 10);
  };

  // Validate phone number
  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phoneNumber);
  };

  // Validate name
  const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    return nameRegex.test(name.trim());
  };

  // Handle phone input
  const handlePhoneChange = (e) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setPhone(formattedPhone);
  };

  // Handle date change with validation
  const handleDateTimeChange = (newValue) => {
    const now = dayjs();
    const selectedDateTime = dayjs(newValue);
    
    if (selectedDateTime.isBefore(now, 'minute')) {
      setDateError(true);
      setErrorMessage("Please select a future date and time. Past appointments cannot be booked.");
      setShowSnackbar(true);
      return;
    }
    
    setDateError(false);
    setErrorMessage("");
    setDateTime(newValue);
  };

  // Format customer details professionally
  const formatCustomerDetails = () => {
    const formattedName = name.trim().toUpperCase();
    const formattedPhone = phone;
    const formattedService = service;
    const formattedDate = dateTime.format("dddd, DD MMMM YYYY");
    const formattedTime = dateTime.format("hh:mm A");
    const formattedDay = dateTime.format("dddd");

    return `
╔════════════════════════════════════════════════════╗
║           📋 CUSTOMER APPOINTMENT DETAILS          ║
╠════════════════════════════════════════════════════╣
║                                                     ║
║  👤 CUSTOMER INFORMATION                            ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  • Full Name    : ${formattedName.padEnd(35)}║
║  • Phone Number : ${formattedPhone.padEnd(35)}║
║                                                     ║
║  🛠️ SERVICE DETAILS                                 ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  • Service Type : ${formattedService.padEnd(35)}║
║                                                     ║
║  📅 APPOINTMENT SCHEDULE                            ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  • Date         : ${formattedDate.padEnd(35)}║
║  • Day          : ${formattedDay.padEnd(35)}║
║  • Time         : ${formattedTime.padEnd(35)}║
║                                                     ║
║  📍 BOOKING SOURCE                                  ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  • Platform     : SPOTLO Booking System             ║
║  • Shop         : ${shop.name.padEnd(35)}║
║  • Booking ID   : ${Math.random().toString(36).substring(2, 10).toUpperCase().padEnd(35)}║
║                                                     ║
╚════════════════════════════════════════════════════╝

✨ Booking Confirmation Summary ✨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Appointment booked successfully
✓ Confirmation sent to customer
✓ Please prepare for the service
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Quick Actions:
• Click "Reply" to confirm with customer
• Add to calendar: ${dateTime.format("YYYY-MM-DD")} at ${dateTime.format("hh:mm A")}
• Reminder: Send confirmation message 1 hour before

Thank you for choosing SPOTLO! 🌟`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all fields
    if (!name.trim()) {
      alert("Please enter your full name");
      setIsSubmitting(false);
      return;
    }

    if (!validateName(name)) {
      alert("Please enter a valid name (only letters and spaces, 2-50 characters)");
      setIsSubmitting(false);
      return;
    }

    if (!phone) {
      alert("Please enter your phone number");
      setIsSubmitting(false);
      return;
    }

    if (!validatePhoneNumber(phone)) {
      alert("Please enter a valid 10-digit Indian phone number starting with 6,7,8, or 9");
      setIsSubmitting(false);
      return;
    }

    if (!dateTime) {
      alert("Please select date and time");
      setIsSubmitting(false);
      return;
    }

    // Validate date is not in the past
    const now = dayjs();
    if (dateTime.isBefore(now, 'minute')) {
      alert("Please select a future date and time. Past appointments cannot be booked.");
      setIsSubmitting(false);
      return;
    }

    const customerDetails = formatCustomerDetails();
    
    // Create a more structured WhatsApp message
    const message = `*🔔 NEW APPOINTMENT REQUEST - ${shop.name.toUpperCase()}* 

${customerDetails}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*⏰ IMPORTANT NOTES:*
• Please confirm this booking with the customer
• Service duration: Approximately 30-60 minutes
• Cancellation policy: 2 hours prior notice
• Payment: To be settled at the shop

*📞 Customer Contact:* ${phone}
*🏪 Shop Location:* ${shop.location || 'Contact shop for address'}

_This is an automated booking request from SPOTLO. Please respond to this message to confirm the appointment._ ✨`;

    const url = `https://wa.me/${shop.phone}?text=${encodeURIComponent(message)}`;
    
    setTimeout(() => {
      window.open(url, "_blank");
      setIsSubmitting(false);
    }, 500);
  };

  // Disable past dates in the DateTimePicker
  const shouldDisableDate = (date) => {
    return dayjs(date).isBefore(dayjs(), 'day');
  };

  const shouldDisableTime = (timeValue) => {
    const now = dayjs();
    const selectedDateTime = dayjs(dateTime).hour(timeValue.hour()).minute(timeValue.minute());
    return selectedDateTime.isBefore(now);
  };

  // 🔴 Subscription / inactive
  if (!shop || !shop.isActive) {
    return (
      <Fade in={true} timeout={1000}>
        <Box sx={styles.container}>
          <Zoom in={true} style={{ transitionDelay: '200ms' }}>
            <Paper sx={styles.inactiveCard} elevation={8}>
              {shop?.image && !imageError ? (
                <Box sx={styles.inactiveImageWrapper}>
                  <Box
                    component="img"
                    src={shop.image}
                    alt={shop.name}
                    sx={styles.inactiveImage}
                    onError={handleImageError}
                  />
                  <Box sx={styles.inactiveImageOverlay} />
                </Box>
              ) : (
                <Avatar sx={styles.inactiveAvatar}>
                  <StorefrontIcon />
                </Avatar>
              )}
              
              <Typography variant="h5" textAlign="center" sx={styles.inactiveTitle}>
                {shop?.name || 'Business Page'}
              </Typography>

              <Divider sx={{ my: 2 }}>
                <Chip label="STATUS" size="small" color="error" />
              </Divider>

              <Box sx={styles.inactiveContent}>
                <Typography variant="body1" textAlign="center" sx={{ mb: 2, color: '#f44336', fontWeight: 600 }}>
                  ⏰ Currently Unavailable
                </Typography>
                
                <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ mb: 3 }}>
                  This business needs to activate their booking system
                </Typography>
              </Box>

              {shop && (
                <Grow in={true} style={{ transformOrigin: '0 0 0' }} timeout={1000}>
                  <Button
                    href={`https://wa.me/${shop.phone}?text=Hi, I want to activate my booking system`}
                    variant="contained"
                    startIcon={<WhatsAppIcon />}
                    sx={styles.activateButton}
                  >
                    Activate Booking System
                  </Button>
                </Grow>
                
              )}
            </Paper>
          </Zoom>
        </Box>
      </Fade>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={styles.container}>
        <Snackbar
          open={showSnackbar}
          autoHideDuration={6000}
          onClose={() => setShowSnackbar(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setShowSnackbar(false)} 
            severity="error" 
            icon={<ErrorOutlineIcon />}
            sx={styles.snackbar}
          >
            {errorMessage}
          </Alert>
        </Snackbar>

        <Fade in={true} timeout={1000}>
          <Paper sx={styles.modernCard} elevation={8}>
            {/* Header Section with Shop Image */}
            <Box sx={styles.headerSection}>
              {/* Background Image */}
              {shop.image && (
                <Box
                  sx={styles.headerBackground}
                  style={{
                    backgroundImage: `url(${shop.image})`,
                  }}
                />
              )}
              
              {/* Dark Overlay */}
              <Box sx={styles.headerOverlay} />
              
              {/* Content */}
              <Box sx={styles.headerContent}>
                {/* Back Button */}
                <IconButton 
                  sx={styles.backButton}
                  onClick={() => window.history.back()}
                >
                  <ArrowBackIcon />
                </IconButton>

                {/* Shop Logo/Avatar */}
                <Zoom in={true}>
                  <Avatar 
                    src={shop.logo} 
                    sx={styles.shopAvatar}
                    onError={handleImageError}
                  >
                    <StorefrontIcon />
                  </Avatar>
                </Zoom>

                {/* Shop Info */}
                <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                  <Box sx={styles.shopInfo}>
                    <Box sx={styles.shopNameWrapper}>
                      <Typography variant="h4" sx={styles.shopName}>
                        {shop.name}
                      </Typography>
                      {shop.rating >= 4.5 && (
                        <VerifiedIcon sx={styles.verifiedIcon} />
                      )}
                    </Box>

                    {/* Location */}
                    {shop.location && (
                      <Box sx={styles.locationWrapper}>
                        <LocationOnIcon sx={styles.locationIcon} />
                        <Typography variant="body2" sx={styles.locationText}>
                          {shop.location}
                        </Typography>
                      </Box>
                    )}

                    {/* Rating */}
                    {shop.rating && (
                      <Box sx={styles.ratingWrapper}>
                        <Rating 
                          value={shop.rating} 
                          precision={0.1} 
                          readOnly 
                          size="small"
                          icon={<StarIcon sx={styles.starIcon} />}
                          emptyIcon={<StarIcon sx={styles.starIconEmpty} />}
                        />
                        <Typography variant="body2" sx={styles.ratingText}>
                          {shop.rating}
                        </Typography>
                      </Box>
                    )}

                    {/* Service Count */}
                    <Chip 
                      icon={<CheckCircleIcon />} 
                      label={`${shop.services.length} Services`}
                      size="small"
                      sx={styles.serviceChip}
                    />
                  </Box>
                </Zoom>
              </Box>
            </Box>

            <Divider sx={styles.divider}>
              <Chip 
                label="BOOK APPOINTMENT" 
                size="small" 
                sx={styles.dividerChip}
                avatar={<CalendarMonthIcon />}
              />
            </Divider>

            {/* Form Section */}
            <form onSubmit={handleSubmit}>
              <Box sx={styles.formContainer}>
                {/* Name Field */}
                <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                  <TextField
                    fullWidth
                    label="Name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: <PersonIcon sx={styles.inputIcon} />,
                    }}
                    sx={styles.textField}
                    // helperText="Only letters and spaces, 2-50 characters"
                  />
                </Zoom>

                {/* Phone Field */}
                <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    placeholder="Enter 10-digit mobile number"
                    value={phone}
                    onChange={handlePhoneChange}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: <PhoneIcon sx={styles.inputIcon} />,
                    }}
                    sx={styles.textField}
                    helperText="Enter Numbers Only"
                  />
                </Zoom>

                {/* Service Selection */}
                <Zoom in={true} style={{ transitionDelay: '300ms' }}>
                  <TextField
                    select
                    fullWidth
                    label="Select Service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    margin="normal"
                    required
                    sx={styles.textField}
                  >
                    {shop.services.map((s, i) => (
                      <MenuItem key={i} value={s} sx={styles.menuItem}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BuildIcon fontSize="small" sx={{ color: '#667eea' }} />
                          {s}
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                </Zoom>

                {/* Date & Time Picker */}
                <Zoom in={true} style={{ transitionDelay: '400ms' }}>
                  <Box sx={styles.dateTimeWrapper}>
                    <DateTimePicker
                      label="Select Date & Time"
                      value={dateTime}
                      onChange={handleDateTimeChange}
                      minDateTime={dayjs()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          margin: "normal",
                          required: true,
                          error: dateError,
                          helperText: dateError ? "Please select a future date and time" : "Select a convenient date and time",
                          InputProps: {
                            startAdornment: <CalendarMonthIcon sx={styles.inputIcon} />,
                          },
                          sx: styles.textField
                        },
                        actionBar: {
                          actions: ['accept', 'cancel', 'clear']
                        }
                      }}
                      shouldDisableDate={shouldDisableDate}
                      disablePast={true}
                    />
                  </Box>
                </Zoom>

                {/* Submit Button */}
                <Grow in={true} style={{ transitionDelay: '500ms' }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isSubmitting}
                    startIcon={<WhatsAppIcon />}
                    sx={styles.submitButton}
                  >
                    {isSubmitting ? 'Processing...' : 'Book via WhatsApp'}
                  </Button>
                </Grow>

                {/* Footer Note */}
                <Typography variant="caption" sx={styles.footerNote}>
                  📱 You'll be redirected to WhatsApp to confirm your booking
                </Typography>
                <Typography variant="caption" sx={styles.footerNote}>
                  ⏰ Please select a future date and time for your appointment
                </Typography>
              </Box>
            </form>
          </Paper>
        </Fade>
      </Box>
    </LocalizationProvider>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(145deg, #f6f9fc 0%, #eef2f6 100%)",
    p: 2,
    position: "relative",
  },
  
  snackbar: {
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  },
  
  // Active card styles
  modernCard: {
    width: "100%",
    maxWidth: "500px",
    borderRadius: "28px",
    overflow: "hidden",
    background: "#ffffff",
    boxShadow: "0 30px 60px -20px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.05)",
    position: "relative",
    zIndex: 1,
  },
  
  headerSection: {
    position: "relative",
    height: "280px",
    overflow: "hidden",
  },
  
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 90%)",
  },
  
  headerContent: {
    position: "relative",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    p: 3,
    color: "white",
  },
  
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    bgcolor: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(5px)",
    color: "white",
    "&:hover": {
      bgcolor: "rgba(255,255,255,0.3)",
    },
  },
  
  shopAvatar: {
    width: 80,
    height: 80,
    border: "4px solid white",
    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
    mb: 2,
    bgcolor: "#667eea",
  },
  
  shopInfo: {
    textAlign: "left",
  },
  
  shopNameWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 1,
  },
  
  shopName: {
    fontWeight: 800,
    fontSize: "1.8rem",
    lineHeight: 1.2,
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
  },
  
  verifiedIcon: {
    color: "#4CAF50",
    fontSize: "1.2rem",
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
  },
  
  locationWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    mb: 1,
  },
  
  locationIcon: {
    fontSize: "1rem",
    opacity: 0.9,
  },
  
  locationText: {
    fontSize: "0.9rem",
    opacity: 0.9,
  },
  
  ratingWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 1,
  },
  
  starIcon: {
    color: "#FFD700",
  },
  
  starIconEmpty: {
    color: "rgba(255,255,255,0.3)",
  },
  
  ratingText: {
    fontSize: "0.9rem",
    fontWeight: 600,
  },
  
  serviceChip: {
    bgcolor: "rgba(255, 255, 255, 0.2)",
    color: "white",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(5px)",
    "& .MuiChip-icon": {
      color: "white",
    },
    "&:hover": {
      bgcolor: "rgba(255, 255, 255, 0.3)",
    },
  },
  
  divider: {
    my: 0,
  },
  
  dividerChip: {
    bgcolor: "#667eea",
    color: "white",
    fontWeight: 600,
    "& .MuiChip-label": {
      px: 2,
    },
    "& .MuiChip-avatar": {
      color: "white",
    },
  },
  
  formContainer: {
    p: 3,
  },
  
  textField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "14px",
      transition: "all 0.3s ease",
      bgcolor: "#f8fafc",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 20px rgba(102, 126, 234, 0.15)",
        bgcolor: "#ffffff",
      },
      "&.Mui-focused": {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 25px rgba(102, 126, 234, 0.25)",
        bgcolor: "#ffffff",
      },
    },
  },
  
  inputIcon: {
    mr: 1,
    color: "#667eea",
  },
  
  menuItem: {
    "&:hover": {
      bgcolor: "rgba(102, 126, 234, 0.08)",
    },
  },
  
  dateTimeWrapper: {
    width: "100%",
  },
  
  submitButton: {
    mt: 3,
    py: 1.5,
    borderRadius: "14px",
    fontSize: "1.1rem",
    fontWeight: 600,
    textTransform: "none",
    background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
    boxShadow: "0 10px 25px -5px rgba(37, 211, 102, 0.5)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 15px 30px -5px rgba(37, 211, 102, 0.6)",
      background: "linear-gradient(135deg, #128C7E 0%, #25D366 100%)",
    },
    "&:disabled": {
      background: "#ccc",
    },
  },
  
  footerNote: {
    display: "block",
    textAlign: "center",
    mt: 1,
    color: "#64748b",
    fontStyle: "italic",
    fontSize: "0.75rem",
  },
  
  // Inactive card styles
  inactiveCard: {
    width: "100%",
    maxWidth: "400px",
    borderRadius: "24px",
    overflow: "hidden",
    textAlign: "center",
    background: "#ffffff",
    boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.2)",
  },
  
  inactiveImageWrapper: {
    position: "relative",
    height: "150px",
    overflow: "hidden",
  },
  
  inactiveImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  
  inactiveImageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(135deg, rgba(244,67,54,0.3) 0%, rgba(244,67,54,0.6) 100%)",
  },
  
  inactiveAvatar: {
    width: 80,
    height: 80,
    margin: "20px auto 0",
    bgcolor: "#f44336",
    border: "3px solid rgba(244, 67, 54, 0.2)",
  },
  
  inactiveTitle: {
    fontWeight: 700,
    color: "#333",
    mt: 1,
    mb: 1,
  },
  
  inactiveContent: {
    p: 2,
    mx: 2,
    borderRadius: "12px",
    bgcolor: "rgba(244, 67, 54, 0.05)",
    mb: 3,
  },
  
  activateButton: {
    mx: 3,
    mb: 3,
    py: 1.5,
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: 600,
    textTransform: "none",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "&:hover": {
      background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
    },
  },
};

export default BookingPage;