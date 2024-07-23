function fetchBusStopName() {
    const arsId = document.getElementById('arsId').value;
    const busStopNameDiv = document.getElementById('busStopName');

    // 정류소 정보 API 호출
    fetch(`http://121.147.206.212/json/stationApi?ARS_ID=${arsId}`)
        .then(response => response.json())
        .then(data => {
            if (data.STATION_LIST && data.STATION_LIST.STATION.length > 0) {
                const busStop = data.STATION_LIST.STATION[0];
                const busStopName = busStop.BUSSTOP_NAME;
                busStopNameDiv.innerText = `정류소 이름: ${busStopName}`;
                fetchBusArrivalInfo(busStop.BUSSTOP_ID, busStopName); // 정류소 ID를 이용하여 도착 정보 가져오기
            } else {
                busStopNameDiv.innerText = '해당 ARS 번호에 대한 정류소 정보를 찾을 수 없습니다.';
            }
        })
        .catch(error => {
            console.error('Error fetching bus stop info:', error);
            busStopNameDiv.innerText = '정류소 정보를 가져오는 중 오류가 발생했습니다.';
        });
}

function fetchBusArrivalInfo(busStopId, busStopName) {
    const arrivalInfoTable = document.getElementById('arrivalInfo').getElementsByTagName('tbody')[0];
    arrivalInfoTable.innerHTML = ''; // 이전 결과를 지우기

    // 도착 정보 API 호출
    fetch(`http://121.147.206.212/json/arriveApi?BUSSTOP_ID=${busStopId}`)
        .then(response => response.json())
        .then(data => {
            if (data.BUSSTOP_LIST && data.BUSSTOP_LIST.BUSSTOP.length > 0) {
                const arrivals = data.BUSSTOP_LIST.BUSSTOP;
                arrivals.forEach(arrival => {
                    const row = arrivalInfoTable.insertRow();
                    row.insertCell(0).innerText = busStopName; // 정류소 이름
                    row.insertCell(1).innerText = arrival.LINE_NAME; // 노선 이름
                    row.insertCell(2).innerText = arrival.REMAIN_MIN; // 도착 예상 시간
                    row.insertCell(3).innerText = arrival.REMAIN_STOP; // 남은 정류소 수
                    row.insertCell(4).innerText = '도착지'; // 도착지 (예시로 추가, 실제 데이터 필요)
                });
            } else {
                const row = arrivalInfoTable.insertRow();
                const cell = row.insertCell(0);
                cell.colSpan = 5;
                cell.innerText = '도착 정보를 찾을 수 없습니다.';
            }
        })
        .catch(error => {
            console.error('Error fetching arrival info:', error);
            const row = arrivalInfoTable.insertRow();
            const cell = row.insertCell(0);
            cell.colSpan = 5;
            cell.innerText = '도착 정보를 가져오는 중 오류가 발생했습니다.';
        });
}
