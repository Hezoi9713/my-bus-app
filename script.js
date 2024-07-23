document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('getDownwardInfo').addEventListener('click', function() {
        const arsNumbers = ['2223', '3121', '1229'];  // 자주 가는 정류소의 ARS 번호
        const preferredBusLines = ['160', '순환1', '순환2', '급행01'];  // 자주 타는 버스 노선 번호

        // CORS Proxy를 사용한 API URL
        const corsProxy = 'https://api.allorigins.win/get?url=';
        const stationApiUrlBase = 'http://121.147.206.212/json/stationApi';
        const arriveApiUrlBase = 'http://121.147.206.212/json/arriveApi?BUSSTOP_ID=';
        const busArrivalsContainer = document.getElementById('busArrivals');
        busArrivalsContainer.innerHTML = '';

        console.log('버튼 클릭됨');  // 버튼이 클릭되었는지 확인

        arsNumbers.forEach(arsNumber => {
            const stationApiUrl = `${corsProxy}${encodeURIComponent(stationApiUrlBase)}`;

            fetch(stationApiUrl)
                .then(response => response.json())
                .then(data => {
                    const parsedData = JSON.parse(data.contents);  // allorigins 프록시에서 반환된 데이터 파싱

                    // ARS_ID와 일치하는 정류소 정보를 찾음
                    const busStop = parsedData.STATION_LIST.find(station => station.ARS_ID == arsNumber);
                    if (!busStop) {
                        console.error(`No bus stop found for ARS number: ${arsNumber}`);
                        return;
                    }

                    const apiUrl = `${corsProxy}${encodeURIComponent(arriveApiUrlBase + busStop.BUSSTOP_ID)}`;

                    fetch(apiUrl)
                        .then(response => response.json())
                        .then(data => {
                            const parsedArriveData = JSON.parse(data.contents);  // allorigins 프록시에서 반환된 데이터 파싱

                            if (parsedArriveData.BUSSTOP_LIST && parsedArriveData.BUSSTOP_LIST.length > 0) {
                                parsedArriveData.BUSSTOP_LIST.forEach(bus => {
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
                })
                .catch(error => {
                    console.error('Error fetching station data:', error);
                    alert('정류소 정보를 가져오는 중 오류가 발생했습니다.');
                });
        });
    });
});
