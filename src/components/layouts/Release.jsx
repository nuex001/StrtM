import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import cover1 from "../../images/Rectangle 14.png";
import cover2 from "../../images/Rectangle 15.png";
import cover3 from "../../images/Rectangle 26 (2).png";
import cover4 from "../../images/Rectangle 17.png";
import cover5 from "../../images/Rectangle 19.png";
import cover6 from "../../images/Rectangle 20.png";
import cover7 from "../../images/Rectangle 18.png";
import Spinner from "./Spinner"
//

import { fetchMusics } from "../../redux/audio";

function Release() {
  const dispatch = useDispatch();
  const { loading, error, musics, music } = useSelector(
    (state) => state.audios
  );
  // console.log(music,loading);
  useEffect(() => {
    dispatch(fetchMusics());
  }, [ ]);
  return (
    <div className="sliderCont">
      <h1>New releases</h1>
      <Swiper
        breakpoints={{
          0: {
            slidesPerView: 1.7,
          },
          768: {
            slidesPerView: 3.5,
          },
          1240: {
            slidesPerView: 6.3,
          },
        }}
        slidesPerView={6.3}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swipper) => console.log(swipper)}
        className="slider"
      >
        {loading?
        <Spinner/>
        :(
          musics &&
          musics.map((song) => (
            <SwiperSlide className="slides" key={song._id}>
            <Link to={`playlist/${song._id}`}>
              <img src={`https://musicapp-api.onrender.com/${song.cover}`} alt="" />
              <h6>{song.title}</h6>
              <p>{song.artist}</p>
            </Link>
          </SwiperSlide>
            ))
        )
        }
       
      </Swiper>
    </div>
  );
}

export default Release;
