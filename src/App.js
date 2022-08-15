import React, { useEffect } from "react";
import "./App.css";
import logo from "./logo.svg";

import { Amplify, DataStore, Predicates } from "aws-amplify";
import { Post, PostStatus } from "./models";

//Use next two lines only if syncing with the cloud
import awsconfig from "./aws-exports";
Amplify.configure(awsconfig);

function onCreate() {
  console.log('onCreate')
  DataStore.save(
    new Post({
      title: `New title ${Date.now()}`,
      rating: (function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
      })(1, 7),
      status: PostStatus.ACTIVE,
    })
  );
}

function onDeleteAll() {
  console.log('onDeleteAll')
  DataStore.delete(Post, Predicates.ALL);
}

async function onQuery() {
  console.log('onQuery')
  const posts = await DataStore.query(Post, (c) => c.rating("gt", 4));

  console.log(posts);
}

function App() {
  useEffect(() => {
    const subscription = DataStore.observeQuery(Post).subscribe((msg) => {
      console.log(msg);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <input type="button" value="NEW" onClick={onCreate} />
          <input type="button" value="DELETE ALL" onClick={onDeleteAll} />
          <input type="button" value="QUERY rating > 4" onClick={onQuery} />
        </div>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
