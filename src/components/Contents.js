import { useState, useEffect } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import axios from 'axios'; /* 데이터를 get하는 용도 */

const Contents = () => {
  // useState를 쓸 때 [ 데이터명, 세팅을 해주는 메서드 ] 이렇게 적는다.
  // 배열 구조분해
  const [confirmedData, setConfirmedData] = useState({
    labels: ['1월', '2월', '3월'],
    datasets: [
      {
        label: '국내 누적 확진자',
        backgroundColor: 'salmon',
        fill: true /* 그래프에 색을 채울지 말지 설정 */,
        data: [10, 5, 3],
      },
    ],
  });

  // 클래스에서 마운트가 됐을 때 바로 메서드를 실행하는 효과를 위해 useEffect를 사용함
  useEffect(() => {
    const fetchEvents = async () => {
      const res = await axios.get(
        'https://api.covid19api.com/total/dayone/country/kr'
      );
    };
    fetchEvents();
  });
  return (
    <section>
      <h2>국내 코로나 현황</h2>
      <div className="contents">
        <div>
          <Bar
            data={confirmedData}
            options={
              ({
                title: {
                  display: true,
                  text: '누적 확진자 추이',
                  fontSize: 16,
                },
              },
              { legend: { display: true, position: 'bottom' } })
            }
          ></Bar>
        </div>
      </div>
    </section>
  );
};

export default Contents;
