import axios from 'axios';

// Using BigDataCloud reverse geocoding API (free, no API key required)
const GEOCODE_API_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

export const getLocationFromCoords = async (lat, lng) => {
    try {
        const response = await axios.get(GEOCODE_API_URL, {
            params: {
                latitude: lat,
                longitude: lng,
                localityLanguage: 'en'
            }
        });
        
        const data = response.data;
        
        // If over ocean, countryName will be empty
        if (!data.countryName) {
            // Try to determine which ocean based on coordinates
            const ocean = getOceanName(lat, lng);
            return {
                country: null,
                region: null,
                ocean: ocean,
                displayName: ocean
            };
        }
        
        return {
            country: data.countryName,
            countryCode: data.countryCode,
            region: data.principalSubdivision || null,
            city: data.city || data.locality || null,
            ocean: null,
            displayName: data.countryName
        };
    } catch (error) {
        console.error("Error fetching location:", error);
        return {
            country: null,
            region: null,
            ocean: null,
            displayName: 'Unknown'
        };
    }
};

// Approximate ocean determination based on coordinates
const getOceanName = (lat, lng) => {
    // Pacific Ocean (largest, split by dateline)
    if ((lng > 100 || lng < -100) && lat > -60 && lat < 60) {
        return 'Pacific Ocean';
    }
    // Atlantic Ocean
    if (lng > -80 && lng < 0 && lat > -60 && lat < 60) {
        return 'Atlantic Ocean';
    }
    if (lng >= 0 && lng < 30 && lat > -60 && lat < 60) {
        return 'Atlantic Ocean';
    }
    // Indian Ocean
    if (lng > 30 && lng < 100 && lat > -60 && lat < 30) {
        return 'Indian Ocean';
    }
    // Arctic Ocean
    if (lat > 60) {
        return 'Arctic Ocean';
    }
    // Southern Ocean
    if (lat < -60) {
        return 'Southern Ocean';
    }
    
    return 'International Waters';
};