import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import Post from './Post';
import NewPost from './NewPost';
import Modal from './Modal';
import classes from './Postlist.module.css';
import UpdateModel from './UpdateModel';

function Postlist({ isPosting, onStopPosting }) {
  const [posts, setPosts] = useState([]);
  const [isPostUpdating, setPostToUpdate] = useState(false);
  const post = useRef();

  const baseUrl = import.meta.env.VITE_STATUS === "production" ? import.meta.env.VITE_URL_PROD : import.meta.env.VITE_URL_LOCAL

  useEffect(() => {
    async function fetchPosts() {
      const response = await fetch(`${baseUrl}/posts`);
      const resData = await response.json();

      // console.log(resData);

      setPosts(resData.posts);
    }

    fetchPosts();
  }, []);

  async function addPostHandler(postData) {
    let res = await fetch(`${baseUrl}/posts`, {
      method: 'POST',
      body: JSON.stringify(postData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      toast.error("Error Adding Post!");
      console.log(res);
      return;
    };

    let newPost = await res.json();
    setPosts((existingPosts) => [newPost.post, ...existingPosts]);

    toast.success(newPost.message);
  }


  async function onPostDelete(id) {
    // console.log(id);

    let res = await fetch(`${baseUrl}/delete-post`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId: id
      })
    });

    if (!res.ok) {
      toast.error("Error Deleting Post!");
      console.log(res);
      return;
    }

    let data = await res.json();

    setPosts((prevPosts) => prevPosts.filter(post => post.id !== id));
    toast.success(data.message);
  }


  async function openPostModal(id) {
    // console.log(id);

    let res = await fetch(`${baseUrl}/posts/${id}`);

    if (!res.ok) {
      console.log("Error Getting By Id : ", res);
      return;
    }

    let data = await res.json();
    post.current = data;
    setPostToUpdate(true);
  }

  async function onPostUpdate(updatedPost) {
    // console.log(updatedPost);

    let res = await fetch(`${baseUrl}/update-post`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId: updatedPost.id,
        body: updatedPost.body,
        author: updatedPost.author
      })
    });

    if (!res.ok) {
      toast.error("Error Updating Post!");
      console.log(res);
      return;
    }

    let data = await res.json();

    toast.success(data.message);

    setPosts((ele) => ele.map(post => post.id === data.post.id ? data.post : post));
    setPostToUpdate(false);
  }

  return (
    <>
      {isPosting && (
        <Modal>
          <NewPost onCancel={onStopPosting} onAddPost={addPostHandler} />
        </Modal>
      )}

      {isPostUpdating && (
        <Modal>
          <UpdateModel
            post={post.current}
            onCancel={() => setPostToUpdate(false)}
            onSubmit={onPostUpdate}
          />
        </Modal>
      )}

      {posts.length > 0 && (
        <ul className={classes.posts}>
          {posts.map((post) => (
            <Post id={post.id} key={post.id} author={post.author} body={post.body} onPostDelete={onPostDelete} onPostUpdate={openPostModal} />
          ))}
        </ul>
      )}

      {posts.length === 0 && (
        <div style={{ textAlign: 'center', color: 'white' }}>
          <h2>There are no posts yet.</h2>
          <p>Start adding some!</p>
        </div>
      )}
    </>
  );
}

export default Postlist;