import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import "swiper/css";
import cover from "../../images/Lead-image.png";
import cover1 from "../../images/Rectangle 14.png";
import cover2 from "../../images/Rectangle 15.png";
import { FaUserCircle } from "react-icons/fa"
import "../../css/home.css";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { fetchCharts, likeOrUnlike } from "../../redux/audio";
import { numRound, unLikeMusic, likeMusic } from "../../utils/uils";
import Spinner from "./Spinner";
import axios from "axios";

function ChartsRes() {
  const dispatch = useDispatch();
  const { loading, error, charts, owner } = useSelector((state) => state.audios);
  useEffect(() => {
    dispatch(fetchCharts());
  }, []);


  return (
    <div className="mobileCharts">
      <h1>Top Charts</h1>
      <Swiper
        className="slider"
        breakpoints={{
          375: {
            slidesPerView: 1.2,
          },
          768: {
            slidesPerView: 1,
          },
        }}
      >
        {charts ? (
          charts.map((chart) => (
            <SwiperSlide className="slides" key={chart._id}>
              <Link to={`playlist/${chart._id}`}>
                <img src={`${chart.coverdp}`} alt="" />
                <h4>{chart.title}</h4>
                <span>{chart.artist}</span>
                <p>
                  {numRound(chart.streams.length)}
                  <FaUserCircle className="user" />
                  <FaUserCircle className="user" />
                  <FaUserCircle className="user" />
                </p>
                <div className="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(likeOrUnlike(chart._id))
                  }}>
                  {
                    chart.likes.includes(owner) ?
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
              </Link>
            </SwiperSlide>
          ))
        ) : (
          <Spinner />
        )}
      </Swiper>
    </div>
  );
}

export default ChartsRes;
