// const appKey = '1e40426f3b6c5127cd7237c62fe56cee'
let map = null
let place = null

setInterval(() => {
  relayout()
  console.log('실행')
}, 1000)

document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('map')
  const options = {
    center: new kakao.maps.LatLng(33.450701, 126.570667),
    level: 1,
  }

  map = new kakao.maps.Map(container, options)
  place = new kakao.maps.services.Places()
})

function searchPlaces(keyword) {
  if (!keyword) {
    return false
  }
  // findSearchMap.postMessage(keyword)
  place.keywordSearch(keyword, searchCallback)
  return true
}

function searchCallback(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {
    console.log('검색 결과', data, 'paging', pagination)
    data
      .map((place) => new kakao.maps.LatLng(place.y, place.x))
      .map(
        (latlon) =>
          new kakao.maps.Marker({
            position: latlon,
          })
      )
      .forEach((marker) => marker.setMap(map))

    findSearchMap.postMessage(JSON.stringify(data))
    return
  }

  if (status === kakao.maps.services.Status.ZERO_RESULT) {
    return
  }

  if (status === kakao.maps.services.Status.ERROR) {
    return
  }
}

function panTo(latitude, longitude) {
  let moveLatLon = new kakao.maps.LatLng(latitude, longitude)
  map.panTo(moveLatLon)

  let marker = new kakao.maps.Marker({
    position: markerPosition,
  })

  marker.setMap(map)
}

function relayout() {
  map.relayout()
}
