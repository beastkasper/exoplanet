import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Outlet />
    </div>
  );
}
