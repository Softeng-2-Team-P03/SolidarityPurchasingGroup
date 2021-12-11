
function showTime() {

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

function formatDateWithoutSeconds(date) {
	var datePart = [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(datePadding);
	var timePart = [date.getHours(), date.getMinutes()].map(datePadding);

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

export { showTime, formatDateWithoutSeconds };