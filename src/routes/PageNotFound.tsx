import { Link } from "react-router-dom";

export const PageNotFound = () => {
  return (
    <div className="section container text-center not-found">
      <h1 className="heading-3">Page Not Found</h1>
      <Link to="/">Go to main</Link>
    </div>
  );
};
