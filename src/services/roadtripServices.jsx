import axios from "axios";

const createRoadtrip = async (roadtrip) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/roadtrips`,
      roadtrip,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data
  } catch (error) {
    throw new Error(error.response.data.detail);
  }
};

const getRoadtrips = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/roadtrips`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data
  } catch (error) {
    throw new Error(error.response.data.detail);
  }
};

const getRoadtripsByUser = async (username) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/roadtrips/?user=${username}`
    );
    return res.data
  } catch (error) {
    throw new Error(error.response.data.detail);
  }
};

const getRoadtrip = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/roadtrips/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data
  } catch (error) {
    throw new Error(error.response.data.detail);
  }
};

const updateRoadtrip = async (id, roadtrip) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.patch(
      `${import.meta.env.VITE_API_URL}/roadtrips/${id}`,
      roadtrip,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data
  } catch (error) {
    throw new Error(error.response.data.detail);
  }
};

const deleteRoadtrip = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.delete(
      `${import.meta.env.VITE_API_URL}/roadtrips/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data
  } catch (error) {
    throw new Error(error.response.data.detail);
  }
};

const roadtripServices = {
  createRoadtrip,
  getRoadtrips,
  getRoadtrip,
  getRoadtripsByUser,
  updateRoadtrip,
  deleteRoadtrip,
};

export default roadtripServices;
