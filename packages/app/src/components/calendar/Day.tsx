import { Rect, Text } from "react-konva";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { memo } from "react";

const Day = memo(function Day({
  x,
  y,
  w,
  h,
  day,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  day: Dayjs;
}) {
  const isCurrentMonth = day.isSame(dayjs(), "month");
  const isToday = day.isSame(dayjs(), "day");
  
  return (
    <>
      <Rect
        x={x}
        y={y}
        width={w}
        height={h}
        stroke={isToday ? "#3b82f6" : "#e5e7eb"}
        strokeWidth={isToday ? 2 : 1}
        cornerRadius={4}
        fill={isToday ? "#dbeafe" : "transparent"}
      />
      <Text 
        x={x + w / 2} 
        y={y + h / 2} 
        text={day.format("D")} 
        fontSize={12}
        align="center"
        verticalAlign="middle"
        fill={isCurrentMonth ? "#1f2937" : "#9ca3af"}
      />
    </>
  );
});

export default Day;
