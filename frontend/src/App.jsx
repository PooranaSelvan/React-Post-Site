import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Postlist from './components/Postlist';
import MainHeader from './components/MainHeader';

function App() {
  const [modalIsVisible, setModalIsVisible] = useState(false);

  function showModalHandler() {
    setModalIsVisible(true);
  }

  function hideModalHandler() {
    setModalIsVisible(false);
  }

  return (
    <>
      <MainHeader onCreatePost={showModalHandler} />
      <main>
        <Postlist
          isPosting={modalIsVisible}
          onStopPosting={hideModalHandler}
        />
      </main>
      <Toaster />
    </>
  );
}

export default App;