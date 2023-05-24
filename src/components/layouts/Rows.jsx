import React, { useState } from 'react'
import Row from './Row'

function Rows() {
    const [cats, setCats] = useState([
        "New Release",
        "Jazz",
        "Hippop",
        "Amphiano",
        "Gospel"
    ])
    return (
        <>
            {
                cats.map((cat,idx) => (
                    <Row cat={cat} key={idx} />
                ))
            }
        </>
    )
}

export default Rows