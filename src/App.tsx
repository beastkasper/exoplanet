import { Outlet } from "react-router-dom";
import PageTransition from "./components/PageTransition";

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <PageTransition>
        <Outlet />
      </PageTransition>
    </div>
  );
}
