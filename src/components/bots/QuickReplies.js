import React from "react";
import QuickReply from "./QuickReply";

const QuickReplies = props => {
  const _handleClick = (event, payload, text) => {
    props.replyClick(event, payload, text);
  };

  const renderQuickReply = (reply, i) => {
    return <QuickReply key={i} click={_handleClick} reply={reply} />;
  };
  const renderQuickReplies = quickReplies => {
    if (quickReplies) {
      return quickReplies.map((reply, i) => {
        return renderQuickReply(reply, i);
      });
    }
  };
  return (
    <div className="col s12 m8 offset-m2 l6 offset-l3">
      <div className="card-panel grey lighten-5 z-depth-1">
        <div className="row valign-wrapper">
          <div className="col s2">
            <a
              href="/"
              className="btn-floating btn-large waves-effect waves-light red"
            >
              {props.speaks}
            </a>
          </div>
          <div id="quick-replies" className="col s10 ">
            {props.text && <p>{props.text.stringValue}</p>}
            {renderQuickReplies(props.payload)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickReplies;
