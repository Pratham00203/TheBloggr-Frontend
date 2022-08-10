import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { useHistory, useParams } from "react-router-dom";
import { checkAuth } from "../helpers/helpers";
import auth from "../auth";
import { useToasts } from "react-toast-notifications";

export default function BlogForm({ type }) {
  const { addToast } = useToasts();
  const [blogDetails, setBlogDetails] = useState({
    title: "",
    category: "",
    description: "",
    keywords: "",
    blog_img: "",
  });

  const { blogid } = useParams();
  const history = useHistory();

  useEffect(() => {
    if (!checkAuth()) {
      auth.logout(() => {
        history.push("/login");
      });
    }
    document.title = `${type} Blog`;
    type === "Update" && loadPreviousDetails();
  }, []);

  const loadPreviousDetails = async () => {
    try {
      const config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };
      const res = await axios.get(`/blogs/${blogid}`, config);
      setBlogDetails(res.data.blogDetails);
    } catch (err) {}
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "blog_img") {
      const file = e.target.files[0];
      // const fileSize = Math.round(file.size / 1024);
      // if (fileSize < 70) {
        previewFile(file);
      // } else {
      //   addToast("File Size to Large, upload a image less than 75kb", {
      //     appearance: "error",
      //   });
      // }
    }

    setBlogDetails((prev) => {
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
      setBlogDetails((prev) => {
        return {
          ...prev,
          blog_img: reader.result,
        };
      });
    };
  };

  const handleDescriptionChange = (e) => {
    setBlogDetails((prev) => {
      return {
        ...prev,
        description: e,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === "Update") {
      updateBlog();
    } else {
      createBlog();
    }
  };

  const updateBlog = async () => {
    try {
      const config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };
      await axios.put(`/blogs/${blogid}/update`, blogDetails, config);
      addToast("Blog Updated", { appearance: "success" });
      history.push("/dashboard");
    } catch (err) {
      const errors = err.response.data.errors;
      errors.forEach((err) => {
        addToast(err.msg, { appearance: "error" });
      });
    }
  };

  const createBlog = async () => {
    try {
      const config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };
      await axios.post(`/blogs/create`, blogDetails, config);
      addToast("Blog Created", { appearance: "success" });
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
        <h1 className='blog-header'>{type} Blog.</h1>
        <form className='create-blog d-flex flex-col' onSubmit={handleSubmit}>
          <div className='col-1 d-flex'>
            <label htmlFor='title' className='d-flex flex-col'>
              <span>Title:</span>
              <input
                type='text'
                name='title'
                placeholder='Enter Title of the Blog'
                onChange={handleChange}
                value={blogDetails.title}
              />
            </label>
            <label htmlFor='category' className='d-flex flex-col'>
              <span>Category :</span>
              <input
                type='text'
                name='category'
                placeholder='Category of the Blog'
                onChange={handleChange}
                value={blogDetails.category}
              />
              <span className='example'>
                Eg : Technology, Travel, Personal,etc.
              </span>
            </label>
          </div>
          <label htmlFor='description' className='d-flex flex-col'>
            <span>Description:</span>
            <SunEditor
              setContents={blogDetails.description}
              setDefaultStyle="font-family : 'Poppins', sans-serif !important"
              height='300px'
              defaultValue={blogDetails.description}
              onChange={handleDescriptionChange}
              setOptions={{
                buttonList: [
                  ["undo", "redo"],
                  [
                    ":p-More Paragraph-default.more_paragraph",
                    // "font",
                    "fontSize",
                    "formatBlock",
                    "paragraphStyle",
                    "blockquote",
                  ],
                  [
                    "link",
                    "bold",
                    "underline",
                    "italic",
                    "strike",
                    "subscript",
                    "superscript",
                  ],

                  ["fontColor", "hiliteColor", "textStyle"],
                  ["removeFormat"],
                  ["outdent", "indent"],
                  ["align", "horizontalRule", "list", "lineHeight"],
                  [
                    "-right",
                    ":i-More Misc-default.more_vertical",
                    "fullScreen",
                    "showBlocks",
                    "codeView",
                    "preview",
                    "print",
                    "save",
                    "template",
                  ],
                ],
              }}
            />
            {/* <textarea
              name='description'
              cols='30'
              rows='10'
              placeholder='Description of the Blog'
              onChange={handleChange}
              value={blogDetails.description}></textarea>
            <span className='example'>
              {`Total Characters: ${blogDetails.description.length}  
              Total Words: ${
                !blogDetails.description
                  ? 0
                  : blogDetails.description
                      .trim()
                      .split(" ")
                      .filter((el) => {
                        return el !== " ";
                      }).length

               
              }`}
            </span> */}
          </label>
          <label htmlFor='keywords ' className='d-flex flex-col'>
            <span>Keywords:</span>
            <input
              type='text'
              name='keywords'
              placeholder='Enter Keywords'
              onChange={handleChange}
              value={blogDetails.keywords}
            />
            <span className='example'>
              Eg : For Technology - tech,web,internet,etc
            </span>
          </label>
          <label htmlFor='' className='d-flex flex-col'>
            <span>Upload Blog Pic:</span>
            <input
              type='file'
              name='blog_img'
              value=''
              onChange={handleChange}
            />
          </label>
          <div className='blog-img-preview'>
            {blogDetails.blog_img && (
              <img src={blogDetails.blog_img} alt='blog' />
            )}
          </div>
          <input type='submit' value='Post' />
        </form>
      </section>
      <Footer />
    </>
  );
}
