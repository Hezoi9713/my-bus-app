function fetchBusStopName() {
    const arsId = document.getElementById('arsId').value;
    const busStopNameDiv = document.getElementById('busStopName');

    // 정류소 정보 API 호출
    fetch(`http://121.147.206.212/json/stationApi?ARS_ID=${arsId}`)
        .then(response => response.json())
        .then(data => {
            if (data.STATION_LIST && data.STATION_LIST.STATION) {
                const busStopName = data.STATION_LIST.STATION.BUSSTOP_NAME;
                busStopNameDiv.innerText = `정류소 이름: ${busStopName}`;
                fetchBusArrivalInfo(busStopName);
            } else {
                busStopNameDiv.innerText = '해당 ARS 번호에 대한 정류소 정보를 찾을 수 없습니다.';
            }
        })
        .catch(error => {
            console.error('Error fetching bus stop info:', error);
            busStopNameDiv.innerText = '정류소 정보를 가져오는 중 오류가 발생했습니다.';
        });
}

function fetchBusArrivalInfo(busStopName) {
    const arrivalInfoTable = document.getElementById('arrivalInfo').getElementsByTagName('tbody')[0];

    // 도착 정보 API 호출
    fetch(`http://121.147.206.212/json/arriveApi?BUSSTOP_ID=${busStopName}`)
        .then(response => response.json())
        .then(data => {
            if (data.BUSSTOP_LIST && data.BUSSTOP_LIST.BUSSTOP) {
                const arrivals = data.BUSSTOP_LIST.BUSSTOP;
                arrivals.forEach(arrival => {
                    const row = arrivalInfoTable.insertRow();
                    row.insertCell(0).innerText = arrival.ARS_ID;
                    row.insertCell(1).innerText = arrival.LINE_NAME;
                    row.insertCell(2).innerText = arrival.REMAIN_MIN;
                    row.insertCell(3).innerText = arrival.REMAIN_STOP;
                    row.insertCell(4).innerText = arrival.DIR_END; // 도착지는 별도로 설정하거나 데이터를 추가할 수 있습니다.
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
