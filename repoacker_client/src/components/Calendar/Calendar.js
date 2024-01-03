import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';
import './Calendar.scss';
import { urlAllTasks } from '../../utils/api-utils';

function Calendar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedHour, setSelectedHour] = useState('12');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedAmPm, setSelectedAmPm] = useState('AM');
  const [calendarEvents, setCalendarEvents] = useState([]);
  const selectedTaskId = parseInt(selectedTask, 10);
  const selectedTaskObject = tasks.find((task) => task.task_id === selectedTaskId);
  const openModal = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDate(null);
    setIsModalOpen(false);
    setSelectedTask('');
    setSelectedHour('12');
    setSelectedMinute('00');
    setSelectedAmPm('AM');
  };

  const handleDateClick = (dateClickInfo) => {
    openModal(dateClickInfo.date);
  };

  const handleConfirmClick = () => {
    console.log('Confirm button clicked');
    console.log('Selected Task:', selectedTask);
  
    if (selectedTask) {
      const selectedTaskId = parseInt(selectedTask, 10);
      const selectedTaskObject = tasks.find((task) => task.task_id === selectedTaskId);
  
      if (selectedTaskObject) {
        // Create a new Date object for the selected time
        const selectedTime = new Date(selectedDate);
        selectedTime.setHours(selectedAmPm === 'PM' ? parseInt(selectedHour, 10) + 12 : parseInt(selectedHour, 10));
        selectedTime.setMinutes(parseInt(selectedMinute, 10));
  
        // Format the time as HH:MM AM/PM
        const formattedTime = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
        // Calculate the task duration in days
        const taskDurationInDays = Math.ceil((new Date(selectedTaskObject.task_deadline) - selectedTime) / (24 * 60 * 60 * 1000));
  
        // Create an array of events for each day of the task duration
        const taskEvents = Array.from({ length: taskDurationInDays }, (_, index) => {
          const currentDay = new Date(selectedTime);
          currentDay.setDate(currentDay.getDate() + index);
  
          const eventTitle =
            index === 0
              ? `${selectedTaskObject.task_description}; ${selectedTaskObject.task_start_date} to ${selectedTaskObject.task_deadline}`
              : '';
  
          return {
            title: eventTitle,
            start: currentDay.toISOString(),
          };
        });
  
        setCalendarEvents([...calendarEvents, ...taskEvents]);
        closeModal();
      } else {
        console.error('Selected task not found in tasks list.');
      }
    } else {
      alert('Please select a task before confirming.');
    }
  };
  
  

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch(urlAllTasks());
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
  
          // Extracting events for the calendar with different colors for each task
          const events = data.map((task) => ({
            title: `${task.task_description}; ${task.task_start_date} to ${task.task_deadline}`,
            start: task.task_start_date, // Assuming task_start_date is a valid date format
            end: task.task_deadline, // Assuming task_deadline is a valid date format
            color: getRandomColor(), // Assign a color to each task
          }));
  
          setCalendarEvents(events);
        } else {
          console.error('Failed to fetch tasks.');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }
  
    fetchTasks();
  }, []);
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  return (
    <div className={`calendar`}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={calendarEvents}
        dateClick={handleDateClick}
      />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Time and Task Selection"
        ariaHideApp={false}
        className="calendar__modal"
        overlayClassName="calendar__modal-overlay"
      >
        {selectedDate && (
          <div>
            <h2>Select Time and Task for {selectedDate.toDateString()}</h2>
            <div className="calendar__time-selection">
              <label htmlFor="hour">Hour:</label>
              <select
                id="hour"
                value={selectedHour}
                onChange={(e) => setSelectedHour(e.target.value)}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                  <option key={hour} value={hour.toString().padStart(2, '0')}>
                    {hour.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
              <label htmlFor="minute">Minute:</label>
              <select
                id="minute"
                value={selectedMinute}
                onChange={(e) => setSelectedMinute(e.target.value)}
              >
                {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>
              <label htmlFor="ampm">AM/PM:</label>
              <select
                id="ampm"
                value={selectedAmPm}
                onChange={(e) => setSelectedAmPm(e.target.value)}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
            <div className="calendar__task-selection">
              <label htmlFor="task">Task:</label>
              <select
                id="task"
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
              >
                <option value="">Select a task</option>
                {tasks.map((task) => (
                  <option key={task.task_id} value={task.task_id}>
                    {task.task_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="calendar__button-container">
              <button className="calendar__confirm-button" onClick={handleConfirmClick}>
                Confirm
              </button>
              <button className="calendar__cancel-button" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Calendar;