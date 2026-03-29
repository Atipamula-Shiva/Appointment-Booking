// ============================================
// FILE: src/pages/Home.js (Updated with role-based UI)
// ============================================
import shops from "../data/shops";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';

// Enhanced Icons with better sizing
const StarIcon = ({ filled = true }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#FFD700" : "#E2E8F0"} xmlns="http://www.w3.org/2000/svg">
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

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get logged-in user
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 480;
  const isTablet = windowWidth <= 768;

  // Get unique locations for filter
  const locations = ["all", ...new Set(Object.values(shops).map(shop => shop.location))];

  // Filter shops based on search and location
  const filteredShops = Object.entries(shops).filter(([_, shop]) => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.services.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLocation = selectedLocation === "all" || shop.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  // Calculate statistics
  const activeShops = Object.values(shops).filter(shop => shop.isActive).length;
  const totalServices = Object.values(shops).reduce((acc, shop) => acc + shop.services.length, 0);


  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
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
        }} />
        <div style={{
          position: "absolute",
          bottom: "-80px",
          left: "-80px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
        }} />
        
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}>
          <h1 style={{
            fontSize: isMobile ? "32px" : isTablet ? "42px" : "52px",
            fontWeight: "800",
            color: "white",
            margin: "0 0 16px 0",
            lineHeight: 1.2,
            textShadow: "0 2px 10px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}>
            Find Nearby Services
          </h1>
          <p style={{
            fontSize: isMobile ? "16px" : "18px",
            color: "rgba(255,255,255,0.9)",
            maxWidth: "700px",
            margin: "0 auto 32px",
            textAlign: "center",
            lineHeight: 1.6,
          }}>
            Discover and book appointments at the best local businesses in your area
          </p>

          <div style={{
            maxWidth: "600px",
            margin: "0 auto",
            position: "relative",
          }}>
            <div style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
            }}>
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search by shop name or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: isMobile ? "16px 16px 16px 48px" : "18px 18px 18px 52px",
                border: "none",
                borderRadius: "50px",
                fontSize: isMobile ? "14px" : "16px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{
        maxWidth: "1200px",
        margin: "-40px auto 40px",
        padding: isMobile ? "0 16px" : "0 24px",
        position: "relative",
        zIndex: 2,
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: "20px",
        }}>
          {[
            { label: "Active Businesses", value: activeShops, icon: "🏪", color: "#667eea" },
            { label: "Total Services", value: totalServices, icon: "💇", color: "#764ba2" },
            { label: "Locations", value: locations.length - 1, icon: "📍", color: "#25D366" },
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                background: "white",
                borderRadius: "20px",
                padding: isMobile ? "20px" : "24px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                animation: `slideUp 0.5s ease ${index * 0.1}s`,
              }}
            >
              <div style={{
                width: isMobile ? "50px" : "60px",
                height: isMobile ? "50px" : "60px",
                borderRadius: "15px",
                background: `${stat.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: isMobile ? "24px" : "28px",
              }}>
                {stat.icon}
              </div>
              <div>
                <div style={{
                  fontSize: isMobile ? "20px" : "28px",
                  fontWeight: "700",
                  color: stat.color,
                  lineHeight: 1.2,
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: isMobile ? "13px" : "14px",
                  color: "#64748b",
                }}>
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
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
        }}>
          <h2 style={{
            fontSize: isMobile ? "20px" : "24px",
            fontWeight: "700",
            color: "#1e293b",
            margin: 0,
          }}>
            Available Services {filteredShops.length > 0 && `(${filteredShops.length})`}
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
                padding: isMobile ? "10px 16px" : "12px 20px",
                borderRadius: "30px",
                border: "1px solid #e2e8f0",
                background: "white",
                fontSize: isMobile ? "14px" : "15px",
                color: "#1e293b",
                cursor: "pointer",
                outline: "none",
                flex: isMobile ? 1 : "none",
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
      </div>

      {/* Grid */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: isMobile ? "0 16px 40px" : "0 24px 60px",
      }}>
        {filteredShops.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile 
              ? "1fr" 
              : isTablet 
                ? "repeat(2, 1fr)" 
                : "repeat(3, 1fr)",
            gap: isMobile ? "20px" : "30px",
          }}>
            {filteredShops.map(([key, shop], index) => (
              <div
                key={key}
                onClick={() => user?.role === 'customer' && navigate(`/${key}`)}
                style={{
                  background: "white",
                  borderRadius: "24px",
                  overflow: "hidden",
                  boxShadow: "0 20px 40px -15px rgba(0,0,0,0.15)",
                  cursor: user?.role === 'customer' ? "pointer" : "default",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  opacity: 0,
                  animation: `fadeInUp 0.6s ease forwards ${index * 0.1}s`,
                  border: shop.isActive ? "1px solid rgba(102, 126, 234, 0.2)" : "2px solid #f44336",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  if (user?.role === 'customer') {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow = "0 30px 60px -20px rgba(0,0,0,0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (user?.role === 'customer') {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 20px 40px -15px rgba(0,0,0,0.15)";
                  }
                }}
              >
                {/* Image Section - same as before */}
                <div style={{
                  position: "relative",
                  height: isMobile ? "200px" : "220px",
                  overflow: "hidden",
                }}>
                  <img
                    src={shop.image}
                    alt={shop.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.6s ease",
                    }}
                  />
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.8) 100%)",
                  }} />
                  
                  {!shop.isActive && (
                    <div style={{
                      position: "absolute",
                      top: "16px",
                      right: "16px",
                      background: "#f44336",
                      color: "white",
                      padding: "6px 14px",
                      borderRadius: "30px",
                      fontSize: "12px",
                      fontWeight: "600",
                      zIndex: 2,
                    }}>
                      ⏸️ Paused
                    </div>
                  )}
                  
                  <div style={{
                    position: "absolute",
                    bottom: "16px",
                    left: "16px",
                    background: "rgba(0,0,0,0.7)",
                    backdropFilter: "blur(5px)",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "30px",
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    zIndex: 2,
                  }}>
                    <StarIcon />
                    <span style={{ fontWeight: "600" }}>{shop.rating}</span>
                  </div>

                  <div style={{
                    position: "absolute",
                    bottom: "16px",
                    right: "16px",
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(5px)",
                    color: "#1e293b",
                    padding: "6px 12px",
                    borderRadius: "30px",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    zIndex: 2,
                  }}>
                    <LocationIcon />
                    <span>{shop.location}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div style={{
                  padding: isMobile ? "20px" : "24px",
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    marginBottom: "16px",
                  }}>
                    <img
                      src={shop.logo}
                      alt={shop.name}
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "16px",
                        border: "3px solid white",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                        objectFit: "cover",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: isMobile ? "18px" : "20px",
                        fontWeight: "700",
                        margin: "0 0 4px 0",
                        color: "#1e293b",
                      }}>
                        {shop.name}
                      </h3>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "13px",
                        color: "#64748b",
                      }}>
                        <ClockIcon />
                        <span>Open until 8:00 PM</span>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "20px",
                    minHeight: "64px",
                  }}>
                    {shop.services.slice(0, 3).map((service, i) => (
                      <span
                        key={i}
                        style={{
                          background: "#f1f5f9",
                          color: "#475569",
                          padding: "6px 14px",
                          borderRadius: "30px",
                          fontSize: "13px",
                          fontWeight: "500",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {service}
                      </span>
                    ))}
                    {shop.services.length > 3 && (
                      <span style={{
                        background: "#e2e8f0",
                        color: "#334155",
                        padding: "6px 14px",
                        borderRadius: "30px",
                        fontSize: "13px",
                        fontWeight: "500",
                      }}>
                        +{shop.services.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Role-based Action Button */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTop: "1px solid #e2e8f0",
                    paddingTop: "16px",
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}>
                      <div style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "#25D36615",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <PhoneIcon />
                      </div>
                      <span style={{
                        fontSize: "13px",
                        color: "#475569",
                        fontWeight: "500",
                      }}>
                        {shop.phone}
                      </span>
                    </div>
                    
                    {user?.role === 'customer' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/${key}`);
                        }}
                        style={{
                          background: shop.isActive 
                            ? "linear-gradient(135deg, #25D366 0%, #128C7E 100%)"
                            : "#cbd5e1",
                          color: "white",
                          border: "none",
                          padding: isMobile ? "10px 20px" : "12px 24px",
                          borderRadius: "40px",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: shop.isActive ? "pointer" : "not-allowed",
                          transition: "all 0.3s ease",
                          boxShadow: shop.isActive ? "0 8px 20px rgba(37, 211, 102, 0.3)" : "none",
                        }}
                        disabled={!shop.isActive}
                      >
                        Book Now →
                      </button>
                    )}
                    
                    {user?.role === 'owner' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Navigate to shop management dashboard
                          alert(`Manage Shop: ${shop.name}\n\nThis is where shop owners can manage bookings, services, and settings.`);
                        }}
                        style={{
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                          border: "none",
                          padding: isMobile ? "10px 20px" : "12px 24px",
                          borderRadius: "40px",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                      >
                        Manage Shop →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "white",
            borderRadius: "30px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>🔍</div>
            <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#1e293b", marginBottom: "8px" }}>
              No services found
            </h3>
            <p style={{ fontSize: "15px", color: "#64748b", marginBottom: "24px" }}>
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedLocation("all");
              }}
              style={{
                background: "#667eea",
                color: "white",
                border: "none",
                padding: "12px 30px",
                borderRadius: "40px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
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

export default Home;