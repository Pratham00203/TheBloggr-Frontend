import Navbar from "./Navbar";
import Footer from "./Footer";
import noResultIcon from "../images/search-magnifier-with-a-cross.png";
import { Link, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { checkAuth } from "../helpers/helpers";
import auth from "../auth";

export default function NoResult() {
  const history = useHistory();
  document.title = "No Results Found";

  useEffect(() => {
    if (!checkAuth()) {
      auth.logout(() => {
        history.push("/login");
      });
    }
  }, []);

  return (
    <>
      <Navbar />
      <section id='main'>
        <div className='no-results-found d-flex align-center justify-center flex-col'>
          <img src={noResultIcon} alt='' />
          <h1>No Results Found</h1>
          <Link to='/home'>Back to HomePage</Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
