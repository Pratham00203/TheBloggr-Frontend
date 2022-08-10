import Navbar from "./Navbar";
import Footer from "./Footer";
import { useState, useEffect } from "react";
import { checkAuth } from "../helpers/helpers";
import auth from "../auth";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";

export default function UpdateUserForm() {
  const { addToast } = useToasts();
  document.title = "Update User";
  const history = useHistory();
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    bio: "",
    profile_img: "",
  });

  useEffect(() => {
    if (!checkAuth()) {
      auth.logout(() => {
        history.push("/login");
      });
    }
    loadPreviousDetails();
  }, []);

  const loadPreviousDetails = async () => {
    try {
      const config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };
      const res = await axios.get("/users/me", config);
      setUserDetails(res.data.userDetails);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "profile_img") {
      const file = e.target.files[0];
      const fileSize = Math.round(file.size / 1024);
      if (fileSize < 75) {
        previewFile(file);
      } else {
        addToast("File Size to Large, upload a image less than 75kb", {
          appearance: "error",
        });
      }
    }

    setUserDetails((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setUserDetails((prev) => {
        return {
          ...prev,
          profile_img: reader.result,
        };
      });
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser();
  };

  const updateUser = async () => {
    try {
      const config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };
      await axios.put("/users/me/update", userDetails, config);
      addToast("Profile Updated", { appearance: "success" });
      history.push("/dashboard");
    } catch (err) {
      const errors = err.response.data.errors;
      errors.forEach((err) => {
        addToast(err.msg, { appearance: "error" });
      });
    }
  };

  return (
    <>
      <Navbar />
      <section id='main'>
        <div className='update-user-page'>
          <h1>Update User Details.</h1>
          <form action='' className='user-update' onSubmit={handleSubmit}>
            <div className='col-1 d-flex'>
              <label htmlFor='name' className='d-flex flex-col'>
                <span>Name:</span>
                <input
                  type='text'
                  name='name'
                  value={userDetails.name}
                  onChange={handleChange}
                />
              </label>
              <label htmlFor='email' className='d-flex flex-col'>
                <span>Email Id:</span>
                <input
                  type='email'
                  value={userDetails.email}
                  name='email'
                  onChange={handleChange}
                />
              </label>
            </div>

            <label htmlFor='bio' className='d-flex flex-col'>
              <span>Bio: </span>
              <textarea
                name='bio'
                rows='5'
                value={userDetails.bio}
                onChange={handleChange}></textarea>
            </label>

            <div className='profile-img-upload d-flex align-center'>
              <label htmlFor='profile-img' className='d-flex flex-col'>
                <span>Upload a Profile Picture :</span>
                <input
                  type='file'
                  name='profile_img'
                  value=''
                  accept='image/*'
                  onChange={handleChange}
                />
              </label>
              <div className='preview-img'>
                <p>*Profile Image</p>
                {userDetails.profile_img && (
                  <img src={userDetails.profile_img} alt='profile' />
                )}
              </div>
            </div>

            <input type='submit' value='Update' />
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
}
