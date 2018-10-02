var map;
function initMap() {
  var target = document.getElementById('map');
  var shibuya = {lat: 35.658034, lng: 139.701636};
  var opts = {center:shibuya, zoom:15};
  map = new google.maps.Map(target, opts);

  // var marker = new google.maps.Marker({position: shibuya, map: map});
  var MarkerArray = new google.maps.MVCArray();
  //PlacesService のインスタンスの生成（引数に map を指定）
  var service = new google.maps.places.PlacesService(map);


  google.maps.event.addListener(map, 'click', function(e) {
    ClearAllIcon();
    //種類（タイプ）やキーワードをもとに施設を検索（プレイス検索）するメソッド nearbySearch()
    service.nearbySearch({
      location: e.latLng,  //検索するロケーション
      radius: 500,  //検索する半径（メートル）
      type: ['store']  //タイプで検索。文字列またはその配列で指定
      //キーワードで検索する場合は name:'レストラン' や ['レストラン','中華'] のように指定
    }, callback);  //コールバック関数（callback）は別途定義

    //コールバック関数には results, status が渡されるので、status により条件分岐
    function callback(results, status) {
      // status は以下のような定数で判定（OK の場合は results が配列で返ってきます）
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        //results の数だけ for 文で繰り返し処理
        for (var i = 0; i < results.length; i++) {
          //createMarker() はマーカーを生成する関数（別途定義）
          createMarker(results[i]);
        }
      }
    }
  });


  //マーカーを生成する関数（引数には検索結果の配列 results[i] が入ってきます）
  function createMarker(place) {
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,  //results[i].geometry.location
      animation: google.maps.Animation.DROP
    });

    //マーカーにイベントリスナを設定
    marker.addListener('click', function() {


      var contentString = place.name +
          '<div id="bodyContent">'+
          '<div id="start">出発地に設定</div>'+
          '<div id=end><button>目的地に設定</button></div>'+
          '</div>';


      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      var startBtn = document.getElementById("start")
      startBtn.innerText = "出発地に設定する";
      // google.maps.event.addDomListener(startBtn,"click", function(){
      //   infowindow.setContent("出発地に設定しました");
      //   //ここでstartを設定
      //   //マーカーのボタンをすり替える
      // });

      var endBtn = document.createElement("button");
      endBtn.innerText = "目的地に設定する";

      infowindow.setContent(startBtn + endBtn);
      infowindow.open(map, this);
    });

    MarkerArray.push(marker);
  }

  // function setEndBtn(){
  //
  //   var endBtn = document.createElement("button");
  //   endBtn.innerText = "目的地に設定する";
  //   google.maps.event.addDomListener(endBtn,"click", function(){
  //     infowindow.setContent("目的地に設定しました");
  //     //ここでendを設定しルートを表示
  //
  //   });
  //   infowindow.setContent(endBtn);
  //
  // }

  function ClearAllIcon() {
    MarkerArray.forEach(function (marker, idx) { marker.setMap(null); });
  }


  //DirectionsService のオブジェクトを生成
  var directionsService = new google.maps.DirectionsService();
  //DirectionsRenderer のオブジェクトを生成
  var directionsRenderer = new google.maps.DirectionsRenderer();

  //directionsRenderer と地図を紐付け
  directionsRenderer.setMap(map);

  //リクエストの出発点の位置（Empire State Building 出発地点の緯度経度）
  var start = new google.maps.LatLng(35.658034, 139.701636);
  //リクエストの終着点の位置（Grand Central Station 到着地点の緯度経度）
  var end = new google.maps.LatLng( 35.658034,139.709);

  // ルートを取得するリクエスト
  var request = {
    origin: start,      // 出発地点の緯度経度
    destination: end,   // 到着地点の緯度経度
    travelMode: 'TRANSIT' //トラベルモード（歩き）
  };

  //DirectionsService のオブジェクトのメソッド route() にリクエストを渡し、
  //コールバック関数で結果を setDirections(result) で directionsRenderer にセットして表示
  directionsService.route(request, function(result, status) {
    //ステータスがOKの場合、
    if (status === 'OK') {
      directionsRenderer.setDirections(result); //取得したルート（結果：result）をセット
    }else{
      alert("取得できませんでした：" + status);
    }
  });




}
