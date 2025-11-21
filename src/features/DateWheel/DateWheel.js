import React, { useState, useEffect, useMemo, useRef } from "react";
import "./DateWheel.css";

const MIN_YEAR = 1000;
const MAX_YEAR = 2025;

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const generateYears = () =>
  Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MIN_YEAR + i);

const getDaysInMonth = (year, month) =>
  new Date(year, month + 1, 0).getDate();

const validateDate = (year, month, day) =>
  Math.min(day, getDaysInMonth(year, month));

const useDateWheel = (initialYear = 2025, initialMonth = 0, initialDay = 1) => {
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedDay, setSelectedDay] = useState(initialDay);

  const [yearPositions, setYearPositions] = useState(generateYears());
  const [monthPositions, setMonthPositions] = useState(MONTHS.map((_, i) => i));
  const [dayPositions, setDayPositions] = useState([]);

  const wheelRef = useRef(null);
  const [radiusYear, setRadiusYear] = useState(0);
  const [radiusMonth, setRadiusMonth] = useState(0);
  const [radiusDay, setRadiusDay] = useState(0);

  const daysInMonth = useMemo(
    () => getDaysInMonth(selectedYear, selectedMonth),
    [selectedYear, selectedMonth]
  );

  const days = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth]
  );

  // Adjust radius dynamically based on wheel size
  useEffect(() => {
    const updateRadius = () => {
      if (wheelRef.current) {
        const size = wheelRef.current.offsetWidth / 2;
        setRadiusYear(size * 0.85);
        setRadiusMonth(size * 0.55);
        setRadiusDay(size * 0.3);
      }
    };
    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  // Update days when month or year changes
  useEffect(() => {
    setDayPositions([...days]);
  }, [days]);

  // Validate selected day
  useEffect(() => {
    const valid = validateDate(selectedYear, selectedMonth, selectedDay);
    if (valid !== selectedDay) setSelectedDay(valid);
  }, [selectedYear, selectedMonth, selectedDay, daysInMonth]);

  // Shuffle years every 2s
  useEffect(() => {
    const interval = setInterval(() => {
      setYearPositions(prev => {
        const arr = [...prev];
        const i1 = Math.floor(Math.random() * arr.length);
        const i2 = Math.floor(Math.random() * arr.length);
        [arr[i1], arr[i2]] = [arr[i2], arr[i1]];
        return arr;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Shuffle months every 1s
  useEffect(() => {
    const interval = setInterval(() => {
      setMonthPositions(prev => {
        const arr = [...prev];
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Shuffle days every 2s
  useEffect(() => {
    const interval = setInterval(() => {
      setDayPositions(prev => {
        const arr = [...prev];
        if (arr.length < 2) return arr;
        const i1 = Math.floor(Math.random() * arr.length);
        const i2 = Math.floor(Math.random() * arr.length);
        [arr[i1], arr[i2]] = [arr[i2], arr[i1]];
        return arr;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return {
    selectedYear,
    selectedMonth,
    selectedDay,
    yearPositions,
    monthPositions,
    dayPositions,
    setSelectedYear,
    setSelectedMonth,
    setSelectedDay,
    wheelRef,
    radiusYear,
    radiusMonth,
    radiusDay
  };
};

const WheelLayer = React.memo(
  ({ items, selectedValue, onSelect, radius, itemSize = 40, className = "", getLabel = (i) => i }) => {
    const rotateStyle = (index, total) => {
      const angle = (360 / total) * index;
      return {
        transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`,
        width: `${itemSize}px`,
        height: `${itemSize}px`,
        margin: `-${itemSize / 2}px 0 0 -${itemSize / 2}px`,
      };
    };

    return (
      <div className={`wheel-layer ${className}`}>
        {items.map((item, index) => (
          <div
            key={getLabel(item)}
            className={`wheel-item ${item === selectedValue ? "selected" : ""}`}
            style={rotateStyle(index, items.length)}
            onClick={() => onSelect(item)}
          >
            {getLabel(item)}
          </div>
        ))}
      </div>
    );
  }
);

const DateWheel = () => {
  const {
    selectedYear,
    selectedMonth,
    selectedDay,
    yearPositions,
    monthPositions,
    dayPositions,
    setSelectedYear,
    setSelectedMonth,
    setSelectedDay,
    wheelRef,
    radiusYear,
    radiusMonth,
    radiusDay
  } = useDateWheel();

  const formattedDate = useMemo(
    () => `${selectedDay} / ${MONTHS[selectedMonth]} / ${selectedYear}`,
    [selectedDay, selectedMonth, selectedYear]
  );

  return (
    <div className="wheel-container">
      <div className="wheel" ref={wheelRef}>
        <WheelLayer
          items={yearPositions}
          selectedValue={selectedYear}
          onSelect={setSelectedYear}
          radius={radiusYear}
          itemSize={Math.max(radiusYear * 0.25, 30)}
          className="years"
        />
        <WheelLayer
          items={monthPositions}
          selectedValue={selectedMonth}
          onSelect={setSelectedMonth}
          radius={radiusMonth}
          itemSize={Math.max(radiusMonth * 0.3, 30)}
          className="months"
          getLabel={(i) => MONTHS[i]}
        />
        <WheelLayer
          items={dayPositions}
          selectedValue={selectedDay}
          onSelect={setSelectedDay}
          radius={radiusDay}
          itemSize={Math.max(radiusDay * 0.25, 25)}
          className="days"
        />
      </div>

      <div className="wheel-bottom">{formattedDate}</div>
    </div>
  );
};

export default React.memo(DateWheel);