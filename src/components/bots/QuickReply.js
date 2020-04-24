import React from "react";

const QuickReply = props => {
  if (props.reply.structValue.fields.payload) {
    return (
      <div>
        <a
          style={{ margin: 3 }}
          href="/"
          className="col btn-floating btn-large waves-effect waves-light blue"
          onClick={event =>
            props.click(
              event,
              props.reply.structValue.fields.payload.stringValue,
              props.reply.structValue.fields.text.stringValue
            )
          }
        >
          {props.reply.structValue.fields.text.stringValue}
        </a>
      </div>
    );
  } else {
    return (
      <div>
        <a
          style={{ margin: 3 }}
          href={props.reply.structValue.fields.link.stringValue}
          className="btn-floating btn-large waves-effect waves-light red"
        >
          {props.reply.structValue.fields.text.stringValue}
        </a>
      </div>
    );
  }
};

export default QuickReply;
