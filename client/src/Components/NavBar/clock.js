
function showTime() {
			let time = new Date();
			let hour = time.getHours();
			hour=hour+parseInt(localStorage.getItem('hourMultiplier'));
			let min = time.getMinutes();
			let sec = time.getSeconds();;
			let weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
			let day=time.getDay()+parseInt(localStorage.getItem('dayMultiplier'));
			if(day>7)
				day=day-7;
			if(day<0)
				day=0;
			let today=weekDay[day];

			if(hour>=24){
				hour=hour-24;
				if(day===7)
					today=weekDay[0];
				else
					today=weekDay[day+1];
			}

			hour = (hour < 10) ? "0" + hour : hour;
			min = (min < 10) ? "0" + min : min;
			sec = (sec < 10) ? "0" + sec : sec;


			let currentTime = hour + ":"+ min + ":" + sec ;
			document.getElementById("clock").innerHTML = today + " " + currentTime;
		}

export {showTime};