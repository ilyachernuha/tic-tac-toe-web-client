import { useAuth } from "../../hooks/useAuth";

export const LoginForm = () => {
  const { onLogin, onRegister, onFormChange, error } = useAuth();
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
          minLength={2}
          maxLength={16}
          pattern="^[a-zA-Z0-9]*$"
          required
        ></input>
        <input
          type="password"
          name="password"
          placeholder="Password"
          id="password"
          minLength={8}
          maxLength={32}
          pattern="^[!-~]*$"
          required
        ></input>
        <button
          className="button"
          data-type="accent"
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
