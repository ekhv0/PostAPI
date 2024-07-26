import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOption, setSearchOption] = useState('title');
  const postsPerPage = 12;

  // Referencje do elementów
  const postRefs = useRef([]);

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
    setLoading(true);
    fetchMorePosts();
  };

  const fetchMorePosts = async () => {
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${(posts.length / postsPerPage) + 1}&_limit=${postsPerPage}`);
      const newPosts = await res.json();
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching more posts:', error);
      setLoading(false);
    }
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchOptionChange = (event) => {
    setSearchOption(event.target.value);
  };

  const highlightPost = (post) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    if (searchTerm === '') return false;

    if (searchOption === 'title') {
      return post.title.toLowerCase().includes(lowerCaseSearchTerm);
    } else if (searchOption === 'body') {
      return post.body.toLowerCase().includes(lowerCaseSearchTerm);
    }
    return false;
  };

  useEffect(() => {
    // Scroll to the first matching post
    const scrollToFirstMatch = () => {
      // Wait for DOM updates
      setTimeout(() => {
        // Find the first matching post and scroll to it
        const firstMatchIndex = posts.findIndex(post => highlightPost(post));
        if (firstMatchIndex !== -1 && postRefs.current[firstMatchIndex]) {
          postRefs.current[firstMatchIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100); // Adjust the delay as needed
    };

    scrollToFirstMatch();
  }, [searchTerm, searchOption, posts]);

  return (
    <div className="App">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Wyszukaj..."
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
        <select value={searchOption} onChange={handleSearchOptionChange}>
          <option value="title">Tytuł</option>
          <option value="body">Opis</option>
        </select>
      </div>

      <h1>Posty pobrane z API</h1>
      <div className="posts">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className={`post ${highlightPost(post) ? 'highlight' : ''}`}
            ref={el => postRefs.current[index] = el} // Ustaw referencję dla każdego posta
          >
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
