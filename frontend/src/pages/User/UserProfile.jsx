import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import userImage from "../../assets/userlogo.png";
import Cropper from "react-easy-crop";
import axios from "axios";
import axiosInstance from "../../api/axios";
import useAuthStore from "../../store/authStore";
import debounce from 'lodash.debounce';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
}); 

const UserProfile = () => {
  const dummyBookings = [
    { id: 1, turf: "GreenField Turf", date: "2024-04-15", time: "5:00 PM", status: "Completed" },
    { id: 2, turf: "PlayZone Arena", date: "2024-04-20", time: "7:00 PM", status: "Completed" },
    { id: 3, turf: "Elite Sports Ground", date: "2024-05-10", time: "3:00 PM", status: "Upcoming" },
    { id: 4, turf: "Victory Turf", date: "2024-05-15", time: "6:00 PM", status: "Upcoming" },
    { id: 5, turf: "Champion Field", date: "2024-04-25", time: "4:00 PM", status: "Completed" },
    { id: 6, turf: "Golden Goal Arena", date: "2024-05-05", time: "8:00 PM", status: "Cancelled" }
  ];

  const visibleBookings = dummyBookings.slice(0, 2);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [profilePic, setProfilePic] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [activeTab, setActiveTab] = useState("Profile");
  const [showButtons, setShowButtons] = useState(false);
  const [showEnlargedImage, setShowEnlargedImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showAllBookings, setShowAllBookings] = useState(false);
  
  // Location search state
  const [locationName, setLocationName] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapPosition, setMapPosition] = useState([51.505, -0.09]); // Default position (London)
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axiosInstance.get("/user/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const baseUrl = (axiosInstance.defaults.baseURL || window.location.origin)
          .replace('/api', '');
        
        const profilePicUrl = response.data.profile_picture 
          ? `${baseUrl}${response.data.profile_picture}`
          : userImage;

        setUsername(response.data.username || "");
        setEmail(response.data.email || "");
        setPhone(response.data.phone || "");
        setLocationName(response.data.location_name || "");
        setLatitude(response.data.latitude || null);
        setLongitude(response.data.longitude || null);
        setProfilePic(profilePicUrl);
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error.message);
      }
    };
  
    fetchProfile();
  }, []);

  // Click outside handler for suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounced location search
  const searchLocations = debounce(async (query) => {
    if (!query.trim()) {
      setLocationSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`
      );
      
      setLocationSuggestions(response.data.map(item => ({
        display_name: item.display_name,
        lat: item.lat,
        lon: item.lon
      })));
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
      setLocationSuggestions([]);
    }
  }, 300);

  const handleLocationInputChange = (e) => {
    const value = e.target.value;
    setLocationQuery(value);
    searchLocations(value);
    setShowSuggestions(true);
  };

  const handleLocationSelect = (suggestion) => {
    setLocationQuery(suggestion.display_name);
    setLocationName(suggestion.display_name);
    setLatitude(parseFloat(suggestion.lat));
    setLongitude(parseFloat(suggestion.lon));
    setShowSuggestions(false);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }
  
    setIsLocating(true);
    setLocationError(null);
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Reverse geocode to get location name
        axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        )
        .then(response => {
          const displayName = response.data.display_name || "Current Location";
          setLocationQuery(displayName);
          setLocationName(displayName);
          setLatitude(latitude);
          setLongitude(longitude);
          setIsLocating(false);
        })
        .catch(error => {
          console.error("Reverse geocoding error:", error);
          setLocationQuery("Current Location");
          setLocationName("Current Location");
          setLatitude(latitude);
          setLongitude(longitude);
          setIsLocating(false);
        });
      },
      (error) => {
        setIsLocating(false);
        setLocationError("Unable to retrieve your location");
        console.error("Geolocation error:", error);
      }
    );
  };

  const handleMapSelect = () => {
    if (selectedPosition) {
      setIsLocating(true);
      setLocationError(null);
      
      axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedPosition.lat}&lon=${selectedPosition.lng}`
      )
      .then(response => {
        const displayName = response.data.display_name || "Selected Location";
        setLocationQuery(displayName);
        setLocationName(displayName);
        setLatitude(selectedPosition.lat);
        setLongitude(selectedPosition.lng);
        setIsLocating(false);
        setShowMapModal(false);
      })
      .catch(error => {
        console.error("Reverse geocoding error:", error);
        setLocationQuery("Selected Location");
        setLocationName("Selected Location");
        setLatitude(selectedPosition.lat);
        setLongitude(selectedPosition.lng);
        setIsLocating(false);
        setShowMapModal(false);
      });
    }
  };

  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        setSelectedPosition(e.latlng);
      },
    });
    return selectedPosition ? (<Marker position={selectedPosition}><Popup>Selected Location</Popup></Marker>) : null;
  }

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyCrop = async () => {
    if (selectedImage && croppedAreaPixels) {
      const image = new Image();
      image.src = selectedImage;
      await image.decode();
  
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
  
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );
  
      const croppedImage = canvas.toDataURL("image/jpeg");
      
      try {
        const blob = await fetch(croppedImage).then(res => res.blob());
        const formData = new FormData();
        formData.append('profile_picture', blob, 'profile.jpg');
        
        const token = localStorage.getItem("accessToken");
        const response = await axiosInstance.put("/user/profile/", formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        
        setProfilePic(response.data.profile_picture);
        setShowCropper(false);
        alert('Profile changed successfully');
      } catch (error) {
        console.error("Error updating profile picture:", error);
        alert("Failed to update profile picture");
      }
    }
  };

  const handleSaveDetails = async () => {
    try {
      const response = await axiosInstance.put(
        "/user/profile/",
        {
          username,
          phone,
          location_name: locationName,
          latitude,
          longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-gray-800 relative overflow-hidden">
      <Navbar />
      <div className="container mx-auto px-4 py-10 my-20 relative">
        <h1 className="text-4xl font-bold text-green-600 text-center mb-6">User Profile</h1>

        <div className="flex justify-center mb-8">
          <div
            className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-green-600"
            onMouseEnter={() => setShowButtons(true)}
            onMouseLeave={() => setShowButtons(false)}
          >
            <img
              src={profilePic}
              alt="Profile"
              className="h-full w-full object-cover"
            />
            {showButtons && (
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded-full text-sm hover:bg-green-700"
                  onClick={() => setShowEnlargedImage(true)}
                >
                  View
                </button>
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded-full text-sm hover:bg-green-700"
                  onClick={() => document.getElementById("profilePicInput").click()}
                >
                  Edit
                </button>
              </div>
            )}
          </div>
          <input
            id="profilePicInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfilePicChange}
          />
        </div>

        {showCropper && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="bg-white p-6 rounded-lg relative w-[90%] md:w-[50%]">
              <h2 className="text-xl font-semibold mb-4 text-center">Crop Image</h2>
              <div className="relative w-full h-64 bg-gray-200">
                <Cropper
                  image={selectedImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="flex justify-center mt-4 gap-4">
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={applyCrop}>
                  Save
                </button>
                <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700" onClick={() => setShowCropper(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showEnlargedImage && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="bg-white p-6 rounded-lg relative">
              <img
                src={profilePic || userImage}
                alt="Enlarged Profile"
                className="max-w-full max-h-[80vh] rounded"
              />
              <button
                className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm hover:bg-red-700"
                onClick={() => setShowEnlargedImage(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md flex">
          <div className="w-1/3 border-r border-gray-300 p-4">
            {["Profile", "Edit Details", "Booking"].map((tab) => (
              <div
                key={tab}
                className={`cursor-pointer p-2 rounded mt-2 ${activeTab === tab ? "bg-green-600 text-white" : "bg-gray-200"}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </div>
            ))}
          </div>

          <div className="w-2/3 p-2">
            {activeTab === "Profile" && (
              <div className="m-2">
                <p className="mt-4 text-gray-800 p-2 rounded">Username: {username}</p>
                <p className="mt-4 text-gray-800 p-2 rounded">Email: {email}</p>
                <p className="mt-4 text-gray-800 p-2 rounded">Phone: {phone}</p>
                <p className="mt-4 text-gray-800 p-2 rounded">Location: {locationName}</p>
                {latitude && longitude && (
                  <p className="mt-4 text-gray-800 p-2 rounded">
                    Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                  </p>
                )}
              </div>
            )}
            {activeTab === "Edit Details" && (
              <div className="space-y-4">
                {/* Username Field */}
                <div className="space-y-1">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  />
                </div>

                {/* Phone Field */}
                <div className="space-y-1">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    id="phone"
                    type="text"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  />
                </div>

                {/* Location Field */}
                <div className="space-y-1">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                  <div className="relative" ref={suggestionsRef}>
                    {/* Location Input Field */}
                    <input
                      id="location"
                      type="text"
                      placeholder="Search location or choose from options"
                      value={locationQuery}
                      onChange={handleLocationInputChange}
                      onFocus={() => setShowSuggestions(true)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    />
                    
                    {/* Location Buttons - Now on their own row on mobile */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {/* Current Location Button */}
                      <button
                        onClick={getCurrentLocation}
                        disabled={isLocating}
                        className="flex-1 md:flex-none p-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:bg-blue-50 disabled:text-blue-400 transition flex items-center justify-center"
                        title="Use current location"
                      >
                        {isLocating ? (
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm">Current Location</span>
                          </>
                        )}
                      </button>

                      {/* Choose on Map Button */}
                      <button
                        onClick={() => {
                          if (latitude && longitude) {
                            setMapPosition([latitude, longitude]);
                          }
                          setShowMapModal(true);
                        }}
                        className="flex-1 md:flex-none p-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition flex items-center justify-center"
                        title="Choose on map"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">Choose on Map</span>
                      </button>
                    </div>

                    {/* Location Suggestions Dropdown */}
                    {showSuggestions && locationSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                        {locationSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition"
                            onClick={() => handleLocationSelect(suggestion)}
                          >
                            <p className="font-medium text-gray-800">{suggestion.display_name.split(',')[0]}</p>
                            <p className="text-xs text-gray-500">{suggestion.display_name.split(',').slice(1).join(',').trim()}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Location Error Message */}
                    {locationError && (
                      <p className="mt-1 text-sm text-red-600">{locationError}</p>
                    )}
                  </div>
                </div>

                {/* Save Button */}
                <button
                  className="w-full py-3 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
                  onClick={handleSaveDetails}
                >
                  Save Changes
                </button>
              </div>
            )}
            {activeTab === "Booking" && (
              <div>
                <h2 className="text-2xl font-semibold text-green-600 mb-3">Booking History</h2>
                {visibleBookings.map((booking) => (
                  <div key={booking.id} className="mb-4 p-3 bg-white rounded-lg shadow-sm">
                    <p className="font-semibold text-lg">{booking.turf}</p>
                    <p className="text-sm text-gray-700">{booking.date} at {booking.time}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      booking.status === "Completed" ? "bg-green-100 text-green-800" :
                      booking.status === "Upcoming" ? "bg-blue-100 text-blue-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                ))}
                
                {dummyBookings.length > 2 && (
                  <button 
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    onClick={() => setShowAllBookings(true)}
                  >
                    Load More
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showAllBookings && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-green-600">All Bookings</h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowAllBookings(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                {dummyBookings.map((booking) => (
                  <div key={booking.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-lg">{booking.turf}</p>
                        <p className="text-sm text-gray-600">{booking.date} at {booking.time}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === "Completed" ? "bg-green-100 text-green-800" :
                        booking.status === "Upcoming" ? "bg-blue-100 text-blue-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {showMapModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Select Location on Map</h2>
              <button 
                onClick={() => setShowMapModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-grow relative">
              <MapContainer 
                center={mapPosition} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker />
              </MapContainer>
            </div>
            <div className="p-4 border-t flex justify-between items-center">
              <div>
                {selectedPosition && (
                  <p className="text-sm">
                    Selected: {selectedPosition.lat.toFixed(6)}, {selectedPosition.lng.toFixed(6)}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowMapModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMapSelect}
                  disabled={!selectedPosition}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300"
                >
                  Select Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default UserProfile;