import * as Location from "expo-location";

const getReverseGeocodeAsync = async (latitude: number, longitude: number) => {
  try {
    const location = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    // console.log(location);
    // Location.reverseGeocodeAsync returns an array of possible addresses,
    // so you may want to handle or display them accordingly.
    // The first address in the array is usually the most accurate one.
    if (location.length > 0) {
      const address = location[0];
      // console.log(
      //   `Address: ${address.name}, ${address.city}, ${address.region}, ${address.country}`
      // );
      const showAddress = `${address.city}, ${address.country}`;
      return showAddress;
    }
  } catch (error) {
    console.error("Error fetching reverse geocode:", error);
  }
};

export default getReverseGeocodeAsync;