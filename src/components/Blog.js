import Navbar from "./Navbar";
import Footer from "./Footer";
import likeImg from "../images/liked.png";
import unLikeImg from "../images/unliked.png";
import redFlag from "../images/red-flag.png";
import pencil from "../images/pencil.png";
import bin from "../images/bin.png";
import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import auth from "../auth";
import { checkAuth } from "../helpers/helpers";
import axios from "axios";
import { useToasts } from "react-toast-notifications";
import Spinner from "./Spinner";

export default function Blog() {
  const history = useHistory();
  const { blogid } = useParams();
  const { addToast } = useToasts();
  const [blogDetails, setBlogDetails] = useState();
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [isLiked, setIsLiked] = useState();
  const [isFollowing, setIsFollowing] = useState();
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    if (!checkAuth()) {
      auth.logout(() => {
        history.push("/login");
      });
    }
    getBlogDetails();
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
      setCurrentUser(res.data.userDetails);
    } catch (err) {
      console.log(err);
    }
  };

  const getBlogDetails = async () => {
    try {
      const config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };
      const res = await axios.get(`/blogs/${blogid}`, config);
      setDetails(res.data);
    } catch (err) {
      const errors = err.response.data.errors;
      console.log(errors);
    }
  };

  const setDetails = (data) => {
    document.title = `${data.blogDetails.title}`;
    setBlogDetails(data.blogDetails);
    setComments(data.comments);
    setLikes(data.likes);
    setIsFollowing(data.followStatus);
    setIsLiked(data.likeStatus);
  };

  const [reportForm, setReportForm] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [reason, setReason] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    name === "reason" ? setReason(value) : setCommentText(value);
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    reportBlog();
  };

  const reportBlog = async () => {
    const body = {
      reason: reason,
    };
    const config = {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };
    try {
      const res = await axios.post(`/blogs/${blogid}/report`, body, config);
      if (res.data === "Report Added")
        addToast(res.data, { appearance: "success" });
      else addToast(res.data, { appearance: "error" });
    } catch (err) {
      const errors = err.response.data.errors;
      console.log(errors);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    comment();
  };

  const comment = async () => {
    try {
      const config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };
      const body = {
        commentbody: commentText,
      };
      const res = await axios.put(`/comments/${blogid}`, body, config);
      addToast(res.data.msg, { appearance: "success" });
      setComments(res.data.comments);
      setCommentText('')
    } catch (err) {
      const errors = err.response.data.errors;
      console.log(errors);
    }
  };

  const handleLikes = () => {
    if (isLiked) {
      unLike();
    } else {
      like();
    }
    setIsLiked(!isLiked);
  };

  const like = async () => {
    try {
      const config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        method: "PUT",
      };
      fetch(`http://localhost:5000/blogs/${blogid}/like`, config)
        .then((res) => res.json())
        .then((res) => setLikes(res.likes));
      // const res = await axios.put(`/blogs/${blogid}/like`, config);
      // setLikes(res.data.likes);
    } catch (err) {
      const errors = err.response.data.errors;
      console.log(errors);
    }
  };

  const unLike = async () => {
    try {
      const config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        method: "DELETE",
      };

      fetch(`http://localhost:5000/blogs/${blogid}/unlike`, config)
        .then((res) => res.json())
        .then((res) => setLikes(res.likes));
      // const res = await axios.delete(`/blogs/${blogid}/unlike`, config);
      // setLikes(res.data.likes);
    } catch (err) {
      const errors = err.response.data.errors;
      console.log(errors);
    }
  };

  const handleFollow = () => {
    if (isFollowing) {
      unfollow();
    } else {
      follow();
    }
    if (currentUser.userid !== blogDetails.userid) {
      setIsFollowing(!isFollowing);
    }
  };

  const unfollow = async () => {
    try {
      const config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        method: "POST",
      };
      fetch(
        `http://localhost:5000/users/unfollow/${blogDetails.userid}`,
        config
      ).then((res) => res.json());
    } catch (err) {
      const errors = err.response.data.errors;
      console.log(errors);
    }
  };

  const follow = async () => {
    try {
      const config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        method: "POST",
      };
      fetch(`http://localhost:5000/users/follow/${blogDetails.userid}`, config)
        .then((res) => res.json())
        .then((res) => {
          if (res === "You can't Follow yourself")
            addToast(res, { appearance: "error" });
        });
      // const res = await axios.post(
      //   `/users/follow/${blogDetails.userid}`,
      //   config
      // );
      // res.data === "You can't Follow yourself" &&
      //   addToast(res.data, { appearance: "error" });
    } catch (err) {
      const errors = err.response.data.errors;
      console.log(errors);
    }
  };

  const deleteComment = async (commentid) => {
    try {
      const config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };
      const res = await axios.delete(
        `/comments/${commentid}/${blogid}/delete`,
        config
      );
      setComments(res.data.comments);
      addToast(res.data.msg, { appearance: "warning" });
    } catch (err) {
      const errors = err.response.data.errors;
      console.log(errors);
    }
  };

  return (
    <>
      <Navbar />
      {blogDetails ? (
        <section id='main'>
          <div className='blog'>
            <h1 className='title'>{blogDetails.title} </h1>
            <p className='blog-author d-flex align-center'>
              <Link
                to={`/user/${blogDetails.userid}`}
                className='d-flex align-center'
                style={{ marginBottom: "8px" }}>
                <img src={blogDetails.author_img} alt='' /> {blogDetails.author}
              </Link>
              <button
                className='d-flex align-center'
                onClick={handleFollow}
                style={isFollowing ? {
                  border: "none",
                  padding: "5px 15px",
                  color: "#ffff",
                  backgroundColor: "var(--green)",
                  borderRadius: "20px",
                  marginTop: "-8px",
                  fontWeight : 600
                } : {
                  border: "1px solid var(--green)",
                  padding: "5px 15px",
                  color: "var(--green)",
                  backgroundColor: "#ffff",
                  borderRadius: "20px",
                  marginTop: "-8px",
                  fontWeight : 600
                }}>
                {blogDetails && (isFollowing ? "Following" : "Follow")}
              </button>
            {currentUser && (currentUser.userid === blogDetails.userid && <Link to={`/update-blog/${blogDetails.blogid}`}><img style={{
              width : '20px',
              height : '20px',
              borderRadius : '0'
            }} src={pencil} alt="update"/></Link>)}
            </p>
            <p className='blog-create'>Posted On : {blogDetails.createdon}</p>
            {blogDetails.blog_img && <img src={blogDetails.blog_img} alt='' />}
            <div
              className='blog-desc'
              dangerouslySetInnerHTML={{
                __html: blogDetails.description,
              }}></div>
          </div>

          <div className='social-options d-flex'>
            <button className='like d-flex align-center'>
              {
                <img
                  src={isLiked ? likeImg : unLikeImg}
                  alt=''
                  onClick={handleLikes}
                />
              }
              {likes.length}
            </button>
            <button
              className='report d-flex align-center'
              onClick={() => {
                setReportForm(!reportForm);
              }}>
              <img src={redFlag} alt='' />
              Report
            </button>
          </div>
          <form
            onSubmit={handleReportSubmit}
            className='report-form'
            style={reportForm ? { display: "block" } : { display: "none" }}>
            <label htmlFor='reason'>Enter Reason for Report:</label>
            {/* <select name='reason' id='' onChange={handleChange}>
              <option value='Misleading'>Misleading</option>
              <option value='Spam'>Spam</option>
              <option value='Violent or Repulsive Content'>
                Violent or Repulsive Content
              </option>
              <option value='Harrasment or Bullying'>
                Harrasment or Bullying
              </option>
              <option value='Harmful'>Harmful</option>
              <option value='Promotes Terrorism'>Promotes Terrorism</option>
            </select> */}
            <input
              type='text'
              name='reason'
              placeholder='Enter your reason here...'
              onChange={handleChange}
            />
            <input type='submit' value='Report' />
          </form>

          <div className='comments-section'>
            <h1>
              Comments - <span>{comments.length}</span>
            </h1>
            <form className='comment-form' onSubmit={handleCommentSubmit}>
              <textarea
                value={commentText}
                name='commentbody'
                rows='5'
                placeholder='Leave a comment'
                onChange={handleChange}></textarea>
              <input type='submit' value='Comment' />
            </form>
            <div className='comments'>
              {currentUser &&
                React.Children.toArray(
                  comments.map((comment) => {
                    return (
                      <div className='comment d-flex'>
                        <img src={comment.user_img} alt='' />
                        <div className='comment-det'>
                          <Link
                            to={`/user/${comment.userid}`}
                            >
                            <h2>{comment.username}</h2>
                          </Link>
                          <p>{comment.postedon}</p>
                          <p className='comment-body'>{comment.commentbody}</p>
                        </div>
                        {currentUser.userid === comment.userid && (
                          <button
                            className='comment-delete'
                            onClick={() => deleteComment(comment.commentid)}>
                            <img src={bin} alt='' />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
            </div>
          </div>
        </section>
      ) : <Spinner/>}
      <Footer />
    </>
  );
}
