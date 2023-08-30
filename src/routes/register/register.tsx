import { Link } from "react-router-dom";

interface RegisterProps {
  onRegister: React.FormEventHandler<HTMLFormElement>;
}

export function Register({ onRegister }: RegisterProps) {
  return (
    <div className="section container contact-form">
      <h1 className="heading-3 margin-block-end-5">Create an account</h1>
      <form className="form-group" onSubmit={onRegister}>
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
          Register
        </button>
        <Link className="button" to="/login">
          Login to an account
        </Link>
      </form>
    </div>
  );
}
