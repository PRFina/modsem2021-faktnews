import React from "react";

class Left extends React.Component {
  render() {
    return (
      <div class="row align-items-start">
        <div class="card" style={{ width: "18rem" }}>
          <img
            src="https://lh3.googleusercontent.com/proxy/kYu6ahWq2poqPi7cQ6smQA8RXHCxXQdgKyuTlEYetekTcNFhF5p5YRSX2FZmjOikgNtpKBJVAJc5h7cHZPaWjsG0jYx2-j_qSaR85yF6iObVuSck6mGx9y6igsRvkJOF71cn0CJP1IsWZDySqMWb"
            class="card-img-top"
            alt="..."
          />
          <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </p>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Cras justo odio</li>
            <li class="list-group-item">Dapibus ac facilisis in</li>
            <li class="list-group-item">Vestibulum at eros</li>
          </ul>
          <div class="card-body">
            <a href="#test" class="card-link">
              Card link
            </a>
            <a href="#test1" class="card-link">
              Another link
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Left;
