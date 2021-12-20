function showTime() {
	//Check if someone deletes localstorage variables or they are not yet stored. Like the reset function
	if (!isValidDate(localStorage.getItem('virtualDate'))) {
		localStorage.setItem('hourMultiplier', '0');
		localStorage.setItem('dayMultiplier', '0');
		localStorage.setItem('monthMultiplier', '0');
		localStorage.setItem('yearMultiplier', '0');
		localStorage.setItem('minutesMultiplier', '0');
	}

	let virtualDate = new Date();
	virtualDate.setDate(virtualDate.getDate() + parseInt(localStorage.getItem('dayMultiplier')));
	virtualDate.setMonth(virtualDate.getMonth() + parseInt(localStorage.getItem('monthMultiplier')));
	virtualDate.setFullYear(virtualDate.getFullYear() + parseInt(localStorage.getItem('yearMultiplier')));
	virtualDate.setHours(virtualDate.getHours() + parseInt(localStorage.getItem('hourMultiplier')));
	virtualDate.setMinutes(virtualDate.getMinutes() + parseInt(localStorage.getItem('minutesMultiplier')));

	document.getElementById("dayName").innerHTML = dayOfWeek(virtualDate);
	document.getElementById("day").value = datePadding(virtualDate.getDate());
	document.getElementById("month").value = datePadding(virtualDate.getMonth() + 1);
	document.getElementById("year").value = datePadding(virtualDate.getFullYear());
	document.getElementById("hours").value = datePadding(virtualDate.getHours());
	document.getElementById("minutes").value = datePadding(virtualDate.getMinutes());
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

//Takes in input a string like 'YYYY-MM-DD [timePart]' into 'DD/MM/YYYY [timePart]'
function formatDateEuropean(date) {
	const fields = date.split(' ');
	const datePart = fields[0].split('-');
	const time = fields[1];
	const year = datePart[0]
	const month = datePart[1];
	const day = datePart[2];
	return day + '/' + month + '/' + year + ' ' + time;
}

function isValidDate(d) {
	return d instanceof Date && !isNaN.getTime(d);
}

export { showTime, formatDateWithoutSeconds, formatDateEuropean };
