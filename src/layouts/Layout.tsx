import { Outlet } from "react-router-dom";

interface LayoutProps {
  serverStatus: boolean;
}

const Layout = ({ serverStatus }: LayoutProps) => {
  return (
    <>
      <button className="button" data-type={serverStatus ? "primary" : ""}>
        Server {serverStatus ? "online" : "offline"}
      </button>
      <Outlet />
    </>
  );
};

export default Layout;
