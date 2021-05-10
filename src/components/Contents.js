import { useState, useEffect } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import axios from 'axios'; /* 데이터를 get하는 용도 */

const Contents = () => {
  // useState를 쓸 때 [ 데이터명, 세팅을 해주는 메서드 ] 이렇게 적는다.
  // 배열 구조분해
  const [confirmedData, setConfirmedData] = useState({});
  const [quarantinedData, setQuarantinedData] = useState({});
  const [comparedData, setComparedData] = useState({});

  // 클래스에서 마운트가 됐을 때 바로 메서드를 실행하는 효과를 위해 useEffect를 사용함
  // ! useEffect()에 두 번째 매개변수로 배열 객체를 안 넣으면 함수를 계속 호출하는 에러가 난다
  useEffect(() => {
    const makeData = (items) => {
      const arr = items.reduce((acc, cur) => {
        const currentData = new Date(cur.Date);
        const year = currentData.getFullYear();
        const month = currentData.getMonth();
        const date = currentData.getDate();
        const {
          Confirmed: confirmed,
          Active: active,
          Death: death,
          Recovered: recovered,
        } = cur;

        const findItem = acc.find((a) => a.year === year && a.month === month);

        if (!findItem) {
          acc.push({ year, month, date, confirmed, active, death, recovered });
        }

        if (findItem && findItem.date < date) {
          findItem.active = active;
          findItem.death = death;
          findItem.date = date;
          findItem.year = year;
          findItem.month = month;
          findItem.recovered = recovered;
          findItem.confirmed = confirmed;
        }
        return acc;
      }, []);

      // 매월 마지막 데이터를 가진 배열 완성 후 동작 부분
      const labels = arr.map((a) => `${a.month + 1}월`);
      setConfirmedData({
        labels,
        datasets: [
          {
            label: '국내 누적 확진자',
            backgroundColor: 'salmon',
            fill: true, /* 그래프에 색을 채울지 말지 설정 */
            data: arr.map((a) => a.confirmed),
          },
        ],
      });
      setQuarantinedData({
        labels,
        datasets: [
          {
            label: '월별 격리자 현황',
            backgroundColor: 'salmon',
            borderColor: 'salmon',
            fill: false,
            data: arr.map((a) => a.active),
          },
        ],
      });
      const last = arr[arr.length - 1];
      setComparedData({
        labels: ["확진자", "격리해제", "사망"],
        datasets: [
          {
            label: "누적 확진, 해제, 사망 비율",
            backgroundColor: ["#ff3d67", "#059bff", "#ffc233"],
            borderColor: ["#ff3d67", "#059bff", "#ffc233"],
            fill: false,
            data: [last.confirmed, last.recovered, last.death]
          },
        ],
      });
    };
    const fetchEvents = async () => {
      const res = await axios.get(
        'https://api.covid19api.com/total/dayone/country/kr'
      );
      makeData(res.data);
    };

    fetchEvents();
  }, []);
  return (
    <section>
      <h2>국내 코로나 현황</h2>
      <div className="contents">
        <div>
          <Bar
            data={confirmedData}
            options={{
              title: {
                display: true,
                text: "누적 확진자 추이",
                fontSize: 16,
              },
              legend: {
                display: true,
                align: "bottom",
              },
            }}
          ></Bar>
          <Line
            data={quarantinedData}
            options={{
              title: {
                display: true,
                text: "월별 격리자 현황",
                fontSize: 16,
              },
              legend: {
                display: true,
                align: "bottom",
              },
            }}
          ></Line>
          <Doughnut
            data={comparedData}
            options={{
              title: {
                display: true,
                text: `누적 확진, 해제, 사망 (${new Date().getMonth() + 1}월)`,
                fontSize: 16,
              },
              legend: {
                display: true,
                align: "bottom",
              },
            }}
          ></Doughnut>

        </div>
      </div>
    </section>
  );
};

export default Contents;
