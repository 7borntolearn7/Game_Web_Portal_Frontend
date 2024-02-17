import React from "react";

function Card({ post }) {
  return (
    <div className="flex flex-col gap-y-1 w-[200px]">
      <img
        src={post.img}
        style={{
          width: "200px",
          height: "123px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      ></img>
      <div>{post.description}</div>
    </div>
  );
}

export default Card;
