  import React, { useState, useEffect, useCallback } from "react";
  import { useNavigate } from "react-router-dom";
  import Navbar from "../../components/Navbar";
  import userImage from "../../assets/userlogo.png";
  import Cropper from "react-easy-crop";
  import axios from "axios";
  import axiosInstance from "../../api/axios";
  import useAuthStore from "../../store/authStore";

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
    const { isAuthenticated } = useAuthStore(); // Get auth state

    useEffect(() => {
      if (!isAuthenticated) {
        navigate("/login"); // Redirect to login if not authenticated
      }
    }, [isAuthenticated, navigate]);
    
    const [profilePic, setProfilePic] = useState(null);
    const [username, setUsername] = useState("");
    // const [imageSrc, setImageSrc] = useState(null);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [activeTab, setActiveTab] = useState("Profile");
    const [showButtons, setShowButtons] = useState(false);
    const [showEnlargedImage, setShowEnlargedImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showAllBookings, setShowAllBookings] = useState(false);

    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const response = await axiosInstance.get("/user/profile/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          // console.log('lOGGED Response:', response);
          
          // Construct full URL for profile picture
          // Remove '/api' from the base URL when constructing image URL
          const baseUrl = (axiosInstance.defaults.baseURL || window.location.origin)
            .replace('/api', '');
          
          const profilePicUrl = response.data.profile_picture 
            ? `${baseUrl}${response.data.profile_picture}`
            : userImage;

          // Update state with fetched data
          setUsername(response.data.username || "");
          setEmail(response.data.email || "");
          setPhone(response.data.phone || "");
          setLocation(response.data.location || "");
          setProfilePic(profilePicUrl);
        } catch (error) {
          console.error("Error fetching profile:", error.response?.data || error.message);
        }
      };
    
      fetchProfile();
    }, []);

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
          // Convert data URL to blob
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
          
          console.log("Backend response:", response.data); // Debug log
          // Update the profile picture with the URL from the response
          setProfilePic(response.data.profile_picture);
          setShowCropper(false);
          alert('Profile changed successfully')

        } catch (error) {
          console.error("Full error:", error); // More detailed error log
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
            location,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Ensure you're sending the auth token
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

          {/* Enlarged Image Modal */}
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
                <p className="mt-4 text-gray-800 p-2 rounded">Location: {location}</p>
              </div>
            )}
            {activeTab === "Edit Details" && (
              <div>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 bg-gray-200 rounded mt-1" />
                <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 bg-gray-200 rounded mt-1" />
                <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-2 bg-gray-200 rounded mt-1" />
                <button className="bg-green-600 text-white px-4 py-2 rounded mt-3 hover:bg-green-700" onClick={handleSaveDetails}>
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

      {/* All Bookings Modal */}
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
    </div>
  );
};

  export default UserProfile;
