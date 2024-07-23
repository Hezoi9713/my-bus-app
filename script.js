document.addEventListener('DOMContentLoaded', function() {
    const arsNumber = '2223';
    const corsProxy = 'https://api.allorigins.win/get?url=';
    const stationApiUrlBase = 'http://121.147.206.212/json/stationApi';
    const arriveApiUrlBase = 'http://121.147.206.212/json/arriveApi?BUSSTOP_ID=';
    const busStopButton = document.getElementById('busStopButton');
    const busArrivalsContainer = document.getElementById('busArrivals');

    // 정류소 이름 로드
    const stationApiUrl = `${corsProxy}${encodeURIComponent(stationApiUrlBase)}`;
    fetch(stationApiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Station data fetched:', data);
            const parsedData = JSON.parse(data.contents);  // allorigins 프록시에서 반환된 데이터 파싱
            const busStop = parsedData.STATION_LIST.find(station => station.ARS_ID == arsNumber);
            if (busStop) {
                busStopButton.textContent = `${busStop.BUSSTOP_NAME} (${arsNumber})`;
                busStopButton.addEventListener('click', () => loadBusArrivals(busStop.BUSSTOP_ID));
            } else {
                busStopButton.textContent = '정류소 정보를 로드할 수 없습니다.';
            }
        })
        .catch(error => {
            console.error('Error fetching station data:', error);
            busStopButton.textContent = '정류소 정보를 로드할 수 없습니다.';
        });

    function loadBusArrivals(busStopId) {
        const apiUrl = `${corsProxy}${encodeURIComponent(arriveApiUrlBase + busStopId)}`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log('Arrival data fetched:', data);
                const parsedData = JSON.parse(data.contents);  // allorigins 프록시에서 반환된 데이터 파싱

                busArrivalsContainer.innerHTML = '';  // 기존 데이터를 비웁니다
                if (parsedData.ARRIVE_LIST && parsedData.ARRIVE_LIST.length > 0) {
                    const busTable = document.createElement('table');
                    busTable.classList.add('bus-table');
                    busTable.innerHTML = `
                        <tr>
                            <th>노선 이름</th>
                            <th>도착 예상 시간</th>
                            <th>남은 정류소</th>
                            <th>다음 정류소</th>
                            <th>도착지</th>
                        </tr>
                    `;
                    parsedData.ARRIVE_LIST.forEach(bus => {
                        const busRow = document.createElement('tr');
                        busRow.innerHTML = `
                            <td>${bus.LINE_NAME}</td>
                            <td>${bus.REMAIN_MIN || '-'}</td>
                            <td>${bus.REMAIN_STOP || '-'}</td>
                            <td>${bus.NEXT_BUSSTOP || '-'}</td>
                            <td>${bus.DIR_END || '-'}</td>
                        `;
                        busTable.appendChild(busRow);
                    });
                    busArrivalsContainer.appendChild(busTable);
                } else {
                    busArrivalsContainer.innerHTML = '<p>도착 예정인 버스가 없습니다.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching bus arrival data:', error);
                busArrivalsContainer.innerHTML = '<p>버스 도착 정보를 가져오는 중 오류가 발생했습니다.</p>';
            });
    }
});
