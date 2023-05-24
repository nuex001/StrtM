import React from "react";
import "../../css/upload.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Upload() {
  const navigate = useNavigate();

  function previewImg(event) {
    const img = document.querySelector("label img");
    console.log(event.target.files[0]);
    const imgUrl = URL.createObjectURL(event.target.files[0]);
    img.src = imgUrl;
  }

  const notify = () =>
    toast("Sorry you have extended the free subscription", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      type: "error",
      theme: "dark",
    });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!localStorage.getItem("musicApp")) {
      const formData = new FormData(e.target);
      axios
        .post("https://musicapp-api.onrender.com/api/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          e.target.reset();
          localStorage.setItem("musicApp", 1);
          navigate("/");
        });
    } else {
      notify();
    }
  };

  return (
    <div className="upload_container">
      <ToastContainer />
      <form action="" onSubmit={onSubmit} encType="multipart/form-data">
        <input
          type="file"
          accept="image/*"
          id="cover"
          name="cover"
          style={{ display: "none" }}
          onChange={previewImg}
        />
        <label htmlFor="cover">
          <img src="/audio/avatar.jpg" alt="" />
        </label>
        <input type="text" placeholder="Song Name" name="title" />
        <input type="text" placeholder="Artist" name="artist" />
        <input
          type="file"
          multiple
          style={{ border: "none", cursor: "pointer" }}
          accept="audio/*"
          name="songs"
        />
        <textarea id="" placeholder="Description" name="description"></textarea>
        <input type="submit" value="Upload" />
      </form>
    </div>
  );
}

export default Upload;
