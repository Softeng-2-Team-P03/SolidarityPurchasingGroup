
function showTime() {
	/* SORRY LUCA ):
	let time = new Date();
	let hour = time.getHours();
	hour = (hour + parseInt(localStorage.getItem('hourMultiplier'))) % 24;
	let min = time.getMinutes();
	min = min + parseInt(localStorage.getItem('minutesMultiplier'));
	let sec = time.getSeconds();;
	let weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
	let day = time.getDay() + parseInt(localStorage.getItem('dayMultiplier'));

	hour = (hour < 0) ? (hour % 24 + 24) % 24 : hour;
	hour = (hour < 10) ? "0" + hour : hour;
	min = (min < 0) ? (min % 60 + 60) % 60 : min;
	min = (min < 10) ? "0" + min : min;
	sec = (sec < 10) ? "0" + sec : sec;

	let today = weekDay[(day % 7 + 7) % 7];
	let currentTime = hour + ":" + min + ":" + sec;*/

	let virtualDate = new Date();
	virtualDate.setDate(virtualDate.getDate() + parseInt(localStorage.getItem('dayMultiplier')));
	virtualDate.setHours(virtualDate.getHours() + parseInt(localStorage.getItem('hourMultiplier')));
	virtualDate.setMinutes(virtualDate.getMinutes() + parseInt(localStorage.getItem('minutesMultiplier')));

	document.getElementById("dayName").innerHTML = dayOfWeek(virtualDate);
	document.getElementById("day").innerHTML = datePadding(virtualDate.getDate());
	document.getElementById("month").innerHTML = datePadding(virtualDate.getMonth() + 1);
	document.getElementById("year").innerHTML = datePadding(virtualDate.getFullYear());
	document.getElementById("hours").innerHTML = datePadding(virtualDate.getHours());
	document.getElementById("minutes").innerHTML = datePadding(virtualDate.getMinutes());
	document.getElementById("seconds").innerHTML = datePadding(virtualDate.getSeconds());

	localStorage.setItem("virtualDate", virtualDate);
	localStorage.setItem("virtualDateToStringWithTime", formatDateWithTime(virtualDate));
	localStorage.setItem("virtualDateToString", formatDate(virtualDate));
}

function datePadding(value) {
	var format = String(value);
	return format.length < 2 ? '0' + format : format;
}

function formatDateWithTime(date) {
	var datePart = [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(datePadding);
	var timePart = [date.getHours(), date.getMinutes(), date.getSeconds()].map(datePadding);

	return datePart.join('-') + ' ' + timePart.join(':');
}

function formatDate(date) {
	var datePart = [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(datePadding);

	return datePart.join('-');
}

function dayOfWeek(date) {
	var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	return days[date.getDay()];
}

export { showTime };