import { useState } from "react";
import { useHistory } from "react-router-dom";
import eyeIcon from "../images/eye.png";
import axios from "axios";
import { useToasts } from "react-toast-notifications";

export default function ResetPassword() {
  const history = useHistory();
  const { addToast } = useToasts();
  const [showPassword, setShowPassword] = useState(false);
  const [enterPassword, setEnterPassword] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });

  document.title = "Forgot Password";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  // const checkOTP = (e) => {
  //   //if otp is correct
  //   setEnterPassword(!enterPassword);
  //   //else error that otp is incorrect
  // };

  const checkEmail = (e) => {
    //if email is correct and exists in database
    emailCheck();
    //else give err
  };

  const emailCheck = async () => {
    try {
      const body = {
        email: userDetails.email,
      };
      const res = await axios.post("/auth/check-email", body);
      if (res.status === 200) setEnterPassword(!enterPassword);
    } catch (err) {
      const errors = err.response.data.errors;
      errors.forEach((err) => {
        addToast(err.msg, { appearance: "error" });
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    changePassword();
  };

  const changePassword = async () => {
    try {
      const res = await axios.put("/users/me/reset-password", userDetails);
      addToast(res.data, { appearance: "success" });
      history.push("/login");
    } catch (err) {
      const errors = err.response.data.errors;
      errors.forEach((err) => {
        addToast(err.msg, { appearance: "error" });
      });
    }
  };

  return (
    <div className='login-register-container'>
      <section
        id='main'
        className='forgot-p d-flex flex-col align-center justify-center'>
        <div className='container'>
          <h1>Reset Password.</h1>
          <label htmlFor='email' className='d-flex flex-col'>
            <span>Enter Your Email Id: </span>
            <input
              type='email'
              onChange={handleChange}
              name='email'
              placeholder='Enter Your Email Id'
            />
          </label>
          <button className='submit-email' onClick={checkEmail}>
            Next
          </button>
          {/* <div
            className='otp-form'
            style={enterOTP ? { display: "block" } : { display: "none" }}>
            <label htmlFor='otp' className='d-flex flex-col'>
              <span>Enter OTP:</span>
              <input type='text' onChange={handleChange} name='otp' />
            </label>
            <button className='submit-otp' onClick={checkOTP}>
              Proceed
            </button>
          </div> */}
          <form
            className='reset-password'
            style={enterPassword ? { display: "block" } : { display: "none" }}
            onSubmit={handleSubmit}>
            <label htmlFor='password' className='d-flex flex-col'>
              <span>Enter New Password: </span>
              <img
                className='toggle-password'
                src={eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
                alt=''
              />
              <input
                type={showPassword ? "text" : "password"}
                name='password'
                onChange={handleChange}
                placeholder='Password'
              />
            </label>
            <input type='submit' value='Change Password' />
          </form>
        </div>
      </section>
    </div>
  );
}
