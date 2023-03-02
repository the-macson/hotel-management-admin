import './App.css';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashbored from './components/Home/Dashbored';
import BookRoom from './components/BookRoom/BookRoom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UpdateRoom from './components/UpdateRoom/UpdateRoom';
function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Dashbored />} />
          <Route path='/book-room' element={<BookRoom/>} />
          <Route path='/:id' element={<UpdateRoom />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
