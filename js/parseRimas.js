google.maps.event.addDomListener(window, 'load', init);

var limit = 0;
var internalLimit = 0;

window.onload = function() {
      document.getElementById("showAllBtn").onclick = function showAll() {
			document.getElementById("rimasLast").innerHTML = "";
			document.getElementById("rimasLink").innerHTML = "";
			document.getElementById("rimasDistance").innerHTML = "";
			document.getElementById("rimasEquator").innerHTML = "";
			$(".showAllBtn").hide();
            limit = -10000;
            internalLimit = 0;
            init();
        }
    }

function init() {

	$.ajax({
	async: false,
		url: "https://sailingfortuitous.com/rimas/newRimas.json",
		success: function(lastRimas) {

      var messages = lastRimas.Messages.filter(function(message) { return message.Type !== 1; });
      var msg1 = messages[0];
      var msg2 = messages[1];

			stringLat1 = msg1.Latitude.toString();
			stringLon1 = msg1.Longitude.toString();
			lat1 = msg1.Latitude;
			lon1 = msg1.Longitude;

      stringLat2 = msg2.Latitude.toString();
      stringLon2 = msg2.Longitude.toString();
      lat2 = msg2.Latitude;
      lon2 = msg2.Longitude;

			if (lat1) {

				if (lat1 > 0) {
				fLat = lat1.toFixed(4) + '&deg;N'; }
				else if (lat1 < 0) {
				fLat = lat1.toFixed(4) * -1 + '&deg;S'; }
				else {
				fLat = lat1.toFixed(4) + '&deg;'; }

				if (lon1 > 0) {
				fLon = lon1.toFixed(4) + '&deg;E'; }
				else if (lon1 < 0) {
				fLon = lon1.toFixed(4) * -1 + '&deg;W'; }
				else {
				fLon = lon1.toFixed(4) + '&deg;'; }
			}

			rawDate = msg1.Time;
      rawDate2 = msg2.Time;

			d = new Date (rawDate);

			monthArray = new Array();
				monthArray[0] = "January";
				monthArray[1] = "February";
				monthArray[2] = "March";
				monthArray[3] = "April";
				monthArray[4] = "May";
				monthArray[5] = "June";
				monthArray[6] = "July";
				monthArray[7] = "August";
				monthArray[8] = "September";
				monthArray[9] = "October";
				monthArray[10] = "November";
				monthArray[11] = "December";

			monthPart = monthArray[d.getUTCMonth()];
			datePart = d.getUTCDate();
			yearPart = d.getUTCFullYear();

			hhPart = d.getUTCHours();
			mmPart = d.getUTCMinutes();
			ssPart = d.getUTCSeconds();

			recentRimasDate = monthPart + ' ' + datePart + ', ' + yearPart + '  ' + ('0'+hhPart).slice(-2) + ':' + ('0'+mmPart).slice(-2) + ':' + ('0'+ssPart).slice(-2) + ' GMT';
			trackArray = [];

			//Pull and Format the Messages
			var html = '';

			$.each(lastRimas.Messages, function(index, r) {
				if(limit > 9) return false;

			var rimasMessage = (r.Content);
			var rimasLat = (r.Latitude);
			var rimasLong = (r.Longitude);

			if (rimasLat) {
				if (rimasLat > 0) {
				formattedLat = rimasLat.toFixed(4) + '&deg;N'; }
				else if (rimasLat < 0) {
				formattedLat = rimasLat.toFixed(4) * -1 + '&deg;S'; }
				else {
				formattedLat = rimasLat.toFixed(4) + '&deg;'; }

				if (rimasLong > 0) {
				formattedLong = rimasLong.toFixed(4) + '&deg;E'; }
				else if (rimasLong < 0) {
				formattedLong = rimasLong.toFixed(4) * -1 + '&deg;W'; }
				else {
				formattedLong = rimasLong.toFixed(4) + '&deg;'; }
			}

			var instantaneousDate = (r.Time);

			var i = new Date (instantaneousDate);
			var imonthPart = monthArray[i.getUTCMonth()];
			var idatePart = i.getUTCDate();
			var iyearPart = i.getUTCFullYear();

			var ihhPart = i.getUTCHours();
			var immPart = i.getUTCMinutes();
			var issPart = i.getUTCSeconds();

			var instantaneousRimasDate = imonthPart + ' ' + idatePart + ', ' + iyearPart + '  ' + ('0'+ihhPart).slice(-2) + ':' + ('0'+immPart).slice(-2) + ':' + ('0'+issPart).slice(-2) + ' GMT';

      //calculate distance, elapsed time, and speed in each message
      if (internalLimit < messages.length-1) {
        var d = measureDistance(messages[internalLimit].Latitude, messages[internalLimit].Longitude, messages[internalLimit+1].Latitude, messages[internalLimit+1].Longitude);
        var rimasMessageTravelDate1 = new Date (messages[internalLimit].Time);
        var rimasMessageTravelDate2 = new Date (messages[internalLimit+1].Time);
        var rimasMessageElapsedTime = rimasMessageTravelDate1 - rimasMessageTravelDate2;
        var rimasMessageElapsedTimeInHours = rimasMessageElapsedTime / 3600000;
        var rimasMessageSpeed = (d.toFixed(1) / rimasMessageElapsedTimeInHours).toFixed(2);
      } else {
        var rimasMessageSpeed = '-';
      }

      //calculate heading in each message
      function radians(n) {
        return n * (Math.PI / 180);
      }
      function degrees(n) {
        return n * (180 / Math.PI);
      }

      function getBearing(startLat,startLong,endLat,endLong){
        startLat = radians(messages[internalLimit+1].Latitude);
        startLong = radians(messages[internalLimit+1].Longitude);
        endLat = radians(messages[internalLimit].Latitude);
        endLong = radians(messages[internalLimit].Longitude);

        var dLong = endLong - startLong;

        var dPhi = Math.log(Math.tan(endLat/2.0+Math.PI/4.0)/Math.tan(startLat/2.0+Math.PI/4.0));
        if (Math.abs(dLong) > Math.PI){
          if (dLong > 0.0)
             dLong = -(2.0 * Math.PI - dLong);
          else
             dLong = (2.0 * Math.PI + dLong);
        }

        return (degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
      }

      if (internalLimit < messages.length-1) {
        var rimasHeading = getBearing().toFixed(0);
      } else {
        var rimasHeading = '-';
      }

			//Select entries with messages for display
			if (rimasMessage) {
			html += '<li class="rimasMessage">'
				+ rimasMessage
				+ '<ul><li class="rimasDate">'
				+ instantaneousRimasDate
				+ '</li><li class="latLong">'
				+ formattedLat
				+ ', '
				+ formattedLong
				+ '</li><li class="speed">Course: '
        + rimasHeading
        + '&deg; at '
        + rimasMessageSpeed
        + 'kts</li></ul>'
				+ '</li>';

			limit = limit + 1;
      internalLimit = internalLimit + 1;
			}

			document.getElementById("rimasOutput").innerHTML = html;

			//Make array for plot
			if (rimasLat) {
			trackArray.push(new google.maps.LatLng(rimasLat,rimasLong));
			}
		});

		}
	});

	//Calculate Distances
	document.getElementById("rimasLast").innerHTML += ('Last Transmission: ' + recentRimasDate + '<br />Location: ' + fLat + ', ' + fLon );
	document.getElementById("rimasLink").innerHTML += ('<a href="http://maps.google.com/maps?q=' + lat1 + ',' + lon1 + '+(Rimas)&z=3">http://maps.google.com/maps?q=' + lat1 + ',' + lon1 + '+(Rimas)&z=3</a>' );

		var locations = [
			{"Name":"Akutan, AK USA","L":54.129777,"N":-165.938847},
      {"Name":"Brisbane, Australia","L":-27.2093924,"N":153.0937550},
      {"Name":"Cape Horn","L":-55.987821,"N":-67.2980159},
      {"Name":"Hilo, HI USA","L":19.7292444,"N":-155.0862611},
			{"Name":"Pago Pago, American Samoa","L":-14.2735028,"N":-170.6824667},
      {"Name":"San Francisco, CA USA","L":37.8175833,"N":-122.4785278},
      {"Name":"Savusavu, Fiji","L":-16.7781853,"N":-179.3331274}
		];

	function measureDistance(lat1, lon1, lat2, lon2)
	{
		//var R = 6371; // km
		var R = 3440; // nm
		var pi = Math.PI;
		var t1 = lat1 * (pi / 180);
		var t2 = lat2 * (pi / 180);
		var dt = (lat2 - lat1) * (pi / 180);
		var ds = (lon2 - lon1) * (pi / 180);

		var a = Math.sin(dt/2) * Math.sin(dt/2) +
		Math.cos(t1) * Math.cos(t2) *
		Math.sin(ds/2) * Math.sin(ds/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

		var d = R * c;

		return d;
	}

  //Calulate Distance and Speed since Last Ping
  var d = measureDistance(lat1, lon1, lat2, lon2);
  var rimasTravelDate1 = new Date (rawDate);
  var rimasTravelDate2 = new Date (rawDate2);
  var rimasElapsedTime = rimasTravelDate1 - rimasTravelDate2;
  var rimasElapsedTimeInHours = rimasElapsedTime / 3600000;
  var rimasElapsedTimeInRoundHours = (rimasElapsedTime / 3600000).toFixed(1);
  var rimasSpeed = (d.toFixed(1) / rimasElapsedTimeInHours).toFixed(2);
  document.getElementById("rimasTravelDistance").innerHTML += ('<li>Approximately ' + d.toFixed(1) + 'nm from previous ping, ' + rimasElapsedTimeInRoundHours + ' hours before (' + rimasSpeed + 'kts)</li>' );

  //Calculate Distance from Locations Array
	for (var i = 0; i < locations.length; i++)
	{
		var l = locations[i];
		var lat2 = l.L;
		var lon2 = l.N;
		var name = l.Name;

		var d = measureDistance(lat1, lon1, lat2, lon2)

		document.getElementById("rimasDistance").innerHTML += ('<li>' + d.toFixed(0) + 'nm from ' + name + '</li>' );
	}

  //Calculate Distance from Equator
	var d = measureDistance(lat1, lon1, 0, lon1);
	if (lat1 === 0) {
		var ns = "nm (on)";}
		else if (lat1 > 0) {
		var ns = "nm north of"; }
		else if (lat1 < 0) {
		var ns = "nm south of"; }

	document.getElementById("rimasEquator").innerHTML += ( d.toFixed(0) + ns + ' the equator');




	// Google Map
	var mapOptions = {
		zoom: 7,
		center: new google.maps.LatLng(stringLat1, stringLon1),

		// Disables the default Google Maps UI components
		disableDefaultUI: true,
		scrollwheel: false,
		draggable: true,
		minZoom: 2,
		zoomControl: true,


		// Style the map.
		styles: [{
			"featureType": "water",
			"elementType": "geometry",
			"stylers": [{
				"color": "#000000"
			}, {
				"lightness": 17
			}]
		}, {
			"featureType": "landscape",
			"elementType": "geometry",
			"stylers": [{
				"color": "#000000"
			}, {
				"lightness": 30
			}]
		}, {
			"featureType": "road.highway",
			"elementType": "geometry.fill",
			"stylers": [{
				"color": "#000000"
			}, {
				"lightness": 17
			}]
		}, {
			"featureType": "road.highway",
			"elementType": "geometry.stroke",
			"stylers": [{
				"color": "#000000"
			}, {
				"lightness": 29
			}, {
				"weight": 0.2
			}]
		}, {
			"featureType": "road.arterial",
			"elementType": "geometry",
			"stylers": [{
				"color": "#000000"
			}, {
				"lightness": 18
			}]
		}, {
			"featureType": "road.local",
			"elementType": "geometry",
			"stylers": [{
				"color": "#000000"
			}, {
				"lightness": 16
			}]
		}, {
			"featureType": "poi",
			"elementType": "geometry",
			"stylers": [{
				"color": "#000000"
			}, {
				"lightness": 27
			}]
		}, {
			"elementType": "labels.text.stroke",
			"stylers": [{
				"visibility": "on"
			}, {
				"color": "#000000"
			}, {
				"lightness": 16
			}]
		}, {
			"elementType": "labels.text.fill",
			"stylers": [{
				"saturation": 36
			}, {
				"color": "#000000"
			}, {
				"lightness": 60
			}]
		}, {
			"elementType": "labels.icon",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "transit",
			"elementType": "geometry",
			"stylers": [{
				"color": "#000000"
			}, {
				"lightness": 19
			}]
		}, {
			"featureType": "administrative",
			"elementType": "geometry.fill",
			"stylers": [{
				"color": "#000000"
			}, {
				"lightness": 25
			}]
		}, {
			"featureType": "administrative",
			"elementType": "geometry.stroke",
			"stylers": [{
				"color": "#000000"
			}, {
				"lightness": 21
			}, {
				"weight": 1.2
			}]
		}]
	};

	// Get the HTML DOM element that will contain your map
	// We are using a div with id="map" seen below in the <body>
	var mapElement = document.getElementById('map');

	// Create the Google Map using out element and options defined above
	var map = new google.maps.Map(mapElement, mapOptions);

	// Custom Map Marker Icon - Customize the map-marker.png file to customize your icon
	var image = 'img/rimasMap.png';
	var myLatLng = new google.maps.LatLng(stringLat1, stringLon1);
	var beachMarker = new google.maps.Marker({
		position: myLatLng,
		map: map,
		icon: image
	});

	// Draw Plot
	var rimasTrack = new google.maps.Polyline({
		path: trackArray,
		geodesic: true,
		map: map,
		strokeColor: '#219AB3',
		strokeOpacity: 1.0,
		strokeWeight: 1
	});
	rimasTrack.setMap(map);

}
