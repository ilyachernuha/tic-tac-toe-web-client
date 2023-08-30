interface RootProps {
  handleLogin: React.FormEventHandler<HTMLFormElement>;
}

export function Root({ handleLogin }: RootProps) {
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
        <a className="button" href="/register">
          Create an account
        </a>
      </form>
    </div>
  );
}
