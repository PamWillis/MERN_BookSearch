import './App.css';
import { Outlet } from 'react-router-dom';
import {



} from 'apollo/client'

import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;
