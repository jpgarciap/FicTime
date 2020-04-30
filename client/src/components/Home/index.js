import React, { useContext } from 'react';
import { AuthContext } from '../Firebase/context';
import Welcome from './Welcome';
import RegistTime from './RegistTime';

function Home() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div>
      { currentUser ? 
        <RegistTime email={currentUser.email} /> 
      :  <Welcome/> }
    </div>
  );
}

export default Home;
