import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import turfImage from '../assets/turf.jpeg';

const dummyTurfs = [
  { id: 1, name: 'GreenField Turf', location: 'Ernakulam, Kerala', distance: '2 km', price: 500 },
  { id: 2, name: 'PlayZone Arena', location: 'Kochi, Kerala', distance: '5 km', price: 800 },
  { id: 3, name: 'Elite Turf Club', location: 'Thrissur, Kerala', distance: '8 km', price: 650 },
  { id: 4, name: 'Sporty Arena', location: 'Alappuzha, Kerala', distance: '10 km', price: 700 },
  { id: 5, name: 'Maalvis', location: 'Ernakulam, Kerala', distance: '1 km', price: 1000 },
  { id: 6, name: 'Span New', location: 'Ernakulam, Kerala', distance: '3 km', price: 1800 },
];

const Turfs = () => {
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sortOption, setSortOption] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);

  const handleFilterChange = (e) => {
    setSelectedFilters({ ...selectedFilters, [e.target.name]: e.target.value });
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  return (
    <div className="min-h-screen w-full bg-white text-gray-800 relative overflow-hidden">
      <Navbar />
      <div className="container mx-auto px-4 py-10 lg:flex lg:gap-8 my-20">

        {/* Filters for large screens */}
        <div className="hidden lg:block w-1/4 bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">Filters</h2>

          {/* Location Filter */}
          <label className="block text-gray-700 mb-1">Location</label>
          <select
            name="location"
            className="w-full p-2 mb-4 border rounded"
            onChange={handleFilterChange}
          >
            <option value="">Select Location</option>
            <option value="Ernakulam">Ernakulam</option>
            <option value="Kochi">Kochi</option>
            <option value="Thrissur">Thrissur</option>
            <option value="Alappuzha">Alappuzha</option>
          </select>

          {/* Time Slot Filter */}
          <label className="block text-gray-700 mb-1">Time Slot</label>
          <select
            name="timeSlot"
            className="w-full p-2 mb-4 border rounded"
            onChange={handleFilterChange}
          >
            <option value="">Select Time Slot</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
            <option value="night">Night</option>
          </select>
        </div>

        {/* Right - Turf Listings */}
        <div className="w-full lg:w-3/4">
          {/* Sort & Filter Controls */}
          <div className="flex flex-col gap-4 lg:flex-row justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-green-600 text-center lg:text-left">Available Turfs</h1>
            <div className="flex gap-3">
              {/* Sort Button */}
              <button
                className="bg-green-500 text-white py-2 px-4 rounded-md"
                onClick={() => setShowSortOptions(!showSortOptions)}
              >
                Sort By
              </button>
              {/* Filter Button for Small Screens */}
              <button
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </button>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden bg-gray-100 p-4 rounded-lg shadow-md mb-4">
              <h2 className="text-xl font-semibold text-green-600 mb-2">Filters</h2>
              <label className="block text-gray-700 mb-1">Location</label>
              <select
                name="location"
                className="w-full p-2 mb-4 border rounded"
                onChange={handleFilterChange}
              >
                <option value="">Select Location</option>
                <option value="Ernakulam">Ernakulam</option>
                <option value="Kochi">Kochi</option>
                <option value="Thrissur">Thrissur</option>
                <option value="Alappuzha">Alappuzha</option>
              </select>
              <label className="block text-gray-700 mb-1">Time Slot</label>
              <select
                name="timeSlot"
                className="w-full p-2 mb-4 border rounded"
                onChange={handleFilterChange}
              >
                <option value="">Select Time Slot</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="night">Night</option>
              </select>
            </div>
          )}

          {/* Mobile Sort Options */}
          {showSortOptions && (
            <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
              <h2 className="text-xl font-semibold text-green-600 mb-2">Sort By</h2>
              <button onClick={() => handleSortChange('distance')} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Distance</button>
              <button onClick={() => handleSortChange('price')} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Price</button>
            </div>
          )}

          {/* Turf Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {dummyTurfs.map((turf) => (
              <div key={turf.id} className="bg-gray-100 p-4 rounded-lg shadow-md flex w-full">
                <img src={turfImage} alt={turf.name} className="w-32 h-32 rounded-md object-cover" />
                <div className="ml-4 flex flex-col justify-center">
                  <h2 className="text-xl font-semibold">{turf.name}</h2>
                  <p className="text-gray-600">{turf.location}</p>
                  <p className="text-green-600 font-bold">{turf.distance} away</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Turfs;
