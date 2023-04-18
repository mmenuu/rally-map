import axios from "axios";

const getMagazines = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/magazines`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.detail);
    }
  };

  const getMagazine = async (magazine_id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/magazines/${magazine_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.detail);
    }
  };

  const createMagazine = async (magazine) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/magazines`,
        magazine,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.detail);
    }
  };
  
  const removeMagazine = async (magazine_id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/magazines/${magazine_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.detail);
    }
  };

  const magazineServices = {
    getMagazines,
    getMagazine,
    createMagazine,
    removeMagazine
  };

  export default magazineServices;
  