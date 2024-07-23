document.addEventListener('DOMContentLoaded', function() {
    const busStops = [
        { arsNumber: '2223', preferredBusLines: ['160', '순환1'] },
        { arsNumber: '3121', preferredBusLines: ['급행01'] },
        { arsNumber: '1299', preferredBusLines: ['순환2'] }
    ];
    const corsProxy = 'https://api.allorigins.win/get?url=';
    const stationApiUrlBase = 'http://121.147.206.212/json/stationApi';
    const arriveApiUrlBase = 'http://121.147.206.212/json/arriveApi?BUSSTOP_ID=';
    const busStopButton = document.getElementById('busStopButton');
    const busArrivalsContainer = document.getElementById('busArrivals');

    busStopButton.textContent = '하행';

    busStopButton.addEventListener('click', () => {
        busArrivalsContainer.innerHTML = '';  // 기존 데이터를 비웁니다
        busStops.forEach(busStop => {
            loadBusArrivals(busStop.arsNumber, busStop.preferredBusLines);
        });
    });

    function loadBusArrivals(arsNumber, preferredBusLines) {
        const stationApiUrl = `${corsProxy}${encodeURIComponent(stationApiUrlBase)}`;
        fetch(stationApiUrl)
            .then(response => response.json())
            .then(data => {
                console.log('Station data fetched:', data);
                const parsedData = JSON.parse(data.contents);  // allorigins 프록시에서 반환된 데이터 파싱
                const busStop = parsedData.STATION_LIST.find(station => station.ARS_ID == arsNumber);
                if (busStop) {
                    const apiUrl = `${corsProxy}${encodeURIComponent(arriveApiUrlBase + busStop.BUSSTOP_ID)}`;
                    fetch(apiUrl)
                        .then(response => response.json())
                        .then(data => {
                            console.log('Arrival data fetched:', data);
                            const parsedArriveData = JSON.parse(data.contents);  // allorigins 프록시에서 반환된 데이터 파싱

                            if (parsedArriveData.ARRIVE_LIST && parsedArriveData.ARRIVE_LIST.length > 0) {
                                const busTable = document.createElement('table');
                                busTable.classList.add('bus-table');
                                busTable.innerHTML = `
                                    <tr>
                                        <th>정류소 이름</th>
                                        <th>노선 이름</th>
                                        <th>도착 예상 시간</th>
                                        <th>남은 정류소</th>
                                        <th>도착지</th>
                                    </tr>
                                `;
                                parsedArriveData.ARRIVE_LIST.forEach(bus => {
                                    if (preferredBusLines.includes(bus.LINE_NAME)) {
                                        const busRow = document.createElement('tr');
                                        busRow.innerHTML = `
                                            <td>${busStop.BUSSTOP_NAME}</td>
                                            <td>${bus.LINE_NAME}</td>
                                            <td>${bus.REMAIN_MIN || '-'}</td>
                                            <td>${bus.REMAIN_STOP || '-'}</td>
                                            <td>${bus.DIR_END || '-'}</td>
                                        `;
                                        busTable.appendChild(busRow);
                                    }
                                });
                                busArrivalsContainer.appendChild(busTable);
                            } else {
                                const busTable = document.createElement('table');
                                busTable.classList.add('bus-table');
                                busTable.innerHTML = `
                                    <tr>
                                        <th>정류소 이름</th>
                                        <th>노선 이름</th>
                                        <th>도착 예상 시간</th>
                                        <th>남은 정류소</th>
                                        <th>도착지</th>
                                    </tr>
                                `;
                                const busRow = document.createElement('tr');
                                busRow.innerHTML = `
                                    <td>${busStop.BUSSTOP_NAME}</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                `;
                                busTable.appendChild(busRow);
                                busArrivalsContainer.appendChild(busTable);
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching bus arrival data:', error);
                            busArrivalsContainer.innerHTML = '<p>버스 도착 정보를 가져오는 중 오류가 발생했습니다.</p>';
                        });
                } else {
                    console.error(`Bus stop not found for ARS number: ${arsNumber}`);
                }
            })
            .catch(error => {
                console.error('Error fetching station data:', error);
                busStopButton.textContent = '정류소 정보를 로드할 수 없습니다.';
            });
    }
});
