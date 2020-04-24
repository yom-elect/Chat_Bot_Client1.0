import React, { useState, useEffect, useRef } from "react";
import axios from "../../axios-order";
import { withRouter } from "react-router-dom";

import { v4 as uuid } from "uuid";
import Cookies from "universal-cookie";

import Message from "./Message";
import Cards from "./Cards";
import QuickReplies from "./QuickReplies";

const cookies = new Cookies();

const Chatbot = props => {
  if (cookies.get("userID") === undefined) {
    cookies.set("userID", uuid(), { path: "/" });
  }
  const [messages, setMessages] = useState([]);
  const [showBot, setShowBot] = useState(true);
  const [shopWelcome, setShopWelcome] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const run = async () => {
      df_event_query("Introduction");

      if (window.location.pathname === "/shop" && !shopWelcome) {
        await resolveAfterXSeconds(3);
        df_event_query("WELCOME_SHOP");
        setShopWelcome(true);
      }
      props.history.listen(() => {
        if (props.history.location.pathname === "/shop" && !shopWelcome) {
          df_event_query("WELCOME_SHOP");
          setShopWelcome(true);
        }
      });
    };
    run();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  //pause conversation
  const resolveAfterXSeconds = x => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(x);
      }, x * 1000);
    });
  };
  //toggle bot
  const show = event => {
    event.preventDefault();
    event.stopPropagation();
    setShowBot(true);
  };
  const hideBot = event => {
    event.preventDefault();
    event.stopPropagation();
    setShowBot(false);
  };
  //Quick replies
  const _handleQuickReplyPayload = (event, payload, text) => {
    event.preventDefault();
    event.stopPropagation();
    switch (payload) {
      case "recommended_yes":
        this.df_event_query("SHOW_RECOMMENDATION");
        break;
      default:
        df_text_query(text);
        break;
    }
  };
  const df_text_query = async queryText => {
    let says = {
      speaks: "me",
      msg: {
        text: {
          text: queryText
        }
      }
    };
    messages.push(says);
    setMessages([...messages]);
    const res = await axios.post("/api/df_text_query", {
      text: queryText,
      userID: cookies.get("userID")
    });
    console.log(res);
    for (let msg of res.data.fulfillmentMessages) {
      says = {
        speaks: "bot",
        msg: msg
      };
      messages.push(says);
    }
    setMessages([...messages]);
  };

  const df_event_query = async eventName => {
    const res = await axios.post("/api/df_event_query", {
      event: eventName,
      userID: cookies.get("userID")
    });

    for (let msg of res.data.fulfillmentMessages) {
      let says = {
        speaks: "bot",
        msg: msg
      };
      messages.push(says);
      setMessages([...messages]);
    }
  };

  const renderCards = cards => {
    return cards.map((card, i) => <Cards key={i} payload={card.structValue} />);
  };

  const renderSingleMessage = (message, i) => {
    if (message.msg && message.msg.text && message.msg.text.text) {
      return (
        <Message
          speaks={message.speaks}
          text={message.msg.text.text}
          key={message.speaks + i}
        />
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      // message.msg.payload.fields &&
      message.msg.payload.fields.cards
    ) {
      return (
        <div key={i}>
          <div className="card-panel grey lighten-5 z-depth-1">
            <div style={{ overflow: "hidden" }}>
              <div className="col s2">
                <a
                  href="/"
                  className="btn-floating btn-large waves-effect waves-light red"
                >
                  {message.speaks}
                </a>
              </div>
              <div style={{ overflow: "auto", overflowY: "scroll" }}>
                <div
                  style={{
                    height: 300,
                    width:
                      message.msg.payload.fields.cards.listValue.values.length *
                      270
                  }}
                >
                  {renderCards(
                    message.msg.payload.fields.cards.listValue.values
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.quick_replies
    ) {
      return (
        <QuickReplies
          text={
            message.msg.payload.fields.text
              ? message.msg.payload.fields.text
              : null
          }
          key={i}
          replyClick={_handleQuickReplyPayload}
          speaks={message.speaks}
          payload={message.msg.payload.fields.quick_replies.listValue.values}
        />
      );
    }
  };

  const renderMessages = storedMessages => {
    if (storedMessages) {
      return storedMessages.map((message, i) => {
        return renderSingleMessage(message, i);
      });
    } else {
      return null;
    }
  };
  const _handleInputKeyPress = event => {
    if (event.key === "Enter") {
      df_text_query(event.target.value);
      event.target.value = "";
    }
  };
  if (showBot) {
    return (
      <div
        style={{
          height: 500,
          width: 400,
          position: "absolute",
          bottom: 0,
          right: 0,
          border: "1px solid lightgray"
        }}
      >
        <nav>
          <div style={{ paddingLeft: 5 }} className="nav-wrapper">
            <a href="/" className="brand-logo">
              SoftAI
            </a>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li>
                <a href="/" onClick={hideBot}>
                  Close
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <div
          id="chatbot"
          style={{ height: 388, width: "100%", overflow: "auto" }}
        >
          {renderMessages(messages)}
          <div ref={messagesEndRef} style={{ float: "left", clear: "both" }} />
        </div>
        <div className="col s12">
          <input
            style={{
              margin: 0,
              paddingLeft: "1%",
              paddingRight: "1%",
              width: "98%"
            }}
            placeholder="type a message"
            type="text"
            onKeyPress={_handleInputKeyPress}
            autoFocus={true}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div
        style={{
          minHeight: 40,
          maxHeight: 500,
          width: 400,
          position: "absolute",
          bottom: 0,
          right: 0,
          border: "1px solid lightgray"
        }}
      >
        <nav>
          <div className="nav-wrapper">
            <a href="/" className="brand-logo">
              SoftAI
            </a>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li>
                <a href="/" onClick={show}>
                  Show
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <div ref={messagesEndRef} style={{ float: "left", clear: "both" }} />
      </div>
    );
  }
};

export default withRouter(Chatbot);
