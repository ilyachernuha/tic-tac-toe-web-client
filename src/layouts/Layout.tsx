import { Outlet } from "react-router-dom";

interface Layout {
  serverStatus: boolean;
  onClickServerStatus: () => void;
}

const Layout = ({ serverStatus, onClickServerStatus }: Layout) => {
  return (
    <>
      <div className="section container | server-status">
        <button
          className="button"
          data-type={serverStatus && "primary"}
          onClick={onClickServerStatus}
        >
          Server {serverStatus ? "Online" : "Offline"}
        </button>
      </div>
      <Outlet />;
    </>
  );
};

export default Layout;
