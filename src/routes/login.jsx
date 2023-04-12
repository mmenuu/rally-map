import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/map");
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formValid = true;

    // Basic validation
    if (formData.username.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: "Username is required",
      }));
      formValid = false;
    }

    if (formData.password.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password is required",
      }));
      formValid = false;
    }

    if (formValid) {
      login(formData);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <div className="bg-white p-10 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Login</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-gray-800 font-bold mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full border border-gray-300 p-2 rounded-lg ${
                errors.username ? "border-red-500" : ""
              }`}
              placeholder="Enter your username"
              autoComplete="off"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-800 font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full border border-gray-300 p-2 rounded-lg ${
                errors.password ? "border-red-500" : ""
              }`}
              placeholder="Enter your password"
              autoComplete="off"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full rounded-3xl bg-black px-6 py-2 text-xl font-medium uppercase text-white"
            >
              Login
            </button>
          </div>
        </form>

        <div className="mt-4">
          <p className="text-center font-light">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
