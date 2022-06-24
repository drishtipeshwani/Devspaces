import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import HomeScreen from './pages/HomeScreen';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
    <div className="App">
     <BrowserRouter>
     <Routes>
      <Route path="/" element={<HomeScreen/>} />
      <Route path="/dashboard/:roomId" element={<Dashboard/>} />
      <Route path = '/login' element = {<Login/>} />
      </Routes>
     </BrowserRouter>
    </div>
    </ChakraProvider>
  );
}

export default App;
