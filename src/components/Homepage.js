import Navbar from "./Navbar";
import Footer from "./Footer";
import trendImg from "../images/trend.png";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import auth from "../auth";
import { checkAuth } from "../helpers/helpers";
import axios from "axios";
import headerImg from '../images/header.svg'
import freeIcon from '../images/icons8-free-60.png';
import easyIcon from '../images/icons8-easy-skin-type-2-100.png';
import noResultIcon from "../images/search-magnifier-with-a-cross.png";
import Spinner from "./Spinner";


export default function Homepage() {
  const history = useHistory();
  document.title = "TheBloggr";
  const [searchQuery, setSearchQuery] = useState("");
  const [loadDetails, setLoadDetails] = useState();

  useEffect(() => {
    if (!checkAuth()) {
      auth.logout(() => {
        history.push("/login");
      });
    } else {
      getHomeDetails();
    }
  }, []);

  const getHomeDetails = async () => {
    try {
      const config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };
      const res = await axios.get("/blogs", config);
      setLoadDetails(res.data);
      return res.data;
    } catch (err) {}
  };

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <Navbar  />
      {loadDetails ? (
         <>
          <header className="d-flex align-center">
          <div>
          <h1>TheBloggr.</h1>
          <p>Where good ideas find you.</p>
          <Link to='/create-blog'>Create a Blog</Link>
          </div>
          <img src={headerImg} alt="" />
        </header>
        <section id='main'>
        
          <div className='top-blog'>
            <Link to={`/blog/${loadDetails.trendingBlog.blogid}`}>
              <div className='trending'>
                <p className='d-flex align-center'>
                  <img src={trendImg} alt='' /> Trending
                </p>

                {/* Trending Blog */}
                <div className='t-blog d-flex flex-col'>
                  <div
                    className='t-bg-img'
                    style={{
                      backgroundImage: `url(${loadDetails.trendingBlog.blog_img})`,
                      backgroundSize : 'cover'
                    }}></div>
                  <div className='t-blog-details'>
                    <h1>{loadDetails.trendingBlog.title}</h1>
                    <Link
                      to={`/user/${loadDetails.trendingBlog.userid}`}
                      style={{
                        marginTop: "8px",
                        gap: "10px",
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "1.4em",
                      }}
                      className='d-flex align-items'>
                      {" "}
                      <img
                        src={loadDetails.trendingBlog.author_img}
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                        }}
                        alt=''
                      />{" "}
                      {loadDetails.trendingBlog.author}
                    </Link>
                  </div>
                </div>
              </div>
            </Link>

            {/* Check out More Section */}
            <div className='check-more'>
              <p>Check out more</p>
              <div className='c-blogs'>
                {loadDetails &&
                  React.Children.toArray(
                    loadDetails.randomBlogs.map((blog) => {
                      if (blog !== null)
                        return (
                          <Link to={`/blog/${blog.blogid}`}>
                            <div className='c-blog d-flex align-center'>
                              {/* {blog.blog_img && (
                                <img src={blog.blog_img} alt='' />
                              )} */}
                              <div className='c-blog-det'>
                                <h1>{blog.title}</h1>
                                <Link
                                  to={`/user/${blog.userid}`}
                                  style={{
                                    marginTop: "8px",
                                    gap: "10px",
                                    color: "rgba(0, 0, 0, 0.5)",
                                    fontSize: "1.4em",
                                  }}
                                  className='d-flex align-items'>
                                  {" "}
                                  <img
                                    src={blog.author_img}
                                    style={{
                                      width: "20px",
                                      height: "20px",
                                      borderRadius: "50%",
                                    }}
                                    alt=''
                                  />{" "}
                                  {blog.author}
                                </Link>
                              </div>
                            </div>
                          </Link>
                        );
                    })
                  )}
              </div>
            </div>
          </div>

          
        </section>
        <div className='search d-flex justify-center align-center'>
            <form>
              <h1>Search for Blogs by Category, Authors, Interests</h1>
              <div
                className='d-flex align-center search-div'
                style={{ justifyContent: "center" }}>
                <input
                  type='text'
                  name='query'
                  placeholder='Search by Category, Author, Keywords'
                  onChange={handleChange}
                />
                <Link
                  to={`/search/${searchQuery}`}
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    padding: "10px",
                    backgroundColor: " #000",
                    color: "#fff",
                    outline: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.4em",
                  }}>
                  Search
                </Link>
              </div>
              {/* <input type='submit' value='Search' /> */}
            </form>
          </div>
          <div className="perks">
             <div className="perk">
               <img src={freeIcon} alt="" />
               <p>Absolutely free to use.</p>
             </div>
             <div className="perk">
               <img src={easyIcon} alt="" />
               <p>Easy to use.</p>
             </div>
             <div className="perk">
               <img src={noResultIcon} alt="" />
               <p>Moderated Content.</p>
             </div>
          </div>
         </>
      ) : <Spinner/>}
      <Footer />
    </>
  );
}
