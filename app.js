
let url = 'https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/users';


async function getUsers() {
    let resU = await fetch(url);
    let data1 = await resU.json();
    console.log(data1); 
    showU(data1);   
   
}
getUsers();


let url2 = 'https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/tasks';


async function getTasks() {
    let resT = await fetch(url2);
    let data2 = await resT.json();
    console.log(data2);    
   
}
getTasks();


const newText = document.querySelector('.empty');

function showU(data1) {
    newText.textContent = data1[2].text;
}

function onDragStart(event) {
    event
      .dataTransfer
      .setData('text/plain', event.target.id);
  
    event
      .currentTarget
      .style
      .backgroundColor = 'yellow';
  }


function onDragOver(event) {
    event.preventDefault();
  }
 
  
function onDrop(event) {
    const id = event
      .dataTransfer
      .getData('text');
    const draggableElement = document.getElementById(id);
    const dropzone = event.target;
    dropzone.appendChild(draggableElement);
    event
    .dataTransfer
    .clearData();
}
  
//

let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const calendar = document.getElementById('calendar');

function openModal(date) {
    clicked = date;
  
    const eventForDay = events.find(e => e.date === clicked);
  
    if (eventForDay) {
        document.getElementById('eventText').innerText = eventForDay.title;
        deleteEventModal.style.display = 'block';
    } else {
      newEventModal.style.display = 'block';
    }
  
    backDrop.style.display = 'block';
  }



function load() {
    const dt = new Date();
    
    if (nav !== 0) {
        dt.setMonth(new Date().getMonth() + nav);
      }

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dateString = firstDayOfMonth.toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

    document.getElementById('monthDisplay').innerText = 
    `${dt.toLocaleDateString('en-GB', { month: 'long' })} ${year}`;
    
    calendar.innerHTML = '';

    for(let i = 1; i <= paddingDays + daysInMonth; i++) {
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');

        const dayString = `${month + 1}/${i - paddingDays}/${year}`;

        if (i > paddingDays) {
            daySquare.innerText = i - paddingDays;
            const eventForDay = events.find(e => e.date === dayString);

            if (i - paddingDays === day && nav === 0) {
                daySquare.id = 'currentDay';
              }

            if (eventForDay) {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = eventForDay.title;
                daySquare.appendChild(eventDiv);
              }


            daySquare.addEventListener('click', () => openModal(dayString));
        } else {
            daySquare.classList.add('padding');
        }
        calendar.appendChild(daySquare); 
    }

}

function closeModal() {
    eventTitleInput.classList.remove('error');
    newEventModal.style.display = 'none';
    deleteEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    eventTitleInput.value = '';
    clicked = null;
    load();
}

function saveEvent() {
    if (eventTitleInput.value) {
      eventTitleInput.classList.remove('error');
  
      events.push({
        date: clicked,
        title: eventTitleInput.value,
      });
  
      localStorage.setItem('events', JSON.stringify(events));
      closeModal();
    } else {
      eventTitleInput.classList.add('error');
    }
}

function deleteEvent() {
    events = events.filter(e => e.date !== clicked);
    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
  }

function initButtons() {
    document.getElementById('nextButton').addEventListener('click', () => {
      nav++;
      load();
    });
  
    document.getElementById('backButton').addEventListener('click', () => {
      nav--;
      load();
    });
    document.getElementById('saveButton').addEventListener('click', saveEvent);
    document.getElementById('cancelButton').addEventListener('click', closeModal);
    document.getElementById('deleteButton').addEventListener('click', deleteEvent);
    document.getElementById('closeButton').addEventListener('click', closeModal);
  }


initButtons();
load();