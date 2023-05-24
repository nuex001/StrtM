import React, { useEffect, useState } from "react";
import "../../css/home.css";
import { Link } from "react-router-dom";
import vector from "../../images/Vector.svg";
import person from "../../images/person.png";
import Img from "../../images/Ellipse 2.png";
import Img1 from "../../images/Ellipse 3.png";
import Img2 from "../../images/Ellipse 4.png";
import Img3 from "../../images/Ellipse 5.png";
// cover
import cover from "../../images/Lead-image.png";
import cover1 from "../../images/Rectangle 17 (1).png";
import cover2 from "../../images/Rectangle 15.png";
import cover3 from "../../images/Rectangle 26 (2).png";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa"
import ChartsRes from "../layouts/ChartsRes";
import { motion } from "framer-motion";
import Spinner from "../layouts/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { fetchCharts, likeOrUnlike } from "../../redux/audio";
import { v4 as uuidv4 } from "uuid";
import Rows from "../layouts/Rows";
import { likeMusic, unLikeMusic, numRound } from "../../utils/uils"

function Home() {
  const [data, setData] = useState(null);
  let token = localStorage.getItem("musicToken");
  useEffect(() => {
    if (!token) {
      localStorage.setItem("musicToken", uuidv4());
    }
    setData(token);
  }, [token]);
  const dispatch = useDispatch();
  const { charts, owner } = useSelector((state) => state.audios);
  useEffect(() => {
    dispatch(fetchCharts());
  }, []);

  //




  // working for likes
  // Like

  return (
    <React.Fragment>
      <motion.section
        className="home"
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ type: "tween", duration: 0.1 }}
      >
        <header>
          <div className="box">
            <p>Currated playlist</p>
            <div className="text">
              <h1>R & B Hits</h1>
              <p>
                All mine, Lie again, Petty call me everyday, Out of time, No
                love, Bad habit,and so much more
              </p>
            </div>
            <div className="reactions">
              <img src={Img} alt="" />
              <img src={Img1} alt="" />
              <img src={Img2} alt="" />
              <img src={Img} alt="" />
              <img src={Img3} alt="" />
              <span>
                <AiFillHeart className="icon" /> 33K Likes
              </span>
            </div>
            <img src={vector} alt="" className="vector" />
            <img src={person} alt="" className="vector" />
          </div>
          <div className="charts">
            <h1><Link to={`categories/Top`}>Top Charts</Link></h1>
            {charts ? (
              charts.map((chart) => (
                <Link
                  to={`playlist/${chart._id}`}
                  className="row"
                  key={chart._id}
                >
                  <img src={chart.coverdp} alt="" />
                  <div className="text">
                    <h4>{chart.title}</h4>
                    <span>{chart.artist}</span>
                    <p>
                      {numRound(chart.streams.length)}
                      <FaUserCircle className="user" />
                      <FaUserCircle className="user" />
                      <FaUserCircle className="user" />
                    </p>
                  </div>
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
              ))
            ) : (
              <Spinner />
            )}
          </div>
          <ChartsRes />
        </header>
        <Rows />
      </motion.section>
    </React.Fragment>
  );
}

export default Home;
{
  /* <img src={Vector} alt="" /> */
}
