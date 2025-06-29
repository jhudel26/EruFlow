// Calendar Application
class CalendarApp {
    constructor() {
        this.currentDate = new Date();
        this.currentMonth = this.currentDate.getMonth();
        this.currentYear = this.currentDate.getFullYear();
        this.tasks = JSON.parse(localStorage.getItem('calendarTasks')) || [];
        this.currentView = 'calendar';
        this.editingTaskId = null;
        
        this.initializeApp();
        this.setupEventListeners();
        this.renderCalendar();
        this.updateDisplay();
        this.setupPWA();
    }

    initializeApp() {
        // Set current date display
        const today = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        document.getElementById('currentDate').textContent = today.toLocaleDateString('en-US', options);
        document.getElementById('todayDate').textContent = today.toLocaleDateString('en-US', options);
        
        // Update header with current month
        this.updateHeaderMonth();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.switchView(e.target.closest('.nav-item').dataset.view);
            });
        });

        // Calendar navigation
        document.getElementById('prevMonth').addEventListener('click', () => this.previousMonth());
        document.getElementById('nextMonth').addEventListener('click', () => this.nextMonth());
        document.getElementById('todayBtn').addEventListener('click', () => this.goToToday());

        // Task management
        document.getElementById('addTaskBtn').addEventListener('click', () => this.openTaskModal());
        document.getElementById('taskForm').addEventListener('submit', (e) => this.handleTaskSubmit(e));
        document.getElementById('closeModal').addEventListener('click', () => this.closeTaskModal());
        document.getElementById('cancelTask').addEventListener('click', () => this.closeTaskModal());

        // Task filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterTasks(e.target.dataset.filter);
            });
        });

        // Install prompt
        document.getElementById('installBtn').addEventListener('click', () => this.showInstallChoiceModal());
        document.getElementById('dismissInstall').addEventListener('click', () => this.dismissInstallPrompt());

        // Install choice modal
        document.getElementById('closeInstallModal').addEventListener('click', () => this.closeInstallChoiceModal());
        document.getElementById('installPWA').addEventListener('click', () => this.installApp());
        document.getElementById('downloadNative').addEventListener('click', () => this.downloadNativeInstaller());

        // Modal overlay click to close
        document.getElementById('taskModal').addEventListener('click', (e) => {
            if (e.target.id === 'taskModal') {
                this.closeTaskModal();
            }
        });

        document.getElementById('installChoiceModal').addEventListener('click', (e) => {
            if (e.target.id === 'installChoiceModal') {
                this.closeInstallChoiceModal();
            }
        });

        // Repeat options logic
        const repeatSelect = document.getElementById('taskRepeat');
        const taskDateInput = document.getElementById('taskDate');

        repeatSelect.addEventListener('change', () => this.updateRepeatUI());
        taskDateInput.addEventListener('change', () => this.updateRepeatUI());
    }

    updateRepeatUI() {
        const repeatSelect = document.getElementById('taskRepeat');
        const monthlyOptions = document.getElementById('monthlyRepeatOptions');
        const weeklyInfo = document.getElementById('weeklyRepeatInfo');
        const weeklyDay = document.getElementById('weeklyRepeatDay');
        const taskDateInput = document.getElementById('taskDate');
        const monthlyWeekday = document.getElementById('monthlyWeekday');
        
        const repeat = repeatSelect.value;
        
        // Hide all repeat-specific options first
        monthlyOptions.classList.add('hidden');
        weeklyInfo.classList.add('hidden');
        
        // Show only the relevant options based on selection
        if (repeat === 'monthly') {
            monthlyOptions.classList.remove('hidden');
            // Auto-set the weekday based on the selected date
            const date = new Date(taskDateInput.value || new Date());
            monthlyWeekday.value = date.getDay();
        } else if (repeat === 'weekly') {
            weeklyInfo.classList.remove('hidden');
            const date = new Date(taskDateInput.value || new Date());
            weeklyDay.textContent = date.toLocaleDateString('en-US', { weekday: 'long' });
        }
        // For 'none', 'daily', and 'yearly', no additional options are shown
    }

    switchView(view) {
        this.currentView = view;
        
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');

        // Hide all views
        document.querySelectorAll('.view-container').forEach(container => {
            container.classList.add('hidden');
        });

        // Show selected view
        document.getElementById(`${view}View`).classList.remove('hidden');

        // Update header
        const titles = {
            calendar: 'Calendar',
            tasks: 'All Tasks',
            today: "Today's Tasks"
        };
        document.getElementById('currentViewTitle').textContent = titles[view];

        // Render appropriate content
        switch(view) {
            case 'calendar':
                this.renderCalendar();
                break;
            case 'tasks':
                this.renderTasks();
                break;
            case 'today':
                this.renderTodayTasks();
                break;
        }
    }

    renderCalendar() {
        const calendarBody = document.getElementById('calendarBody');
        calendarBody.innerHTML = '';

        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const today = new Date();
        const isToday = (date) => {
            return date.getDate() === today.getDate() &&
                   date.getMonth() === today.getMonth() &&
                   date.getFullYear() === today.getFullYear();
        };

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;

            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            if (date.getMonth() !== this.currentMonth) {
                dayElement.classList.add('other-month');
            }
            
            if (isToday(date)) {
                dayElement.classList.add('today');
            }

            // Get tasks for this date (including repeated tasks)
            const dayTasks = this.getTasksForDate(date).map(task => {
                // For repeated tasks, check if completed for this date
                if (task.repeat && task.repeat !== 'none') {
                    return {
                        ...task,
                        completed: Array.isArray(task.completedDates) && task.completedDates.includes(dateString)
                    };
                }
                return task;
            });
            if (dayTasks.length > 0) {
                dayElement.classList.add('has-tasks');
            }

            dayElement.innerHTML = `
                <div class="day-number">${date.getDate()}</div>
                <div class="day-tasks">
                    ${dayTasks.length > 0 ? `<div class="task-indicator">${dayTasks.length} task${dayTasks.length > 1 ? 's' : ''}</div>` : ''}
                    ${dayTasks.slice(0, 2).map(task => `
                        <div class="calendar-task ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                            <span class="category-dot ${task.category}"></span>
                            ${task.repeat && task.repeat !== 'none' ? `<span class='repeat-icon' title='Repeating Task'>${this.getRepeatSVG()}</span>` : ''}
                            <span class="task-dot priority-${task.priority}"></span>
                            <span class="task-title">${task.title}</span>
                            <button class="task-action-btn${task.completed ? ' completed' : ''}" onclick="app.toggleTaskComplete('${task.id}', '${dateString || task.date}')">
                                <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                            </button>
                        </div>
                    `).join('')}
                    ${dayTasks.length > 2 ? `<div class="more-tasks">+${dayTasks.length - 2} more</div>` : ''}
                </div>
            `;

            // Add click event for date selection
            dayElement.addEventListener('click', (e) => {
                // Don't trigger if clicking on a task or button
                if (!e.target.closest('.calendar-task')) {
                    this.selectDate(date);
                }
            });

            // Add click events for tasks (for edit modal)
            dayElement.querySelectorAll('.calendar-task .task-title').forEach(taskTitleElement => {
                taskTitleElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const taskId = taskTitleElement.closest('.calendar-task').dataset.taskId;
                    this.openTaskModal(taskId);
                });
            });

            calendarBody.appendChild(dayElement);
        }
    }

    previousMonth() {
        this.currentMonth--;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.updateHeaderMonth();
        this.renderCalendar();
    }

    nextMonth() {
        this.currentMonth++;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        this.updateHeaderMonth();
        this.renderCalendar();
    }

    goToToday() {
        this.currentMonth = this.currentDate.getMonth();
        this.currentYear = this.currentDate.getFullYear();
        this.updateHeaderMonth();
        this.renderCalendar();
    }

    selectDate(date) {
        // Set the selected date in the task modal using local date format
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        document.getElementById('taskDate').value = dateString;
        this.openTaskModal();
    }

    openTaskModal(taskId = null) {
        this.editingTaskId = taskId;
        const modal = document.getElementById('taskModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('taskForm');

        if (taskId) {
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                modalTitle.textContent = 'Edit Task';
                this.populateTaskForm(task);
            }
        } else {
            modalTitle.textContent = 'Add New Task';
            
            // Store the current date value before reset
            const selectedDate = document.getElementById('taskDate').value;
            
            form.reset();
            
            // Restore the selected date if it was set, otherwise use today
            if (selectedDate) {
                document.getElementById('taskDate').value = selectedDate;
            } else {
                // Use local date format for today
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                document.getElementById('taskDate').value = `${year}-${month}-${day}`;
            }
            
            // Set default repeat options
            document.getElementById('taskRepeat').value = 'none';
            document.getElementById('monthlyWeek').value = '1';
            document.getElementById('monthlyWeekday').value = new Date().getDay();
        }

        modal.classList.add('active');
        
        // Update repeat UI after populating the form
        this.updateRepeatUI();
    }

    closeTaskModal() {
        document.getElementById('taskModal').classList.remove('active');
        this.editingTaskId = null;
    }

    populateTaskForm(task) {
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description || '';
        document.getElementById('taskDate').value = task.date;
        document.getElementById('taskTime').value = task.time || '';
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskCategory').value = task.category;
        document.getElementById('taskRepeat').value = task.repeat || 'none';
        document.getElementById('monthlyWeek').value = task.monthlyWeek || '1';
        document.getElementById('monthlyWeekday').value = task.monthlyWeekday || new Date(task.date).getDay();
        
        // Update repeat UI after populating the form
        this.updateRepeatUI();
    }

    handleTaskSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const taskData = {
            title: formData.get('taskTitle') || document.getElementById('taskTitle').value,
            description: formData.get('taskDescription') || document.getElementById('taskDescription').value,
            date: formData.get('taskDate') || document.getElementById('taskDate').value,
            time: formData.get('taskTime') || document.getElementById('taskTime').value,
            priority: formData.get('taskPriority') || document.getElementById('taskPriority').value,
            category: formData.get('taskCategory') || document.getElementById('taskCategory').value,
            completed: false,
            createdAt: new Date().toISOString()
        };

        const repeat = document.getElementById('taskRepeat').value;
        const monthlyWeek = document.getElementById('monthlyWeek').value;
        const monthlyWeekday = document.getElementById('monthlyWeekday').value;
        const taskObj = {
            ...taskData,
            repeat,
            monthlyWeek: repeat === 'monthly' ? monthlyWeek : undefined,
            monthlyWeekday: repeat === 'monthly' ? monthlyWeekday : undefined
        };

        if (this.editingTaskId) {
            // Update existing task
            const index = this.tasks.findIndex(t => t.id === this.editingTaskId);
            if (index !== -1) {
                this.tasks[index] = { ...this.tasks[index], ...taskObj };
            }
        } else {
            // Add new task
            taskObj.id = Date.now().toString();
            this.tasks.push(taskObj);
        }

        this.saveTasks();
        this.closeTaskModal();
        this.updateDisplay();
    }

    renderTodayTasks() {
        const todayTasks = document.getElementById('todayTasks');
        todayTasks.innerHTML = '';

        // Use local date format for today
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayString = `${year}-${month}-${day}`;
        
        // For repeated tasks, check if completed for today
        const todayTaskList = this.tasks.filter(task => task.date === todayString || (task.repeat && task.repeat !== 'none')).map(task => {
            if (task.repeat && task.repeat !== 'none') {
                return {
                    ...task,
                    completed: Array.isArray(task.completedDates) && task.completedDates.includes(todayString)
                };
            }
            return task;
        }).filter(task => {
            // Only show tasks that are due today (including repeats)
            if (task.repeat && task.repeat !== 'none') {
                // Use getTasksForDate logic to check if this task should appear today
                return this.getTasksForDate(today).some(t => t.id === task.id);
            }
            return task.date === todayString;
        });

        if (todayTaskList.length === 0) {
            todayTasks.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No tasks for today.</p>';
            return;
        }

        todayTaskList.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }).forEach(task => {
            const taskElement = this.createTaskElement(task, todayString);
            todayTasks.appendChild(taskElement);
        });
    }

    renderTasks(filter = 'all') {
        const tasksList = document.getElementById('tasksList');
        tasksList.innerHTML = '';

        // Get today's date string
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayString = `${year}-${month}-${day}`;

        let filteredTasks = this.tasks.map(task => {
            // For repeated tasks, show as completed if completedDates is non-empty
            if (task.repeat && task.repeat !== 'none') {
                return {
                    ...task,
                    completed: Array.isArray(task.completedDates) && task.completedDates.length > 0
                };
            }
            return task;
        });
        
        // Apply filter based on completion status
        switch(filter) {
            case 'pending':
                filteredTasks = filteredTasks.filter(task => !task.completed);
                break;
            case 'completed':
                filteredTasks = filteredTasks.filter(task => task.completed);
                break;
        }

        if (filteredTasks.length === 0) {
            tasksList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No tasks found.</p>';
            return;
        }

        filteredTasks.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(task => {
            const taskElement = this.createTaskElement(task, todayString);
            tasksList.appendChild(taskElement);
        });
    }

    createTaskElement(task, dateString = null) {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.dataset.taskId = task.id;
        const date = new Date(task.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
        const repeatInfo = task.repeat && task.repeat !== 'none' ? 
            `<span class="repeat-badge">${this.getRepeatSVG()}${task.repeat}</span>` : '';
        // Category icon (FontAwesome or emoji)
        const categoryIcons = {
            work: '<i class="fas fa-briefcase"></i>',
            personal: '<i class="fas fa-user"></i>',
            health: '<i class="fas fa-heartbeat"></i>',
            shopping: '<i class="fas fa-shopping-cart"></i>',
            other: '<i class="fas fa-asterisk"></i>'
        };
        const categoryIcon = `<span class='category-dot ${task.category}' title='${task.category}'>${categoryIcons[task.category] || ''}</span>`;
        taskElement.innerHTML = `
            <div class="task-header">
                <div class="task-title">${categoryIcon} ${task.title}</div>
                <div class="task-actions">
                    <button class="task-action-btn${task.completed ? ' completed' : ''}" onclick="app.toggleTaskComplete('${task.id}', '${dateString || task.date}')">
                        <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                    </button>
                    <button class="task-action-btn" aria-label="Edit task" onclick="app.editTask('${task.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="task-action-btn" aria-label="Delete task" onclick="app.deleteTask('${task.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
            <div class="task-details">
                <span class="task-priority ${task.priority}">${task.priority}</span>
                <span>${task.category}</span>
                <span>${formattedDate}</span>
                ${task.time ? `<span>${task.time}</span>` : ''}
                ${repeatInfo}
            </div>
        `;
        return taskElement;
    }

    toggleTaskComplete(taskId, dateString = null) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        // If the task is repeating, toggle completion for the specific date
        if (task.repeat && task.repeat !== 'none') {
            if (!task.completedDates) task.completedDates = [];
            // Use the provided dateString or today's date
            if (!dateString) {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                dateString = `${year}-${month}-${day}`;
            }
            const idx = task.completedDates.indexOf(dateString);
            if (idx === -1) {
                task.completedDates.push(dateString);
            } else {
                task.completedDates.splice(idx, 1);
            }
        } else {
            // Non-repeating: toggle the completed boolean
            task.completed = !task.completed;
        }
        this.saveTasks();
        this.updateDisplay();
    }

    editTask(taskId) {
        this.openTaskModal(taskId);
    }

    async deleteTask(taskId) {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this task?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6366f1',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });
        if (result.isConfirmed) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveTasks();
            this.updateDisplay();
            Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
        }
    }

    filterTasks(filter) {
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        this.renderTasks(filter);
    }

    getTasksForDate(date) {
        // Use local date format instead of ISO string
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        
        const weekday = date.getDay();
        
        return this.tasks.filter(task => {
            if (task.date === dateString) return true;
            
            if (task.repeat === 'daily') {
                // Repeat every day from start date
                const taskDate = new Date(task.date);
                return date >= taskDate;
            }
            
            if (task.repeat === 'weekly') {
                // Repeat on same weekday
                const taskDate = new Date(task.date);
                return taskDate.getDay() === weekday && date >= taskDate;
            }
            
            if (task.repeat === 'monthly') {
                // Repeat on nth weekday of month
                const taskDate = new Date(task.date);
                if (date < taskDate) return false;
                
                const targetWeekday = parseInt(task.monthlyWeekday);
                if (weekday !== targetWeekday) return false;
                
                const weekOfMonth = Math.ceil(date.getDate() / 7);
                const lastWeek = Math.ceil(new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() / 7);
                
                if (task.monthlyWeek === 'last') {
                    return weekOfMonth === lastWeek;
                } else {
                    const targetWeek = parseInt(task.monthlyWeek);
                    return weekOfMonth === targetWeek;
                }
            }
            
            if (task.repeat === 'yearly') {
                // Repeat on same month and day
                const taskDate = new Date(task.date);
                return taskDate.getDate() === date.getDate() && 
                       taskDate.getMonth() === date.getMonth() && 
                       date >= taskDate;
            }
            
            return false;
        });
    }

    saveTasks() {
        localStorage.setItem('calendarTasks', JSON.stringify(this.tasks));
    }

    updateDisplay() {
        if (this.currentView === 'calendar') {
            this.renderCalendar();
        } else if (this.currentView === 'tasks') {
            this.renderTasks();
        } else if (this.currentView === 'today') {
            this.renderTodayTasks();
        }
    }

    setupPWA() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        }

        // Install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            document.getElementById('installPrompt').classList.add('show');
        });

        window.addEventListener('appinstalled', () => {
            document.getElementById('installPrompt').classList.remove('show');
            this.deferredPrompt = null;
        });
    }

    showInstallChoiceModal() {
        document.getElementById('installChoiceModal').classList.add('active');
    }

    dismissInstallPrompt() {
        document.getElementById('installPrompt').classList.remove('show');
    }

    closeInstallChoiceModal() {
        document.getElementById('installChoiceModal').classList.remove('active');
    }

    installApp() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            this.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                this.deferredPrompt = null;
                this.closeInstallChoiceModal();
            });
        } else {
            // Fallback if PWA install is not available
            Swal.fire({
                title: 'PWA Install Not Available',
                text: 'Your browser doesn\'t support PWA installation or the app is already installed.',
                icon: 'info',
                confirmButtonColor: '#6366f1'
            });
            this.closeInstallChoiceModal();
        }
    }

    downloadNativeInstaller() {
        // Open the Dropbox link in a new tab to download the installer
        window.open('https://www.dropbox.com/scl/fi/0a4f6o2zh7qntq5b0jg5m/EruFlow-Setup-1.0.0.exe?rlkey=8heyc0q4rm0p3o2qs023eqok0&st=z25mk00g&dl=1', '_blank');
        this.closeInstallChoiceModal();
    }

    getRepeatSVG() {
        return `<svg width='1em' height='1em' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M4 4v4h4' stroke='#6366f1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/><path d='M16 16v-4h-4' stroke='#6366f1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/><path d='M5.07 14.93A8 8 0 0 1 4 10m12-4a8 8 0 0 0-11.31 0M15 10a8 8 0 0 1-1.07 4.93' stroke='#6366f1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>`;
    }

    updateHeaderMonth() {
        const currentMonthDate = new Date(this.currentYear, this.currentMonth, 1);
        const options = { 
            month: 'long', 
            year: 'numeric'
        };
        const formattedMonth = currentMonthDate.toLocaleDateString('en-US', options);
        document.getElementById('currentDate').textContent = formattedMonth;
        
        // Keep today's date for the Today view
        const today = new Date();
        const todayOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        document.getElementById('todayDate').textContent = today.toLocaleDateString('en-US', todayOptions);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CalendarApp();
}); 