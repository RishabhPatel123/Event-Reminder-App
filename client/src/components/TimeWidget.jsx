import React, { useState, useEffect } from 'react';

const TimeWidget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(timerId);
  }, []);

  return (
    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
      {time.toLocaleTimeString()}
    </div>
  );
};

export default TimeWidget;