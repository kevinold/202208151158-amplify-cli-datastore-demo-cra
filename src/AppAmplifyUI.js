import { Button, Flex, Table, TableBody, TableCell, TableHead, TableRow, View } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css';
import React, { useEffect, useState } from "react";
import "./App.css";

import { Amplify, DataStore, Predicates } from "aws-amplify";
import { Post, PostStatus } from "./models";

//Use next two lines only if syncing wiTableCell TableCelle cloud
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
    <View padding="1rem">
    <Flex direction="column">
        <Flex>
          <Button onClick={onCreate}>New Record</Button>
          <Button onClick={onDeleteAll}>Delete All</Button>
          <Button onClick={() => onQuery(setPosts)}>QUERY rating &#62; 4</Button>
        </Flex>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Content</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>{post.title}</TableCell>
            <TableCell>{post.rating}</TableCell>
            <TableCell>{post.content}</TableCell>
            <TableCell>
              <Button onClick={() => onUpdate(post)}>Update Title and Rating</Button>
              <Button onClick={() => onDelete(post.id)}>Delete Item</Button>
            </TableCell>
          </TableRow>
          ))}
          </TableBody>
        </Table>
    </Flex>
    </View>
  );
}

export default App;
