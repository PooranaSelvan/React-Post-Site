import classes from './Post.module.css';

function Post({ id, author, body, onPostDelete, onPostUpdate }) {

  return (
    <li id={id} className={classes.post}>
      <p className={classes.author}>{author}</p>
      <p className={classes.text}>{body}</p>
      <div className={classes.postActions}>
        <button onClick={() => onPostUpdate(id)}>Update</button>
        <button onClick={() => onPostDelete(id)}>Delete</button>
      </div>
    </li>
  );
}

export default Post;