import React, { useState, useEffect } from "react";
import send from "./assests/send.svg";
import user from "./assests/user.png";
import loadingIcon from "./assests/loader.svg";
import bot from "./assests/bot.png";
import axios from 'axios'


// let arr = [
//     {
//         type : "user", post: "fsafafaafaf"
//     },
//     {
//         type : "bot", post : "fafafafafaf"
//     }
// ]

const App = () => {
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect = (() =>{
    document.querySelector('.layout').scrollTop = document.querySelector('.layout').scrollHeight;
  },[posts]) 

  const fetchBotResponse = async () => {
    const {data} = await axios.post("http://localhost:4000", {input}, {
      headers: {
        "Content-Type": "application/json",
      }
    }) 
    return data;
  }

  const onSubmit = () => {
    if (input.trim() === "") return;
    updatePosts(input);
    updatePosts("Loading...", false, true);
    setInput("")
    fetchBotResponse().then((res)=>{
      console.log(res);
      updatePosts(res.bot.trim(), true);
    });
  }

  const autoTypingBotResponse = (text) => {
    let index = 0;
    let interval = setInterval(()=> {
      if(index < text.length) {
        setPosts((prevState)=>{
          let lastItem = prevState.pop();
          if(lastItem.type !== "bot"){
            prevState.push({
              type: "bot",
              post: text.charAt(index-1)
            })
          } else {
            prevState.push({
              type: "bot",
              post: lastItem.post + text.charAt(index-1)
            })
          }
          return [...prevState]
        })
        index++;
      }else{
        clearInterval(interval);
      }
    }, 30)
  }

  const updatePosts = (post, isBot, isLoading) => {
    if(isBot) {
      autoTypingBotResponse(post)
    }else{ 
      setPosts(prevState => {
          return [
              ...prevState, 
              {type: isLoading ? "loading" : "user", post}
          ]
      })
    }
  }

  const onKeyUp = (e) => {
    if (e.key === "Enter" || e.which === 13){
        onSubmit()
    }
  }


  return (
    <main className="chatGPT-app">
      <section className="chat-container">
                <div className="layout">
                    {posts.map((post, index) => (
                        <div
                            key={index}
                            className={`chat-bubble ${
                                post.type === "bot" || post.type === "loading"
                                    ? "bot"
                                    : ""
                            }`}
                        >
                            <div className="avatar">
                                <img
                                    src={
                                        post.type === "bot" ||
                                        post.type === "loading"
                                            ? bot
                                            : user
                                    }
                                />
                            </div>
                            {post.type === "loading" ? (
                                <div className="loader">
                                    <img src={loadingIcon} />
                                </div>
                            ) : (
                                <div className="post">{post.post}</div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
      <footer>
        <input
          className="composebar"
          value={input}
          autoFocus
          type="text"
          placeholder="Ask Anything!"
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={onKeyUp}
        />
        <div className="send-button" onClick={onSubmit}>
          <img src={send} alt="" />
        </div>
      </footer>
    </main>
  );
};

export default App;
