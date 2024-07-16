import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const initialRes = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=1&_limit=${postsPerPage * 2}`);
        const initialPosts = await initialRes.json();
        setPosts(initialPosts.slice(0, postsPerPage));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching initial posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const loadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  useEffect(() => {
    const fetchMorePosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=${postsPerPage}`);
        const newPosts = await res.json();
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching more posts:', error);
        setLoading(false);
      }
    };

    if (currentPage > 1) {
      fetchMorePosts();
    }
  }, [currentPage]);

  return (
    <div className="App">
      <h1>Posty pobrane z API</h1>
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
          <button onClick={loadMore}>Wczytaj więcej postów!</button>
        )}
      </div>
    </div>
  );
}

export default App;
