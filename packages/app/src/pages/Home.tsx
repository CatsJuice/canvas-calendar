import { CanvasCalendar } from "../components";
import "./Home.css";

export default function Home() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="calendar-frame w-full h-full">
        <CanvasCalendar />
      </div>
    </div>
  );
}
