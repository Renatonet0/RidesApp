import React, { createContext, useContext, useState, useEffect } from 'react';
import { getRidesDePara, getCurrentUser, getUserRides, putMessage, getUser, getRide } from '../lib/appwrite'; 

const GlobalContext = createContext();

export const useGlobalContext = () => {
  if (!GlobalContext) throw new Error("GlobalContext is undefined!");
  return useContext(GlobalContext);
};

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null)
  const [userGuest, setUserGuest] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const [dataR, setDataR] = useState([]);
  const [dataP, setDataP] = useState([]);
  const [dataG, setDataG] = useState([]);
  const [ride, setRide] = useState(null);

  const fetchRide = async (rideId) => {
    if (!rideId) return;
    if (ride?.rideId === rideId) return; 
    try {
      const r = await getRide(rideId);
      setRide(r);
      
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const fetchDataP = async () => {
    if (!user || !user.$id) return;
    try {
      const userResponse = await getCurrentUser(user.$id);  
      const ridesResponse = await getUserRides(user.$id, user?.accountId);   

      setUser(userResponse);  
      setDataP(ridesResponse); 
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const fetchDataR = async (de, para) => {
    setIsLoading(true);
    try {
      const response = await getRidesDePara(de, para);
      setDataR(response);
    } catch (error) {
      console.error('Error fetching rides:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataGuest = async (userId) => {
    setIsLoading(true);
    try {
      const response = await getUser(userId);
      const ridesResponse = await getUserRides(response.$id, response?.accountId);

      setUserGuest(response);
      setDataG(ridesResponse);
    } catch (error) {
      console.error('Error fetching rides:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if(res) {
          setIsLoggedIn(true),
          setUser(res)
        } else {
          setIsLoggedIn(false)
          setUser(null)
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
        dataR,
        fetchDataR,
        dataP,
        fetchDataP,
        fetchDataGuest,
        dataG,
        userGuest,
        ride,
        fetchRide,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider