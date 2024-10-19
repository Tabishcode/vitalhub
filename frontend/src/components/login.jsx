import React from 'react'

const login = () => {
  return (
    <div className="login">
      <h4>Login page is here</h4>
      <form>
        <div className="text_area">
          <input
            type="text"
            id="username"
            name="username"
            // defaultValue="username"
            className="text_input"
            placeholder="Your Username"
          />
        </div>
        <div className="text_area">
          <input
            type="password"
            id="password"
            name="password"
            // defaultValue="password"
            className="text_input"
            placeholder="Your Password"
          />
        </div>
        <input type="submit" value="LOGIN" className="btn" />
      </form>
      <a className="link" href="/signup">
        Sign Up
      </a>
    </div>
  );
}

export default login