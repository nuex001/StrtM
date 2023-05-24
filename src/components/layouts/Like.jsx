import React, { useEffect } from 'react'
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    setMusic,
    fetchLiked
} from "../../redux/audio";
import Spinner from './Spinner';

function Like() {
    const dispatch = useDispatch();
    const { loading, musics } = useSelector(
        (state) => state.audios
    );
    useEffect(() => {
        dispatch(fetchLiked());
    }, [])

    const addMusic = (e) => {
        e.preventDefault();
        const src = JSON.parse(e.target.getAttribute("data-src"));
        dispatch(setMusic(src));
    };

    return (
        <div className="box">
            {musics ?
                musics.length > 0 &&
                musics.map((item) => (
                    <Link
                        to={`/playlist/${item._id}`}
                        className="row"
                        key={item._id}
                    >
                        <img
                            src={`${item.coverdp}`}
                            alt=""
                            className="cover"
                        />
                        <div className="info">
                            <h1>
                                {item.title}
                                <span>{item.artist}</span>
                            </h1>
                            <p className="sup">Per stream: <span><sup>ETH</sup>{item.perToken}</span></p>
                        </div>
                        <img
                            src="/audio/collection.png"
                            alt=""
                            className="play"
                            onClick={addMusic}
                            data-src={JSON.stringify(item)}
                        />
                    </Link>
                ))
                :
                <Spinner />
            }
        </div>
    )
}

export default Like