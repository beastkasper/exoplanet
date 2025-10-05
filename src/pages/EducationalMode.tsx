import { useEducationalContext } from "../contexts/EducationalContext";
import LearnSection from "./EducationalMode/LearnSection";
import PrepareSection from "./EducationalMode/PrepareSection";
import SimulatorSection from "./EducationalMode/SimulatorSection";
import AboutSection from "./EducationalMode/AboutSection";

export default function EducationalMode() {
  const { activeSection } = useEducationalContext();

  const renderContent = () => {
    switch (activeSection) {
      case "learn":
        return <LearnSection />;
      case "predict":
        return <PrepareSection />;
      case "simulator":
        return <SimulatorSection />;
      case "about":
        return <AboutSection />;
      default:
        return <LearnSection />;
    }
  };

  return renderContent();
}