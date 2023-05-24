import { useEffect, useState, useRef } from "react";
import "../../App.css";
// import cover from "../../images/Rectangle 21.png";
import { HiRefresh } from "react-icons/hi";
import { FaCompress } from "react-icons/fa";
import {
  BsFillVolumeUpFill,
  // BsFillVolumeMuteFill,
  BsFillVolumeDownFill,
} from "react-icons/bs";
import {
  GiPreviousButton,
  GiNextButton,
  GiPlayButton,
  GiPauseButton,
} from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { setPlaying, endandClaimBounty } from "../../redux/audio";
import { motion } from "framer-motion";

import Web3 from "web3"
function Playing() {
  const { music, playstate, nowplaying, playingId, contract, owner, provider } = useSelector(
    (state) => state.audios
  );
  const dispatch = useDispatch();

  const [audioVolume, setAudioVolume] = useState(1);
  const musicRef = useRef();
  const imgRef = useRef();
  const titleRef = useRef();
  const artistRef = useRef();
  const progressCont = useRef();
  const progressBar = useRef();

  //   toggleAudio
  const toggleAudio = () => {
    onEnded();
    if (nowplaying) {
      musicRef.current.pause();
      dispatch(setPlaying(false));
    } else {
      musicRef.current.play();
      dispatch(setPlaying(true));
    }
  };

  const updateProgress = (e) => {
    // console.log(e.target.currentTime);
    const { currentTime, duration } = e.target;
    let proggrespercent = (currentTime / duration) * 100;
    const progress_bar = document.querySelectorAll(".progress_bar")[0];
    // console.log(progress_bar);
    progress_bar.style.width = `${proggrespercent}%`;
    // let audioCurrent = audio.currentTime;
  };

  // set volume
  const setVolume = (e) => {
    const audio = musicRef.current;
    if (e.target.tagName !== "SPAN") {
      if (e.target.classList.contains("progress_bar")) {
        const width = e.target.parentNode.clientWidth;
        const clickX = e.nativeEvent.offsetX;
        //  getting the volume
        audio.volume = (clickX / width) * 1;
        setAudioVolume((clickX / width) * 1); //setting the state
        progressBar.current.style.width = `${(clickX / width) * 1 * 100}%`;
      } else {
        const width = e.target.clientWidth;
        const clickX = e.nativeEvent.offsetX;
        //  getting the volume
        audio.volume = (clickX / width) * 1;
        setAudioVolume((clickX / width) * 1); //setting the state
        progressBar.current.style.width = `${(clickX / width) * 1 * 100}%`;
      }
    }
    // checking if volume is low
  };
  // ended music
  const onEnded = async () => {
    await contract.methods.claimBounty(music.title).send({
      from: owner,
    });
    const latestBlockNumber = await provider.eth.getBlockNumber();
    contract.events.bountyPaid({
      filter: { reciver: owner },
      fromBlock: latestBlockNumber,
      toBlock: latestBlockNumber
    })
      .on('data', function (event) {
        if (event.returnValues.reciver === owner) {
          dispatch(endandClaimBounty(music._id));
        }
      })
      .on('error', error => {
        // console.log("Error Occurred", error);
      })
  };
  //
  const showVolume = () => {
    const volumeBar = progressCont.current;
    volumeBar.classList.toggle("active");
  };

  useEffect(() => {
    if (playingId) {
      const audio = musicRef.current;
      const img = imgRef.current;
      const artist = artistRef.current;
      const name = titleRef.current;

      audio.src = `${music.file}`;
      artist.textContent = music.artist;
      name.textContent = music.title;
      img.src = music.coverdp;
      if (nowplaying) {
        audio.play();
      }
    }
  }, [playingId]);
  if (playingId) {
    return (
      <motion.div
        className="playing_cont"
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ type: "tween", duration: 0.1 }}
      >
        <audio
          src=""
          style={{ display: "none" }}
          onTimeUpdate={updateProgress}
          onEnded={onEnded}
          ref={musicRef}
        />
        <div className="display">
          <img src="/audio/bg.jpg" alt="" ref={imgRef} />
          <div className="text">
            <h1 ref={titleRef}></h1>
            <p ref={artistRef}></p>
          </div>
        </div>
        <div className="controls">
          <div className="control">
            <FaCompress
              className="fa"
              data-value="shuffle"
              style={{
                color: `${playstate === "shuffle" ? "var(--color)" : "var(--text)"
                  }`,
              }}
            />
            <GiPreviousButton className="fa" />
            <div className="play" onClick={toggleAudio}>
              {!nowplaying ? (
                <GiPlayButton className="icon" />
              ) : (
                <GiPauseButton className="icon" />
              )}
            </div>
            <GiNextButton className="fa" />
            <HiRefresh
              className="fa"
              data-value="repeat"
              style={{
                color: `${playstate === "repeat" ? "var(--color)" : "var(--text)"
                  }`,
              }}
            />
          </div>
          <div
            className="progress_cont"
          >
            <div className="progress_bar">
              <span></span>
            </div>
          </div>
        </div>
        <div className="volume">
          {audioVolume < 0.3 ? (
            <BsFillVolumeDownFill className="icon" onClick={showVolume} />
          ) : (
            <BsFillVolumeUpFill className="icon" onClick={showVolume} />
          )}
          <div
            className="progress_cont"
            onClick={setVolume}
            onTouchMove={setVolume}
            ref={progressCont}
          >
            <div className="progress_bar" ref={progressBar}>
              <span></span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  } else {
    return <>
    </>;
  }
}

export default Playing;
