import './App.css';
import Navbar from './components/navbar';
import Heropage from './components/heropage';
import Display from './components/display';
import Footer from './components/footer';
function App() {
  return (
    <div className="App">
    <Navbar/>
    <Heropage/>
    <Display/>
    <Footer/>
    </div>
  );
}

export default App;
