interface RegisterProps {
  handleRegister: React.FormEventHandler<HTMLFormElement>;
}

export function Register({ handleRegister }: RegisterProps) {
  return (
    <div className="section container contact-form">
      <h1 className="heading-3 margin-block-end-5">Create an account</h1>
      <form className="form-group" onSubmit={handleRegister}>
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
        <a className="button" href="/">
          Login
        </a>
      </form>
    </div>
  );
}
