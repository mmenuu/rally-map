import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import * as THREE from "three";
import CLOUDS from "vanta/dist/vanta.clouds.min.js";
import AOS from "aos";
import "aos/dist/aos.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { register, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/map");
    }
  }, [user]);

  const vantaRef = useRef(null);
  let vantaEffect = null;

  useEffect(() => {
    vantaEffect = CLOUDS({
      el: vantaRef.current,
      THREE: THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
    });

    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, []);

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

    // Form validation
    let formValid = true;
    const newErrors = {};

    if (formData.username === "") {
      formValid = false;
      newErrors.username = "Username is required";
    }

    if (formData.password === "") {
      formValid = false;
      newErrors.password = "Password is required";
    }

    if (formData.email === "") {
      formValid = false;
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      formValid = false;
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);

    if (formValid) {
      register(formData);
    }
  };

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }} ref={vantaRef}>
      <div
        className="flex flex-col items-center justify-center h-screen"
        data-aos="fade-left"
        data-aos-offset="300"
        data-aos-easing="ease-in-sine"
      >
        <div className="p-10 shadow-lg bg-opacity-20 backdrop-blur-lg rounded-xl drop-shadow-lg bg-white">
          <h1 className="text-3xl font-medium mb-4">Register</h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-neutral-900 font-medium mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full outline-none p-2 rounded-lg"
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="text-red-500 mt-1">{errors.username}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-neutral-900 font-medium mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full outline-none p-2 rounded-lg "
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-500 mt-1">{errors.password}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-neutral-900 font-medium mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full outline-none p-2 rounded-lg"
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="w-full rounded-3xl bg-gray-900 px-6 py-2 text-xl font-medium uppercase text-white hover:bg-gray-800 transition duration-200 hover:ring-2 hover:ring-gray-900 hover:ring-offset-2 hover:ring-offset-white"
              >
                Register
              </button>
            </div>
          </form>
          <div className="mt-4">
            <p className="text-center font-light">
              Already have an Account?{" "}
              <Link to="/login" className="text-white hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
