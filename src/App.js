import logo from "./logo.svg";
import "./App.css";
import { useEffect } from "react";
import { connectNatsWebSocket } from "./services/nats.service";

function App() {
  useEffect(() => {
    const ns = connectNatsWebSocket();
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>NATS Client Demo!!</p>
      </header>
    </div>
  );
}

export default App;
