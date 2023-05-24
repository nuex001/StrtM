import React, { useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../../css/playlist.css";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPlaylist,
  likeOrUnlike,
  subscribeToUser,
  setPlaying,
  setPlayingId,
  clear
} from "../../redux/audio";
import { likeMusic, unLikeMusic, numRound } from "../../utils/uils"
import { FaUserCircle, FaCheckCircle } from "react-icons/fa"
import { MdSubscriptions } from "react-icons/md"
import { AiOutlineLink, AiFillCloseCircle } from "react-icons/ai"
import Spinner from "../layouts/Spinner";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Playlist() {
  const navigate = useNavigate();
  let { id } = useParams();
  if (!id) {
    navigate(-1);
  }
  const overlay = useRef();
  const dispatch = useDispatch();
  const { loading, owner, music, success, error } = useSelector(
    (state) => state.audios
  );
  useEffect(() => {
    dispatch(fetchPlaylist(id));
  }, []);

  useEffect(() => {
    if (error !== null) {
      // console.log(error);
      if (error.toLowerCase().includes("email already exists")) {
        errorMsgs("Email Already exists");
      } else if (error.toLowerCase().includes("already subscribed")) {
        errorMsgs("Already Subscribed");
      } else if (error === "Streamed") {
        errorMsgs(error);
      }
      dispatch(clear());
    } else if (success === "Subscribed successfully") {
      successMsg("Subscribed successfully");
      setTimeout(() => { //refresh
        overlay.current.classList.toggle("active")
      }, 6000);
    } else if (success === "Streamed successfully") {
      successMsg(success);
    }
    dispatch(clear());
  }, [error, success]);

  const errorMsgs = (e) =>
    toast(e, {
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
  const successMsg = (e) =>
    toast(e, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      type: "success",
      theme: "dark",
    });

  // PLAYALL
  const play = () => {
    dispatch(setPlayingId(music._id));
    dispatch(setPlaying(true));
  };

  // ADDCOLLECTION
  const addCollection = () => {
    let cartItems = localStorage.getItem("musicsInCart"); //getting the cart Item
    cartItems = JSON.parse(cartItems); //parsing it
    if (cartItems != null) {
      cartItems = {
        ...cartItems,
        [music.title]: music,
      };
    } else {
      //if empty then create a cartItem
      cartItems = {
        [music.title]: music,
      };
    }

    localStorage.setItem("musicsInCart", JSON.stringify(cartItems));
    console.log(music);
  };
  // EMAIL SUBSCRIPTION
  const toggleEmailSub = () => {
    overlay.current.classList.toggle("active")
  }
  // SUBMIT FOR SUBSCRIBE
  const onSubmit = (e) => {
    e.preventDefault();
    if (e.target.email.value !== "") {
      dispatch(subscribeToUser({ email: e.target.email.value, ownerId: music.ownerId }));
    } else {
      errorMsgs("Please input email")
    }
  }


  return (
    <React.Fragment>
      <ToastContainer />
      <motion.div
        className="child"
        transition={{ type: "tween", duration: 0.1 }}
      >
        {!loading ?
          (
            music &&
            <>
              <div className="backgroundCover"
                style={{ backgroundImage: `url(${music.coverdp})` }}
              >
              </div>
              <div className="header">
                <img
                  src={music.coverdp}
                  alt=""
                  className="cover"
                />
                <div className="text">
                  <h2>{music.title}</h2>
                  <p>{music.artist}</p>
                  <p style={{ fontSize: "10px" }}>{
                    music.streams.includes(owner) ?
                      <>
                        <span>Streamed</span> < FaCheckCircle />
                      </>
                      :
                      <>
                        <span>Not streamed</span> < AiFillCloseCircle />
                      </>
                  }
                  </p>
                  <p className="sup">Per stream: <span><sup>ETH</sup>{music.perToken}</span></p>
                  <p className="sup">Balance: <span><sup>ETH</sup>{music.balance}</span></p>
                  <p>
                    {numRound(music.streams.length)}
                    <FaUserCircle className="user" />
                    <FaUserCircle className="user" />
                    <FaUserCircle className="user" />
                  </p>
                  <div className="innerBox">
                    <div className="box">
                      <img src="/audio/Play.png" alt="" onClick={play} /> Play</div>
                    <div className="box" onClick={addCollection}>
                      <img src="/audio/music-square-add.png" alt="" /> Add to
                      Collection
                    </div>

                    <div className="box" onClick={toggleEmailSub}>
                      <MdSubscriptions className="icon" />
                    </div>
                    <Link to={music.link} target="_blank" className="box">
                      <AiOutlineLink className="icon" />
                    </Link>
                    <div className="heart"
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(likeOrUnlike(music._id))
                      }}>
                      {
                        music.likes.includes(owner) ?
                          <>
                            <AiOutlineHeart className="like " onClick={likeMusic} />
                            <AiFillHeart className="liked active" onClick={unLikeMusic} />
                          </>
                          :
                          <>
                            <AiOutlineHeart className="like active" onClick={likeMusic} />
                            <AiFillHeart className="liked" onClick={unLikeMusic} />
                          </>
                      }
                    </div>
                  </div>
                </div>
              </div>
              <main>
                <h1>LYRICS</h1>
                <p>
                  {music.lyrics}
                </p>
              </main>
            </>
          )
          : (
            <Spinner />
          )}
        <div className="overlay" ref={overlay}>
          <ToastContainer />
          <form action="" onSubmit={onSubmit}>
            <AiFillCloseCircle className='icon' onClick={toggleEmailSub} />
            <h1>SUBSCRIBE TO USER</h1>
            <div className="row">
              <input type="email" name="email" required id="email" placeholder="Email" />
            </div>
            <button>Subscribe</button>
          </form>
        </div>
      </motion.div>
    </React.Fragment>
  );
}

export default Playlist;
