import "./css/sideBar.scss"

interface SideBarProps {
  children?: React.ReactNode;
  className?: string;
  logoutfn?: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ className, children, logoutfn }) => {

  return (
    <div className={`container-aside ${className}`} id="container-aside">
      <div className="sidebar">
        {children}
        <div className="salirBtn">
          <button onClick={logoutfn}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
