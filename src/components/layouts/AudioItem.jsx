import React from 'react'
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { numRound } from "../../utils/uils"

function AudioItem({ item }) {
    return (
        <Link to={`/playlist/${item._id}`} >
            <img src={item.coverdp} alt="" />
            <div className="txt">
                <h6>{item.title}</h6>
                <p>{item.artist}</p>
                <p className='suscribe'>
                    {numRound(item.streams.length)}
                    <FaUserCircle className="user" />
                    <FaUserCircle className="user" />
                    <FaUserCircle className="user" />
                </p>
                <p style={{ display: "flex" }}>Balance: <span><sup>ETH</sup>{item.balance}</span></p>
                <p style={{ display: "flex" }}>Per stream:<span><sup>ETH</sup>{item.perToken}</span></p>
            </div>
        </Link>
    )
}

export default AudioItem