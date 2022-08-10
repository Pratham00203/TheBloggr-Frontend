import Navbar from "./Navbar";
import Footer from "./Footer";
import React, { useEffect, useState } from "react";
import { Link, Redirect, useHistory, useParams } from "react-router-dom";
import { checkAuth } from "../helpers/helpers";
import auth from "../auth";
import Spinner from './Spinner'
import axios from "axios";

export default function Feed({ type }) {
  const { query } = useParams();
  const history = useHistory();
  const [loaded, setLoaded] = useState(false);
  const [feedBlogs, setFeedBlogs] = useState([]);

  useEffect(() => {
    if (!checkAuth()) {
      auth.logout(() => {
        history.push("/login");
      });
    }
    type === "feed" ? getFeedBlogs() : getResults();
  }, []);

  const getFeedBlogs = async () => {
    try {
      const config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        method: "GET",
      };
      fetch("https://thebloggr-backend.herokuapp.com/blogs/me/my-feed", config)
        .then((res) => res.json())
        .then((res) => {
          setLoaded(true);
          setFeedBlogs(res);
        });
      // const res = await axios.get("/blogs/me/my-feed", config);
      // setLoaded(true);
      // setFeedBlogs(res.data);
    } catch (err) {}
  };

  const getResults = async () => {
    try {
      const config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        method: "GET",
      };
      if (query === "all") {
        fetch("https://thebloggr-backend.herokuapp.com/blogs", config)
          .then((res) => res.json())
          .then((res) => {
            setLoaded(true);
            setFeedBlogs(res.blogs);
          });
        // const res = await axios.get("/blogs", config);
        // setLoaded(true);
        // setFeedBlogs(res.data.blogs);
      } else {
        fetch(`https://thebloggr-backend.herokuapp.com/blogs/search/${query}`, config)
          .then((res) => res.json())
          .then((res) => {
            setLoaded(true);
            setFeedBlogs(res);
          });
        // const res = await axios.get(`/blogs/search/${query}`);
        // setLoaded(true);
        // setFeedBlogs(res.data);
      }
    } catch (err) {}
  };

  // const userFeedBlogs = [
  //   {
  //     title: "Is WEB 3.0 the new technology revolution?",
  //     description:
  //       "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta libero tenetur at fugiat consequuntur quidem minima quaerat, ipsum placeat dolores ullam eum porro dolorem alias, voluptas quo maiores molestiae perspiciatis. Sunt cupiditate enim non dolorum ut ipsa obcaecati! Possimus odio impedit eum amet porro est eius quaerat illum modi animi.",
  //     author: "Pratham",
  //     blog_img:
  //       "https://cdn.pixabay.com/photo/2016/04/04/14/12/monitor-1307227__480.jpg",
  //     category: "Technology",
  //     author_img:
  //       "https://cdn.pixabay.com/photo/2016/04/04/14/12/monitor-1307227__480.jpg",
  //   },
  //   {
  //     title: "Is WEB 3.0 the new technology revolution?",
  //     description:
  //       "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta libero tenetur at fugiat consequuntur quidem minima quaerat, ipsum placeat dolores ullam eum porro dolorem alias, voluptas quo maiores molestiae perspiciatis. Sunt cupiditate enim non dolorum ut ipsa obcaecati! Possimus odio impedit eum amet porro est eius quaerat illum modi animi.",
  //     author: "Pratham",
  //     blog_img:
  //       "https://cdn.pixabay.com/photo/2016/04/04/14/12/monitor-1307227__480.jpg",
  //     category: "Technology",
  //     author_img:
  //       "https://cdn.pixabay.com/photo/2016/04/04/14/12/monitor-1307227__480.jpg",
  //   },
  //   {
  //     title: "Is WEB 3.0 the new technology revolution?",
  //     description:
  //       "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta libero tenetur at fugiat consequuntur quidem minima quaerat, ipsum placeat dolores ullam eum porro dolorem alias, voluptas quo maiores molestiae perspiciatis. Sunt cupiditate enim non dolorum ut ipsa obcaecati! Possimus odio impedit eum amet porro est eius quaerat illum modi animi.",
  //     author: "Pratham",
  //     blog_img:
  //       "https://cdn.pixabay.com/photo/2016/04/04/14/12/monitor-1307227__480.jpg",
  //     category: "Technology",
  //     author_img:
  //       "https://cdn.pixabay.com/photo/2016/04/04/14/12/monitor-1307227__480.jpg",
  //   },
  // ];
  // const searchBlogs = [
  //   {
  //     title: "Is WEB 3.0 the new technology revolution?",
  //     description:
  //       "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta libero tenetur at fugiat consequuntur quidem minima quaerat, ipsum placeat dolores ullam eum porro dolorem alias, voluptas quo maiores molestiae perspiciatis. Sunt cupiditate enim non dolorum ut ipsa obcaecati! Possimus odio impedit eum amet porro est eius quaerat illum modi animi.",
  //     author: "Pratham",
  //     blog_img:
  //       "https://cdn.pixabay.com/photo/2016/04/04/14/12/monitor-1307227__480.jpg",
  //     category: "Technology",
  //     author_img:
  //       "https://cdn.pixabay.com/photo/2016/04/04/14/12/monitor-1307227__480.jpg",
  //   },
  //   {
  //     title: "Is WEB 3.0 the new technology revolution?",
  //     description:
  //       "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta libero tenetur at fugiat consequuntur quidem minima quaerat, ipsum placeat dolores ullam eum porro dolorem alias, voluptas quo maiores molestiae perspiciatis. Sunt cupiditate enim non dolorum ut ipsa obcaecati! Possimus odio impedit eum amet porro est eius quaerat illum modi animi.",
  //     author: "Pratham",
  //     blog_img:
  //       "https://cdn.pixabay.com/photo/2016/04/04/14/12/monitor-1307227__480.jpg",
  //     category: "Technology",
  //     author_img:
  //       "https://cdn.pixabay.com/photo/2016/04/04/14/12/monitor-1307227__480.jpg",
  //   },
  //   {
  //     title: "Is WEB 3.0 the new technology revolution?",
  //     description:
  //       "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta libero tenetur at fugiat consequuntur quidem minima quaerat, ipsum placeat dolores ullam eum porro dolorem alias, voluptas quo maiores molestiae perspiciatis. Sunt cupiditate enim non dolorum ut ipsa obcaecati! Possimus odio impedit eum amet porro est eius quaerat illum modi animi.",
  //     author: "Pratham",
  //     blog_img:
  //       "https://cdn.pixabay.com/photo/2016/04/04/14/12/monitor-1307227__480.jpg",
  //     category: "Technology",
  //     author_img:
  //       "https://cdn.pixabay.com/photo/2016/04/04/14/12/monitor-1307227__480.jpg",
  //   },
  // ];

  document.title = type === "feed" ? "My Feed" : "Results";

  return (
    <>
      <Navbar />
      {loaded ? (
        <section id='main' className='myfeed'>
          <h1>{type === "feed" ? "My Feed" : "Results"}</h1>
          <div className='my-feed-blogs d-flex flex-col'>
            {feedBlogs.length !== 0 ? (
              React.Children.toArray(
                feedBlogs.map((blog) => {
                  return (
                    <Link to={`/blog/${blog.blogid}`}>
                      <div className='f-blog d-flex'>
                        {/* {blog.blog_img && <img src={blog.blog_img} alt='' />} */}
                        <div className='f-blog-det'>
                          <p
                            style={{
                              margin: "10px 0",
                              textTransform: "uppercase",
                              color: "var(--green)",
                            }}>
                            {blog.category}
                          </p>
                          <h1>{blog.title}</h1>
                          <Link
                            to={`/user/${blog.userid}`}
                            className='blog-author d-flex align-center'
                            style={{
                              marginTop: "8px",
                              gap: "10px",
                              color: "rgba(0, 0, 0, 0.5)",
                              fontSize: "1.5em",
                            }}>
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
                      </div>
                    </Link>
                  );
                })
              )
            ) : (
              <Redirect to='/no-results' />
            )}
          </div>
        </section>
      ) : <Spinner/>}
      <Footer />
    </>
  );
}
