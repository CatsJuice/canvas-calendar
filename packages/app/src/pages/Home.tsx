import { CanvasCalendar } from "../components";

export default function Home() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full h-full max-w-[360px] max-h-[640px]">
        <CanvasCalendar />
      </div>
    </div>
  );
}
