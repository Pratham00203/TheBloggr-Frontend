import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Spinner from './Spinner'
import Modal from "./Modal";
import bin from "../images/bin.png";
import pencil from "../images/pencil.png";
import { Link, useHistory } from "react-router-dom";
import auth from "../auth";
import { logout, checkAuth } from "../helpers/helpers";
import { useToasts } from "react-toast-notifications";
import axios from "axios";

function Dashboard() {
  document.title = "Dashboard";
  const history = useHistory();
  const { addToast } = useToasts();
  const [showModal, setShowModal] = useState(false);
  const [modalOption, setModalOption] = useState("");
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    if (!checkAuth()) {
      auth.logout(() => {
        history.push("/login");
      });
    }
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      const config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };
      const res = await axios.get("/users/me", config);
      setCurrentUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const showFollowModal = (option) => {
    setModalOption(option);
    setShowModal(true);
  };

  const handleLogout = () => {
    logout();
    addToast("Logged Out Successfully", { appearance: "success" });
    auth.logout(() => {
      history.push("/login");
    });
  };

  const deleteProfile = async () => {
    if(window.confirm('Are you sure you want to delete the account?')){
      try {
        const config = {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        };
        const res = await axios.delete("/users/me/delete", config);
        addToast(res.data, { appearance: "success" });
        auth.logout(() => {
          logout();
          history.push("/login");
        });
      } catch (err) {}
    }
  };

  const deleteBlog = async (blogid) => {
    if(window.confirm("Do you really want to delete this Blog?")){
      try {
    
        const config = {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        };
        const res = await axios.delete(`/blogs/${blogid}/delete`, config);
        setCurrentUser((prev) => {
          return {
            ...prev,
            blogs: res.data.blogs,
          };
        });
        addToast(res.data.msg, { appearance: "warning" });
      } catch (err) {}
    }
   
  };

  return (
    <>
      <Navbar />
      {showModal && (
        <Modal
          option={modalOption}
          closeModal={setShowModal}
          followDetails={
            modalOption === "followers"
              ? currentUser.followers
              : currentUser.following
          }
        />
      )}
      {currentUser ? (
        <section id='main'>
          <div style={{ filter: `${showModal ? "blur(10px)" : "blur(0px)"}` }}>
            <div className='profile-details d-flex flex-col'>
              <div className='col-1 d-flex'>
                <img src={currentUser.userDetails.profile_img} alt='profile' />
                <div className='profile-det'>
                  <h1>{currentUser.userDetails.name}</h1>
                  <p>{currentUser.userDetails.bio}</p>
                  <div className='prof-buttons d-flex'>
                    <Link
                      to={`/update-user/${currentUser.userDetails.userid}`}
                      className='d-flex align-center'>
                      <img src={pencil} alt='' />
                      Update Profile
                    </Link>
                    <button
                      className='d-flex align-center'
                      onClick={() => deleteProfile()}>
                      <img src={bin} alt='' />
                      Delete Profile
                    </button>
                    <button
                      className='d-flex align-center'
                      onClick={() => handleLogout()}>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
              <div className='col-2'>
                <p onClick={() => showFollowModal("followers")}>
                  <span>{currentUser.followers.length}</span>Followers
                </p>
                <p onClick={() => showFollowModal("following")}>
                  <span>{currentUser.following.length}</span>Following
                </p>
              </div>
            </div>
            <div className='user-blogs'>
              <h1>My Blogs</h1>
              <div className='blogs d-flex flex-col'>
                {React.Children.toArray(
                  currentUser.blogs.map((blog) => {
                    return (
                      <div className='blog d-flex align-center'>
                        {/* {blog.blog_img && <img src={blog.blog_img} alt='' />} */}
                        <div className='blog-det'>
                          <p
                            style={{
                              margin: "10px 0",
                              textTransform: "uppercase",
                              color: "var(--green)",
                            }}>
                            {blog.category}
                          </p>
                          <Link to={`/blog/${blog.blogid}`}>
                            <h1>{blog.title}</h1>
                          </Link>
                          <Link
                            to={`/user/${blog.userid}`}
                            className='blog-author d-flex align-center'
                            style={{ marginTop: "8px", gap: "10px" }}>
                            <img
                              src={blog.author_img}
                              style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                              }}
                              alt=''
                            />
                            {blog.author}
                          </Link>
                        </div>
                        <div className='prof-buttons d-flex'>
                          <Link
                            to={`/update-blog/${blog.blogid}`}
                            className='d-flex align-center'>
                            <img src={pencil} alt='' />
                            Update Blog
                          </Link>
                          <button
                            className='d-flex align-center'
                            onClick={() => deleteBlog(blog.blogid)}>
                            <img src={bin} alt='' />
                            Delete Blog
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </section>
      ) : <Spinner/>}
      <Footer />
    </>
  );
}

export default Dashboard;
