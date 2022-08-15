import React, { useEffect, useState } from "react";
import "./App.css";

import { Amplify, DataStore, Predicates } from "aws-amplify";
import { Post, PostStatus } from "./models";

//Use next two lines only if syncing with the cloud
import awsconfig from "./aws-exports";
Amplify.configure(awsconfig);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function onCreate() {
  DataStore.save(
    new Post({
      title: `New title ${Date.now()}`,
      rating: getRandomInt(1, 7),
      status: PostStatus.ACTIVE,
    })
  );
}

function onDelete(id) {
  DataStore.delete(Post, id);
}

function onDeleteAll() {
  DataStore.delete(Post, Predicates.ALL);
}

async function onQuery(setPosts) {
  const posts = await DataStore.query(Post, (c) => c.rating("gt", 4));

  setPosts(posts)
}

async function onUpdate(currentItem) {
  await DataStore.save(Post.copyOf(currentItem, item => {
    item.title = `Updated title ${Date.now()}`
    item.rating = getRandomInt(1, 7)
  }));
}

function App() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const subscription = DataStore.observeQuery(Post).subscribe((snapshot) => {
      setPosts(snapshot.items)
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="App">
        <div style={{"marginTop": "50px"}}>
          <button onClick={onCreate}>New Record</button>
          <button onClick={onDeleteAll}>Delete All</button>
          <button onClick={() => onQuery(setPosts)}>QUERY rating greater than 4</button>
        </div>

        <table style={{"width": "80%", "marginTop": "50px"}}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Rating</th>
              <th>Content</th>
            </tr>
          </thead>
          <tbody>
        {posts.map((post) => (
          <tr key={post.id}>
            <td>{post.id}</td>
            <td>{post.title}</td>
            <td>{post.rating}</td>
            <td>{post.content}</td>
            <td>
              <button onClick={() => onUpdate(post)}>Update Title and Rating</button>
              <button onClick={() => onDelete(post.id)}>Delete Item</button>
            </td>
          </tr>
          ))}
          </tbody>
        </table>
    </div>
  );
}

export default App;
