const form = document.querySelector('form');
const eventsDiv = document.querySelector('.events');

let allevents = [];


function saveEvents() {
  localStorage.setItem('events', JSON.stringify(allevents));
}


function loadEvents() {
  const storedEvents = localStorage.getItem('events');
  if (storedEvents) {
    allevents = JSON.parse(storedEvents);
    allevents.forEach(createEventElement);
  }
}


function createEventElement(eventData) {
  let event = document.createElement('div');
  event.className = 'event';

  let eventName = document.createElement('h3');
  eventName.textContent = eventData.name;

  let eventInfo = document.createElement('div');
  eventInfo.className = 'event-info';

  let divOrgan = document.createElement('div');

  let spanBy = document.createElement('span');
  spanBy.textContent = 'By';

  let organName = document.createElement('p');
  organName.textContent = eventData.organizer;

  divOrgan.appendChild(spanBy);
  divOrgan.appendChild(organName);

  let divTime = document.createElement('div');

  let spanOn = document.createElement('span');
  spanOn.textContent = 'On';

  let time = document.createElement('p');
  time.textContent = eventData.date;

  divTime.appendChild(spanOn);
  divTime.appendChild(time);

  const inputDateTime = new Date(eventData.date);

  let divTimeLeft = document.createElement('div');

  let timeLeft = document.createElement('span');
  timeLeft.textContent = 'Time Left';

  let dataLeft = document.createElement('p');
  divTimeLeft.appendChild(timeLeft);
  divTimeLeft.appendChild(dataLeft);

  eventInfo.appendChild(divOrgan);
  eventInfo.appendChild(divTime);
  eventInfo.appendChild(divTimeLeft);

  let delButton = document.createElement('button');
  delButton.className = 'del';
  delButton.textContent = 'Delete';

  event.appendChild(eventName);
  event.appendChild(eventInfo);
  event.appendChild(delButton);

  eventsDiv.appendChild(event);

  function updateTimeLeft() {
    const difference = inputDateTime - new Date();
    let days = 0, hours = 0, minutes = 0, seconds = 0;

    if (difference > 0) {
      days = Math.floor(difference / (1000 * 60 * 60 * 24));
      hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      seconds = Math.floor((difference % (1000 * 60)) / 1000);
      dataLeft.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else {
      dataLeft.textContent = 'Time is over';
      event.classList.add('timeover');
      clearInterval(timerId);
      setTimeout(() => event.remove(), 1500);
      clearInterval(timerId);
      event.remove();
      allevents = allevents.filter(e => e.date !== eventData.date || e.name !== eventData.name); // Remove event from allevents
      saveEvents(); 
    }
  }

  let timerId = setInterval(updateTimeLeft, 1000);

  delButton.addEventListener('click', () => {
    clearInterval(timerId);
    event.remove();
    allevents = allevents.filter(e => e.date !== eventData.date || e.name !== eventData.name); // Remove event from allevents
    saveEvents(); 
  });
}


loadEvents();

form.addEventListener('submit', (e) => {
  e.preventDefault();

  let hasError = false;

  const inputEventName = document.querySelector('#event-name');
  const inputEventOrgan = document.querySelector('#event-organizer');
  const inputDate = document.querySelector('#event-date');

  if (!inputEventName.value) {
    inputEventName.classList.add('error');
    hasError = true;
  } else {
    inputEventName.classList.remove('error');
    hasError = false;
  }

  if (!inputEventOrgan.value) {
    inputEventOrgan.classList.add('error');
    hasError = true;
  } else {
    inputEventOrgan.classList.remove('error');
    hasError = false;
  }

  if (!inputDate.value) {
    inputDate.classList.add('error');
    hasError = true;
  } else {
    inputDate.classList.remove('error');
    hasError = false;
  }

  if (!hasError) {
    const eventData = {
      name: inputEventName.value,
      organizer: inputEventOrgan.value,
      date: inputDate.value
    };

    allevents.push(eventData);
    saveEvents(); 

    
    createEventElement(eventData);

    inputEventName.value = '';
    inputEventOrgan.value = '';
    inputDate.value = '';
  }
});
