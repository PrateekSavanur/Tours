import { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/tours");
        setTours(response.data.data.data);
      } catch (error) {
        console.error("Error fetching tours:", error.message);
      }
    };

    fetchTours();
  }, []);

  return (
    <div className="bg-teal-400">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Welcome to Natours</h1>
        <p className="text-gray-600 mt-2">Explore our amazing tours</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {tours.map((tour) => (
          <div
            key={tour._id}
            className="border rounded-lg overflow-hidden shadow-md bg-white"
          >
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{tour.name}</h2>
              <p className="text-gray-600 mb-4">Duration: {tour.duration}</p>
              <div className="flex justify-between items-center">
                <button className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded inline-flex items-center">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
