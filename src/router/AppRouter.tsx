import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ExoplanetMap from "../pages/ExoplanetMap";
import Fragment from "../pages/Fragment";
import NoobMode from "../pages/NoobMode";
import ProMode from "../pages/ProMode";
import Compete from "../pages/Compete";
import EducationalMode from "../pages/EducationalMode";
import EducationalLayout from "../components/EducationalLayout";
import NASAEyesExoplanets from "../pages/NASAEyesExoplanets";
import SpaceVisualization from "../pages/SpaceVisualization";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Fragment /> },
      { path: "map", element: <ExoplanetMap /> },
      { path: "fragment", element: <Fragment /> },
      { path: "noob", element: <NoobMode /> },
      {
        path: "educational",
        element: <EducationalLayout />,
        children: [
          { index: true, element: <EducationalMode /> },
        ],
      },
      { path: "pro", element: <ProMode /> },
      { path: "compete", element: <Compete /> },
      { path: "nasa-eyes", element: <NASAEyesExoplanets /> },
      { path: "space-viz", element: <SpaceVisualization /> },
    ],
  },
]);

