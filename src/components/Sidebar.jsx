import { NavLink, Outlet } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          SLT<span>-IDP</span> Developer
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            My Apps
          </NavLink>
          <NavLink to="/create" className={({ isActive }) => (isActive ? 'active' : '')}>
            + Register New App
          </NavLink>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
