import React from 'react'
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    setMusic
} from "../../redux/audio";

function Collection() {
    const dispatch = useDispatch();

    let cartItems = localStorage.getItem("musicsInCart"); //getting the cart Item
    cartItems = JSON.parse(cartItems); //parsing it
    const addMusic = (e) => {
        e.preventDefault();
        const src = JSON.parse(e.target.getAttribute("data-src"));
        dispatch(setMusic(src));
    };
    return (
        <div className="box">
            {cartItems &&
                Object.values(cartItems).map((item) => (
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
                ))}
        </div>
    )
}

export default Collection