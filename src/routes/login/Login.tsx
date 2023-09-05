import { useAuth } from "../../hooks/useAuth";

export const LoginForm = () => {
  const { onLogin, onRegister, onFormChange, error, loginPushed } = useAuth();
  return (
    <div className="section container login-form">
      <h1 className="heading-3 margin-block-end-5 text-center">
        Log into account
      </h1>
      <form className="form-group" onSubmit={onLogin} onChange={onFormChange}>
        <p className="form-error text-center">{error}</p>
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
        <button
          className="button"
          data-type={loginPushed ? "accent-pushed" : "accent"}
          type="submit"
          onClick={onLogin}
        >
          Login
        </button>
        <button className="button" data-type="secondary" onClick={onRegister}>
          Create an account
        </button>
      </form>
    </div>
  );
};
