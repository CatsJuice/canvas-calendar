import { useEffect, useRef, useCallback } from "react";
import Konva from "konva";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import {
  getMonthDays,
  getMonthRowCount,
  computeDayX,
  computeDayY,
  computeDayWidth,
} from "./core";
import {
  DAY_GAP_X,
  DAY_GAP_Y,
  DAY_HEIGHT,
  PADDING_X,
  MONTH_GAP_Y,
  MONTH_LABEL_HEIGHT,
  DIVIDER_COLOR,
  DIVIDER_WIDTH,
  MONTH_TEXT_COLOR,
  DAY_ACTIVE_BG,
  DAY_ACTIVE_TEXT_COLOR,
  DAY_TEXT_COLOR,
  MONTH_LABEL_PADDING_TOP,
  VIEWPORT_PADDING_TOP,
  PRELOAD_HEIGHT,
} from "./store";
import { AutoScroller } from "./AutoScroller";
import { useTheme } from "../../hooks/use-theme";
import { getThemedColor } from "./utils/themed-color";
import "./CanvasCalendar.css";
import { observeResize } from "../../utils/observe-resize";

dayjs.extend(weekOfYear);

const BASE_MONTH = dayjs("1900-01-01");
const INIT_MONTHS = 200;

export default function CanvasCalendar({
  initialDate = dayjs().format("YYYY-MM-DD"),
}: {
  initialDate?: string | number;
}) {
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const layerRef = useRef<Konva.Layer | null>(null);
  const scrollYRef = useRef(0);
  const widthRef = useRef(0);
  const heightRef = useRef(0);
  const monthsRef = useRef<dayjs.Dayjs[]>([]);
  const monthAccHeightsRef = useRef<number[]>([]);
  const currentElRef = useRef<HTMLDivElement>(null);
  const hoverElRef = useRef<HTMLDivElement>(null);

  const updateScrollY = useCallback((y: number) => {
    scrollYRef.current = Math.max(0, y);
    const hoverEl = hoverElRef.current;
    if (hoverEl) {
      delete hoverEl.dataset.show;
    }
  }, []);

  // renderer
  const drawCalendar = useCallback(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.destroyChildren();
    const width = widthRef.current;
    const height = heightRef.current;
    const scrollY = scrollYRef.current - VIEWPORT_PADDING_TOP;
    // calculate visible range
    let startIdx = 0;
    let endIdx = monthsRef.current.length - 1;
    for (let i = 0; i < monthsRef.current.length; i++) {
      if (monthAccHeightsRef.current[i + 1] > scrollY - PRELOAD_HEIGHT) {
        startIdx = i;
        break;
      }
    }
    for (let i = startIdx; i < monthsRef.current.length; i++) {
      if (monthAccHeightsRef.current[i] > scrollY + height + PRELOAD_HEIGHT) {
        endIdx = i;
        break;
      }
    }
    // extend cache
    if (endIdx >= monthsRef.current.length - 2) {
      let acc =
        monthAccHeightsRef.current[monthAccHeightsRef.current.length - 1];
      let month = monthsRef.current[monthsRef.current.length - 1];
      for (let i = 0; i < 50; i++) {
        month = month.add(1, "month");
        monthsRef.current.push(month);
        const rowCount = getMonthRowCount(month);
        const h =
          MONTH_LABEL_HEIGHT +
          rowCount * DAY_HEIGHT +
          (rowCount - 1) * DAY_GAP_Y +
          MONTH_GAP_Y;
        acc += h;
        monthAccHeightsRef.current.push(acc);
      }
    }
    // calculate day width
    const dayWidth = computeDayWidth(width, PADDING_X, DAY_GAP_X);
    // render visible range
    for (let idx = startIdx; idx <= endIdx; idx++) {
      const month = monthsRef.current[idx];
      const monthStartY = monthAccHeightsRef.current[idx] - scrollY;
      const monthEndY =
        monthStartY +
        (monthAccHeightsRef.current[idx + 1] - monthAccHeightsRef.current[idx]);
      if (monthEndY < 0 || monthStartY > height) continue;
      // Month label
      const firstDayOfMonthIndexInWeek = month.startOf("month").day();
      const monthLabel = new Konva.Text({
        x:
          PADDING_X +
          firstDayOfMonthIndexInWeek * (dayWidth + DAY_GAP_X) +
          dayWidth / 2,
        y: monthStartY + MONTH_LABEL_PADDING_TOP + MONTH_LABEL_HEIGHT / 2,
        text: month.format("MMM"),
        fontSize: 20,
        fontStyle: "bold",
        fill: getThemedColor(MONTH_TEXT_COLOR, isDark),
      });
      monthLabel.offsetX(monthLabel.width() / 2);
      monthLabel.offsetY(monthLabel.height() / 2);
      layer.add(monthLabel);
      // days
      const days = getMonthDays(month);
      // week dividers
      const weekMap = new Map<number, dayjs.Dayjs[]>();
      for (const day of days) {
        const week = day.week();
        if (!weekMap.has(week)) weekMap.set(week, []);
        const arr = weekMap.get(week);
        if (arr) arr.push(day);
      }
      for (const weekDays of weekMap.values()) {
        const firstDay = weekDays[0];
        const lastDay = weekDays[weekDays.length - 1];
        const x1 =
          firstDay.day() === 0
            ? 0
            : computeDayX(firstDay, PADDING_X, DAY_GAP_X, dayWidth);
        const x2 =
          lastDay.day() === 6
            ? width
            : computeDayX(lastDay, PADDING_X, DAY_GAP_X, dayWidth) + dayWidth;
        const y =
          computeDayY(
            firstDay,
            month,
            monthStartY + MONTH_LABEL_HEIGHT,
            DAY_HEIGHT,
            DAY_GAP_Y
          ) -
          DAY_GAP_Y / 2;
        layer.add(
          new Konva.Line({
            points: [x1, y, x2, y],
            stroke: getThemedColor(DIVIDER_COLOR, isDark),
            strokeWidth: DIVIDER_WIDTH,
          })
        );
      }
      for (const day of days) {
        const isToday = day.isSame(dayjs(), "day");
        const x = computeDayX(day, PADDING_X, DAY_GAP_X, dayWidth);
        const y = computeDayY(
          day,
          month,
          monthStartY + MONTH_LABEL_HEIGHT,
          DAY_HEIGHT,
          DAY_GAP_Y
        );
        if (y + DAY_HEIGHT < 0 || y > height) continue;
        // day rect
        const dayRect = new Konva.Rect({
          x: x + dayWidth / 2 - DAY_HEIGHT / 2,
          y,
          width: DAY_HEIGHT,
          height: DAY_HEIGHT,
          cornerRadius: DAY_HEIGHT / 2,
          fill: isToday ? getThemedColor(DAY_ACTIVE_BG, isDark) : "transparent",
        });
        layer.add(dayRect);
        dayRect.on("mouseenter", (e) => {
          const hoverEl = hoverElRef.current;
          const target = e.target;
          if (!hoverEl) return;
          hoverEl.dataset.show = "";
          hoverEl.style.left = `${target.x()}px`;
          hoverEl.style.top = `${target.y()}px`;
          hoverEl.style.width = `${target.width()}px`;
          hoverEl.style.height = `${target.height()}px`;
          hoverEl.style.borderRadius = `${8}px`;
        });
        dayRect.on("mouseleave", () => {
          const hoverEl = hoverElRef.current;
          if (!hoverEl) return;
          delete hoverEl.dataset.show;
        });
        // day label
        const label = new Konva.Text({
          x: x + dayWidth / 2,
          y: y + DAY_HEIGHT / 2,
          text: day.format("D"),
          fontSize: 14,
          align: "center",
          verticalAlign: "middle",
          fontStyle: isToday ? "bold" : "normal",
          fill: getThemedColor(
            isToday ? DAY_ACTIVE_TEXT_COLOR : DAY_TEXT_COLOR,
            isDark
          ),
        });
        label.on("mouseenter", () => {
          const hoverEl = hoverElRef.current;
          if (!hoverEl) return;
          hoverEl.dataset.show = "";
        });
        label.offsetX(label.width() / 2);
        label.offsetY(label.height() / 2);
        layer.add(label);
      }
    }

    if (currentElRef.current) {
      const month = monthsRef.current[startIdx + 1];
      const day = month.date(1);
      currentElRef.current.innerHTML = day.format("MMM, YYYY");
    }
    layer.batchDraw();
  }, [isDark]);

  const scrollToDate = useCallback(
    (date: dayjs.Dayjs) => {
      const monthIndex = date.diff(BASE_MONTH, "month");
      while (monthAccHeightsRef.current.length <= monthIndex + 1) {
        let acc =
          monthAccHeightsRef.current[monthAccHeightsRef.current.length - 1];
        let month = monthsRef.current[monthsRef.current.length - 1];
        month = month.add(1, "month");
        monthsRef.current.push(month);
        const rowCount = getMonthRowCount(month);
        const h =
          MONTH_LABEL_HEIGHT +
          rowCount * DAY_HEIGHT +
          (rowCount - 1) * DAY_GAP_Y +
          MONTH_GAP_Y;
        acc += h;
        monthAccHeightsRef.current.push(acc);
      }
      updateScrollY(monthAccHeightsRef.current[monthIndex] || 0);
      drawCalendar();
    },
    [drawCalendar, updateScrollY]
  );
  // scroll event
  const onWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      updateScrollY(scrollYRef.current + e.deltaY);
      requestAnimationFrame(drawCalendar);
    },
    [drawCalendar, updateScrollY]
  );

  // size change
  const onResize = useCallback(
    (width: number, height: number) => {
      if (!containerRef.current || !stageRef.current) return;
      widthRef.current = width;
      heightRef.current = height;
      stageRef.current.width(width);
      stageRef.current.height(height);
      requestAnimationFrame(drawCalendar);
    },
    [drawCalendar]
  );

  // init
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    widthRef.current = width;
    heightRef.current = height;
    // init months cache
    let acc = 0;
    let month = BASE_MONTH;
    monthsRef.current = [];
    monthAccHeightsRef.current = [0];
    for (let i = 0; i < INIT_MONTHS; i++) {
      monthsRef.current.push(month);
      const rowCount = getMonthRowCount(month);
      const h =
        MONTH_LABEL_HEIGHT +
        rowCount * DAY_HEIGHT +
        (rowCount - 1) * DAY_GAP_Y +
        MONTH_GAP_Y;
      acc += h;
      monthAccHeightsRef.current.push(acc);
      month = month.add(1, "month");
    }
    // init Konva
    const stage = new Konva.Stage({ container, width, height });
    const layer = new Konva.Layer();
    stage.add(layer);
    stageRef.current = stage;
    layerRef.current = layer;
    // scroll to initial date
    const day = dayjs(initialDate);
    scrollToDate(day);

    // initial draw
    drawCalendar();
    return () => {
      stage.destroy();
    };
  }, [initialDate, drawCalendar, scrollToDate]);

  // handle wheel
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    container.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", onWheel);
    };
  }, [onWheel]);

  // handle resize
  useEffect(() => {
    if (!containerRef.current) return;
    return observeResize(
      containerRef.current,
      ({ contentRect: { width, height } }) => {
        onResize(width, height);
      }
    );
  }, [onResize]);

  // handle touch
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // restore AutoScroller
    const autoScroller = new AutoScroller((delta: number) => {
      updateScrollY(scrollYRef.current - delta);
      requestAnimationFrame(drawCalendar);
    });
    function onTouchStart(event: TouchEvent) {
      const touch = event.touches[0];
      if (!touch) return;
      autoScroller.start({ x: touch.clientX, y: touch.clientY });
      container.addEventListener("touchmove", onTouchMove);
      container.addEventListener("touchend", onTouchEnd);
    }
    function onTouchMove(event: TouchEvent) {
      const touch = event.touches[0];
      if (!touch) return;
      autoScroller.move({ x: touch.clientX, y: touch.clientY });
    }
    function onTouchEnd() {
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      autoScroller.end();
    }
    container.addEventListener("touchstart", onTouchStart);

    return () => {
      container.removeEventListener("touchstart", onTouchStart);
    };
  }, [drawCalendar, updateScrollY]);

  // handle mouse dragging
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const autoScroller = new AutoScroller((delta: number) => {
      updateScrollY(scrollYRef.current - delta);
      requestAnimationFrame(drawCalendar);
    });
    function onMouseDown(event: MouseEvent) {
      autoScroller.start({ x: event.clientX, y: event.clientY });
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp, { once: true });
    }
    function onMouseMove(event: MouseEvent) {
      autoScroller.move({ x: event.clientX, y: event.clientY });
    }
    function onMouseUp() {
      window.removeEventListener("mousemove", onMouseMove);
      autoScroller.end();
    }

    container.addEventListener("mousedown", onMouseDown);
    return () => {
      container.removeEventListener("mousedown", onMouseDown);
    };
  }, [drawCalendar, updateScrollY]);

  return (
    <div className="w-full h-full relative">
      <div ref={containerRef} className="w-full h-full" />
      <header
        className="calendar-header absolute top-0 left-0 w-full"
        style={{ height: VIEWPORT_PADDING_TOP }}
      >
        <div className="calendar-current" ref={currentElRef} />
        <div
          className="week-labels flex"
          style={{ gap: DAY_GAP_X, padding: `0 ${PADDING_X}px` }}
        >
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => (
            <div key={label} className="week-label flex-1 text-center">
              {label}
            </div>
          ))}
        </div>
      </header>
      <div>
        <div className="hover-rect absolute" ref={hoverElRef} />
      </div>
    </div>
  );
}
