import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // Import the interaction plugin
import Modal from 'react-modal';
import './Calendar.scss';
import { urlAllTasks } from '../../utils/api-utils'; // Import urlAllTasks function

function Calendar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedHour, setSelectedHour] = useState('12');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedAmPm, setSelectedAmPm] = useState('AM');
  const [selectedTaskName, setSelectedTaskName] = useState(''); // New state variable

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
    openModal(dateClickInfo.date); // Open modal on date click
  };

  const handleConfirmClick = () => {
    console.log('Confirm button clicked');
    setSelectedTaskName(selectedTask); // Add this line
    console.log('Selected Task Name:', selectedTask); // Add this line
    closeModal();
  };

  useEffect(() => {
    // Fetch tasks from your API when the component mounts
    async function fetchTasks() {
      try {
        const response = await fetch(urlAllTasks());
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error('Failed to fetch tasks.');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }

    fetchTasks();
  }, []);

  return (
    <div className={`calendar`}>
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={[
        {
            title: tasks.find(task => task.task_id === selectedTask)?.task_name || '', // Use the selected task name as the event title
            date: selectedDate?.toISOString(),
        },
      ]}
      dateClick={handleDateClick}
    />

      {/* Modal for time and task selection */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Time and Task Selection"
        ariaHideApp={false}
        className="calendar__modal"
        overlayClassName="calendar__modal-overlay"
      >
        {/* Content for your modal */}
        {selectedDate && (
          <div>
            <h2>Select Time and Task for {selectedDate.toDateString()}</h2>
            {/* Add your time and task selection controls here */}
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
            <div className="calendar__task-selection"> {/* Added task selection */}
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