import React from "react";

const Cards = props => {
  return (
    <div style={{ width: 270, paddingRight: 30, float: "left" }}>
      <div className="card">
        <div className="card-image" style={{ width: 240 }}>
          <img
            alt={props.payload.fields.header.stringValue}
            src={props.payload.fields.image.stringValue}
          />
          <span className="card-title">
            {props.payload.fields.header.stringValue}
          </span>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={props.payload.fields.link.stringValue}
            className="btn-floating halfway-fab waves-effect waves-light red"
          >
            <i className="material-icons">@</i>
          </a>
        </div>
        <div className="card-content">
          <p>{props.payload.fields.description.stringValue}</p>
        </div>
      </div>
    </div>
  );
};

export default Cards;
