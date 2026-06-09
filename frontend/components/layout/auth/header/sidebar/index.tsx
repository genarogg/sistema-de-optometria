import "./css/sideBar.scss"
import { useAuthStore } from "@/context/auth/AuthContext";
interface SideBarProps {
  children?: React.ReactNode;
  className?: string;
  logoutfn?: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ className, children, logoutfn }) => {
  const { isAuthenticated } = useAuthStore((state) => state);
  return (
    <div className={`container-aside ${className}`} id="container-aside">
      <div className="sidebar">
        {children}

        {isAuthenticated && (
          <div className="salirBtn">
            <button onClick={logoutfn}>
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
