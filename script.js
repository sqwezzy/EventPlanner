
const yearDiv = document.getElementById('year');
const yearNext = document.getElementById('yearNext');
const yearPrevious = document.getElementById('yearPrevious');
const dialog = document.querySelector('dialog');
const monthDiv = document.getElementById('month');
const table = document.getElementById('num-dates');
const dayNow = document.getElementById('dateDayNow');
const nameDay = document.getElementById('nameDay');
const eventList = document.getElementById('eventList');
const eventName = document.getElementById('eventName');
const timeEvent = document.getElementById('eventTime');
const btnAdd = document.getElementById('btnAdd');
const date = new Date();
let year = new Date().getFullYear();
let month = new Date().getMonth();
yearDiv.innerHTML = year;
dayNow.innerHTML = date.getDate();
yearNext.addEventListener('click', getNextYear);
yearPrevious.addEventListener('click', getPreviousYear);
btnAdd.addEventListener('click', createEvent);
const namesOfDay = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const numDates = document.getElementsByClassName('num-dates');
nameDay.innerHTML = namesOfDay[date.getDay()];
document.querySelector('#closeDialog').onclick = function () {
    dialog.close(); // Прячем диалоговое окно
};

showDayOfMonth(table, calendarAddition(getMonthCalendar(month + 1, year), month + 1, year));

window.onload = () => localStorage.clear();

function clear() {
    while (table.firstChild)
        table.removeChild(table.firstChild)
}

function transpose(array) {
    return array[0].map((col, i) => array.map(row => row[i]));
}

function createEvent() {
    const name = eventName.value;
    const time = timeEvent.value;

    const tempYear = 2019;
    const tempMonth = 11;
    const tempDay = 13;
    const tempHour = 11;
    const tempMinute = 39;
    const key = `${tempDay}/${tempMonth}/${tempYear}`;
    const data = { [key]: value };
    const dataToSend = JSON.stringify(data);


    let dataRecieved = "";
    fetch("https://jsonstorage.net/api/items/e964d3ce-cd78-4903-a325-5ff4b737d3a3", {
        method: "post",
        body: dataToSend
    })
        .then(resp => {
            if (resp.status == 200) {
                return resp.json()
            } else {
                console.log("Status: " + resp.status);
                return Promise.reject("server")
            }
        })
        .then(dataJson => {
            dataToRecieved = JSON.parse(dataJson);
        })
        .catch(err => {
            if (err == "server") return
            console.log(err);
        })


    if (localStorage.getItem(name) === time) {
        dialog.show();
    }
    if (name && time) {
        localStorage.setItem(name, time);
    }
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        let li = document.createElement('li');
        li.innerHTML += `${key} : ${value}<br/>`;
        eventList.appendChild(li);
    }

}

function showDayOfMonth(table, calendar) {
    clear();
    let newCalendar = transpose(calendar);
    for (let i = 0; i < newCalendar.length; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < newCalendar[i].length; j++) {
            let td = document.createElement('td');
            td.innerHTML = newCalendar[i][j];
            tr.appendChild(td)
        }
        table.appendChild(tr)
    }
}


function getPreviousYear() {
    year -= 1;
    yearDiv.innerHTML = year;
    showDayOfMonth(table, calendarAddition(getMonthCalendar(month + 1, year), month + 1, year))
}

function getNextYear() {
    year += 1;
    yearDiv.innerHTML = year;
    showDayOfMonth(table, calendarAddition(getMonthCalendar(month + 1, year), month + 1, year))
}

function firstDateOfDay(numberOfDay, month, year) {
    const firstDayOfMonth = new Date(`${month}/1/${year}`).getDay();
    const result = 8 - (firstDayOfMonth - numberOfDay);
    return result > 7 ? result - 7 : result;
}

function numberOfDays(month, year) {
    return new Date(year, month, 0).getDate();
}

function getMonthCalendar(month, year) {
    const calendar = [];
    const countOfDays = numberOfDays(month, year);
    for (let i = 0; i < 7; i++) {
        calendar.push([]);
        for (let date = firstDateOfDay(i + 1, month, year); date <= countOfDays; date += 7) {
            calendar[i].push(date);
        }
    }
    return calendar;
}

function getPreviousMonth(month, year) {
    return month > 1 ? [month - 1, year] : [12, year - 1];
}

function getNextMonth(month, year) {
    return month < 12 ? [month + 1, year] : [1, year + 1];
}

function calendarAddition(calendar, month, year) {
    const firstDayIndex = calendar.findIndex(element => element[0] === 1);
    const prevMonth = getPreviousMonth(month, year);
    let numberOfDaysInPreviousMonth = numberOfDays(prevMonth[0], prevMonth[1]);
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        calendar[i].unshift(numberOfDaysInPreviousMonth);
        numberOfDaysInPreviousMonth--;
    }
    const countOfDays = numberOfDays(month, year);
    const lastDayIndex = calendar.findIndex(element => element[element.length - 1] === countOfDays)
    let nextDay = 1;
    for (let i = lastDayIndex + 1; i <= 6; i++) {
        calendar[i].push(nextDay);
        nextDay++;
    }
    return calendar;
}