import { Link } from "react-router-dom";

interface LoginProps {
  handleLogin: React.FormEventHandler<HTMLFormElement>;
}

export function Login({ handleLogin }: LoginProps) {
  return (
    <div className="section container contact-form">
      <h1 className="heading-3 margin-block-end-5">Login into account</h1>
      <form className="form-group" onSubmit={handleLogin}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          id="username"
          required
        ></input>
        <input
          type="password"
          name="password"
          placeholder="Password"
          id="password"
          required
        ></input>
        <button className="button" data-type="accent" type="submit">
          Login
        </button>
        <Link className="button" to="/register">
          Create an account
        </Link>
      </form>
    </div>
  );
}
