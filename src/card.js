import React from "react";
import classnames from "classnames";
import digivice from "./images/Digivice.jpg";
import "./card.scss";

const Card = ({ onClick, card, index, isCoverFace, isFrontFace, isDisabled }) => {
  const handleClick = () => {
    !isFrontFace && !isDisabled && onClick(index);
  };

  return (
    <div
      className={classnames("card", {
        "is-FrontFace": isFrontFace,
        "is-CoverFace": isCoverFace
      })}
      onClick={handleClick}
    >
      <div className="card-face card-front-face">
        <img src={digivice} alt="digivice" />
      </div>
      <div className="card-face card-back-face">
        <img src={card.image} alt="digivice" />
      </div>
    </div>
  );
};

export default Card;
