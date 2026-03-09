import React, { useState } from 'react';
import classes from "./NewPost.module.css";

const UpdateModel = ({post, onCancel, onSubmit }) => {
     const [enteredBody, setEnteredBody] = useState(post.body);
     const [enteredAuthor, setEnteredAuthor] = useState(post.author);

     function submitHandler(e) {
          e.preventDefault();
          onSubmit({...post, body: enteredBody, author: enteredAuthor });
     }

     return (
          <form className={classes.form} onSubmit={submitHandler}>
               <p>
                    <label htmlFor="body">Text</label>
                    <textarea
                         id="body"
                         required
                         rows={3}
                         onChange={(e) => setEnteredBody(e.target.value)}
                         value={enteredBody}
                    />
               </p>
               <p>
                    <label htmlFor="name">Your name</label>
                    <input
                         type="text"
                         id="name"
                         required
                         onChange={(e) => setEnteredAuthor(e.target.value)}
                         value={enteredAuthor}
                    />
               </p>
               <p className={classes.actions}>
                    <button type="button" onClick={onCancel}>
                         Cancel
                    </button>
                    <button type="submit">Submit</button>
               </p>
          </form>
     );
};

export default UpdateModel;
