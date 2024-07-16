import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const initialRes = await axios.get(`https://jsonplaceholder.typicode.com/posts?_page=1&_limit=${postsPerPage * 2}`);
      const initialPosts = initialRes.data.slice(0, postsPerPage);
      setPosts(initialPosts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const loadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  useEffect(() => {
    const fetchMorePosts = async () => {
      setLoading(true);
      const res = await axios.get(`https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=${postsPerPage}`);
      setPosts(prevPosts => [...prevPosts, ...res.data]);
      setLoading(false);
    };

    if (currentPage > 1) {
      fetchMorePosts();
    }
  }, [currentPage]);

  return (
    <div className="App">
      <h1>Posty pobierane z API</h1>
      <div className="posts">
        {posts.map(post => (
          <div key={post.id} className="post">
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </div>
        ))}
      </div>
      <div className="load-more">
        {loading ? (
          <p>Ładowanie...</p>
        ) : (
          <button onClick={loadMore}>Załaduj więcej</button>
        )}
      </div>
    </div>
  );
}

export default App;
