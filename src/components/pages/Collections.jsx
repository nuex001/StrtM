import React, { useEffect } from "react";
import "../../css/collection.css";

import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import Collection from "../layouts/Collection";
import { Route, Routes } from "react-router-dom";
import Like from "../layouts/Like";


function Collections() {


  return (
    <React.Fragment>
      <motion.div
        className="collection"
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ type: "tween", duration: 0.1 }}
      >
        <div className="head">
          <NavLink to="">
          My collections
          </NavLink>
          <NavLink to="likes/">
          Likes
          </NavLink>
        </div>
      <Routes>
      <Route exact path="/" element={<Collection />} />
      <Route exact path="/likes" element={<Like />} />
      </Routes>
      </motion.div>
    </React.Fragment>
  );
}

export default Collections;
