
function showTime() {
			let time = new Date();
			let hour = time.getHours();
			let min = time.getMinutes();
			let sec = time.getSeconds();;
			let weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    		let today = weekDay[time.getDay()];

			hour = (hour < 10) ? "0" + hour : hour;
			min = (min < 10) ? "0" + min : min;
			sec = (sec < 10) ? "0" + sec : sec;


			let currentTime = hour + ":"+ min + ":" + sec ;
			document.getElementById("clock").innerHTML = today + " " + currentTime;
		}

export {showTime};