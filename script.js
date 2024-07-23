document.getElementById('getBusInfo').addEventListener('click', function() {
    const busStopId = document.getElementById('busStopId').value;
    if (!busStopId) {
        alert('정류소 번호를 입력하세요.');
        return;
    }

    const apiUrl = `http://121.147.206.212/json/arriveApi?BUSSTOP_ID=${busStopId}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const busArrivals = document.getElementById('busArrivals');
            busArrivals.innerHTML = '';

            if (data.BUSSTOP_LIST && data.BUSSTOP_LIST.length > 0) {
                data.BUSSTOP_LIST.forEach(bus => {
                    const busElement = document.createElement('div');
                    busElement.classList.add('bus-arrival');
                    busElement.innerHTML = `
                        <strong>노선 번호:</strong> ${bus.LINE_ID} <br>
                        <strong>버스 번호:</strong> ${bus.BUS_ID} <br>
                        <strong>도착 예상 시간:</strong> ${bus.REMAIN_MIN} 분 <br>
                        <strong>남은 정류소:</strong> ${bus.REMAIN_STOP} <br>
                        <strong>노선 이름:</strong> ${bus.LINE_NAME}
                    `;
                    busArrivals.appendChild(busElement);
                });
            } else {
                busArrivals.innerHTML = '도착 예정 버스가 없습니다.';
            }
        })
        .catch(error => {
            console.error('Error fetching bus arrival data:', error);
            alert('버스 도착 정보를 가져오는 중 오류가 발생했습니다.');
        });
});
