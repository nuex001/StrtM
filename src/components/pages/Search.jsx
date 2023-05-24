import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../../css/search.css";
import { CiMusicNote1 } from "react-icons/ci";
// import cover1 from "../../images/Rectangle 14.png";
// import cover2 from "../../images/Rectangle 15.png";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { filterMusic } from "../../redux/audio";
// import axios from "axios";
import AudioItem from "../layouts/AudioItem";
// import Playing from "../layouts/Playing";

function Search() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  let name = searchParams.get("q");

  const { musics } = useSelector(
    (state) => state.audios
  );

  useEffect(() => {
    if (name) {
      dispatch(filterMusic(name))
    }
  }, []);
  //  console.log(id);

  return (
    <React.Fragment>
      <motion.div
        className="search"
        transition={{ type: "tween", duration: 1, delay: 1 }}
      >
        <div className="headerRow">
          <h2 className="header">
            SEARCH RESULTS :
          </h2>
          <h3>{musics && musics.length > 0 ? "FOUND" : "EMPTY"}</h3>
        </div>
        <main>
          {musics
            &&
            musics.length > 0 ?
            <div className="row">
              {musics.map((music) => (
                <AudioItem key={music._id} item={music} />
              ))}
            </div>
            :
            <div className="noresult">
              <CiMusicNote1 />
            </div>
          }
          {/* <div className="row">
            <AudioItem />
            <AudioItem />
            <AudioItem />
            <AudioItem />
            <AudioItem />
          </div> */}

        </main>
      </motion.div>
    </React.Fragment>
  );
}

export default Search;
