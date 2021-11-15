
function showTime() {
			let time = new Date();
			let hour = time.getHours();
			hour=(hour+parseInt(localStorage.getItem('hourMultiplier')))%24;
			let min = time.getMinutes();
			min=min+parseInt(localStorage.getItem('minutesMultiplier'));
			let sec = time.getSeconds();;
			let weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
			let day=time.getDay()+parseInt(localStorage.getItem('dayMultiplier'));

			hour = (hour < 0) ? (hour%24+24)%24 : hour;
			hour = (hour < 10) ? "0" + hour : hour;
			min = (min < 0) ? (min%60+60)%60 : min;
			min = (min < 10) ? "0" + min : min;
			sec = (sec < 10) ? "0" + sec : sec;
			
			let today=weekDay[(day % 7 + 7) % 7];
			let currentTime = hour + ":"+ min + ":" + sec ;
			document.getElementById("clock").innerHTML = currentTime;
			document.getElementById("day").innerHTML = today ;
		}

export {showTime};