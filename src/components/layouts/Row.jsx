import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Spinner from "./Spinner";
import axios from "axios";

function Row({ cat }) {
    const [musics, setMusics] = useState(null);
    const fetchmusic = async () => {
        const mainCat = cat.toLowerCase();
        console.log(mainCat);
        const response = await axios.get(`https://strtmbackend.richeshomesconsult.com/api/music/${mainCat}?start=0&limit=7`);
        setMusics(response.data)
    }
    useEffect(() => {
        fetchmusic();
    }, []);

    return (
        <div className="sliderCont">
            <h1><Link to={`categories/${cat}`}>{cat}</Link></h1>
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
                className="slider"
            >
                {musics == null ?
                    <Spinner />
                    : (
                        musics.length > 0 &&
                        musics.map((song) => (
                            <SwiperSlide className="slides" key={song._id}>
                                <Link to={`playlist/${song._id}`}>
                                    <img src={`${song.coverdp}`} alt="" />
                                    <h6>{song.title}</h6>
                                    <p>{song.artist}</p>
                                    <span><sup>ETH</sup>{song.perToken}</span>
                                </Link>
                            </SwiperSlide>
                        ))
                    )
                }

            </Swiper>
        </div>
    );
}

export default Row;
