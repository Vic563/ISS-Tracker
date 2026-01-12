import axios from 'axios';
import { getLocationFromCoords } from './LocationService';

const API_URL = 'https://api.wheretheiss.at/v1/satellites/25544';

export const getISSPosition = async () => {
    try {
        const response = await axios.get(API_URL);
        const { latitude, longitude, altitude, velocity, visibility, timestamp } = response.data;
        
        // Get location info (country or ocean)
        const location = await getLocationFromCoords(latitude, longitude);
        
        return {
            lat: latitude,
            lng: longitude,
            alt: altitude,
            velocity: velocity,
            visibility: visibility,
            timestamp: timestamp,
            location: location
        };
    } catch (error) {
        console.error("Error fetching ISS position:", error);
        return null;
    }
};
