import { useState, useEffect } from 'react';
import axios from 'axios';

const Contents = () => {
  // 클래스에서 마운트가 됐을 때 바로 메서드를 실행하는 효과를 위해 useEffect를 사용함
  useEffect(() => {
    const fetchEvents = async () => {
      const res = await axios.get(
        'https://api.covid19api.com/total/dayone/country/kr'
      );
      console.log(res);
    };
    fetchEvents();
  });
  return (
    <section>
      <h2>국내 코로나 현황</h2>
      <div className="contents"></div>
    </section>
  );
};

export default Contents;
