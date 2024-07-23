document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('getDownwardInfo').addEventListener('click', function() {
        const arsNumbers = ['2223', '3121', '1229'];  // 자주 가는 정류소의 ARS 번호
        const preferredBusLines = ['160', '순환1', '순환2', '급행01'];  // 자주 타는 버스 노선 이름

        // CORS Proxy를 사용한 API URL
        const corsProxy = 'https://api.allorigins.win/get?url=';
        const arriveApiUrlBase = 'http://121.147.206.212/json/arriveApi?BUSSTOP_ID=';
        const busArrivalsContainer = document.getElementById('busArrivals');
        busArrivalsContainer.innerHTML = '';

        console.log('버튼 클릭됨');  // 버튼이 클릭되었는지 확인

        arsNumbers.forEach(arsNumber => {
            const apiUrl = `${corsProxy}${encodeURIComponent(arriveApiUrlBase + arsNumber)}`;

            console.log(`Fetching data for ARS number: ${arsNumber}`);  // API 호출 여부 확인

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    console.log('Data fetched:', data);  // 데이터가 잘 받아지는지 확인
                    const parsedData = JSON.parse(data.contents);  // allorigins 프록시에서 반환된 데이터 파싱

                    if (parsedData.ARRIVE_LIST && parsedData.ARRIVE_LIST.length > 0) {
                        parsedData.ARRIVE_LIST.forEach(bus => {
                            if (preferredBusLines.includes(bus.LINE_NAME)) {
                                const busElement = document.createElement('div');
                                busElement.classList.add('bus-arrival');
                                busElement.innerHTML = `
                                    <strong>정류소 이름:</strong> ${bus.BUSSTOP_NAME} <br>
                                    <strong>노선 이름:</strong> ${bus.LINE_NAME} <br>
                                    <strong>도착 예상 시간:</strong> ${bus.REMAIN_MIN} 분 <br>
                                    <strong>남은 정류소:</strong> ${bus.REMAIN_STOP} <br>
                                    <strong>다음 정류소:</strong> ${bus.NEXT_BUSSTOP} <br>
                                    <strong>도착지:</strong> ${bus.DIR_END}
                                `;
                                busArrivalsContainer.appendChild(busElement);
                            }
                        });
                    } else {
                        const noBusElement = document.createElement('div');
                        noBusElement.classList.add('bus-arrival');
                        noBusElement.innerHTML = '해당 정류소에 도착 예정인 버스가 없습니다.';
                        busArrivalsContainer.appendChild(noBusElement);
                    }
                })
                .catch(error => {
                    console.error('Error fetching bus arrival data:', error);
                    alert('버스 도착 정보를 가져오는 중 오류가 발생했습니다.');
                });
        });
    });
});
