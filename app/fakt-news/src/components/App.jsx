import React from "react";
import Search from "./Search";
import Left from "./Left";
import Right from "./Right";

function App() {
  return (
    <div className="container">
      <div className="row">
        <Search />
      </div>
      <div className="row">
        <div className="col">
          <Left />
        </div>
        <div className="col">
          <Right />
        </div>
      </div>
    </div>
  );
}

export default App;
