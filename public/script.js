// Priority Todo List with Date, Deadline, and History

// Load todos and history from localStorage
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let history = JSON.parse(localStorage.getItem('todoHistory')) || [];
let currentFilter = 'all';

const todoInput = document.getElementById('todoInput');
const prioritySelect = document.getElementById('prioritySelect');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const totalTasks = document.getElementById('totalTasks');
const completedTasks = document.getElementById('completedTasks');
const pendingTasks = document.getElementById('pendingTasks');
const filterBtns = document.querySelectorAll('.filter-btn');

function Todo(text, priority) {
  this.id = Date.now() + Math.random();
  this.text = text;
  this.priority = priority;
  this.completed = false;
  this.createdAt = new Date();
}


function addTodo() {
  const text = todoInput.value.trim();
  const priority = prioritySelect.value;
  const deadline = document.getElementById('deadlineInput').value;

  if (text === '') {
    todoInput.focus();
    return;
  }

  const newTodo = new Todo(text, priority);
  newTodo.deadline = deadline;
  todos.push(newTodo);

  todoInput.value = '';
  document.getElementById('deadlineInput').value = '';
  renderTodos();
  updateStats();
  localStorage.setItem('todos', JSON.stringify(todos));
}

function deleteTodo(id) {
  const idx = todos.findIndex(todo => todo.id === id);
  if (idx > -1) {
    const todo = todos.splice(idx, 1)[0];
    todo.deletedAt = new Date();
    history.push(todo); // Add to history
    localStorage.setItem('todoHistory', JSON.stringify(history));
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
    updateStats();
  }
}

function toggleTodo(id) {
  const todo = todos.find(todo => todo.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    if (todo.completed) {
      todo.completedAt = new Date();
      // Move to history and remove from todos
      todos.splice(todos.indexOf(todo), 1);
      history.push(todo);
      localStorage.setItem('todoHistory', JSON.stringify(history));
    }
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
    updateStats();
  }
}

function filterTodos() {
  if (currentFilter === 'all') {
    return todos;
  }
  return todos.filter(todo => todo.priority === currentFilter);
}

function sortTodos(todosToSort) {
  const priorityOrder = { high: 3, medium: 2, low: 1 };

  return todosToSort.sort((a, b) => {

    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }


    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

function renderTodos() {
  const filteredTodos = filterTodos();
  const sortedTodos = sortTodos([...filteredTodos]);

  if (sortedTodos.length === 0) {
    todoList.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  todoList.style.display = 'flex';
  emptyState.style.display = 'none';

  todoList.innerHTML = sortedTodos.map(todo => `
    <div class="todo-item ${todo.completed ? 'completed' : ''}">
      <input 
        type="checkbox" 
        class="todo-checkbox" 
        ${todo.completed ? 'checked' : ''}
        onchange="window.toggleTodo(${todo.id})"
      >
      <div class="priority-badge priority-${todo.priority}">
        ${todo.priority}
      </div>
      <div class="todo-text">${todo.text}</div>
      <div class="todo-meta">
        <small>Created: ${new Date(todo.createdAt).toLocaleString()}</small><br>
        <small>Deadline: <input type="datetime-local" value="${todo.deadline}" disabled /></small>
      </div>
      <div class="todo-actions">
        <button class="delete-btn" onclick="window.deleteTodo(${todo.id})">
          ×
        </button>
      </div>
    </div>
  `).join('');
}

// Filter tabs
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    currentFilter = this.dataset.filter;
    renderTodos();
  });
});

// Stats
function updateStats() {
  document.getElementById('totalTasks').textContent = todos.length + history.filter(h => h.completed).length;
  document.getElementById('completedTasks').textContent = history.filter(h => h.completed).length;
  document.getElementById('pendingTasks').textContent = todos.length;
}

// View history
document.getElementById('viewHistoryBtn').addEventListener('click', function () {
  document.getElementById('todoHistory').style.display = 'block';
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = '';
  if (history.length === 0) {
    historyList.innerHTML = '<li>No history yet.</li>';
    return;
  }
  history.slice().reverse().forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <b>${item.text}</b> 
      (${item.priority})<br>
      Created: ${new Date(item.createdAt).toLocaleString()}<br>
      Deadline: ${item.deadline ? new Date(item.deadline).toLocaleString() : 'None'}<br>
      ${item.completed ?
        `Completed: ${new Date(item.completedAt).toLocaleString()}` :
        `Deleted: ${new Date(item.deletedAt).toLocaleString()}`
      }
    `;
    historyList.appendChild(li);
  });
});
document.getElementById('closeHistoryBtn').addEventListener('click', function () {
  document.getElementById('todoHistory').style.display = 'none';
});

addBtn.addEventListener('click', function (e) {
  e.preventDefault();
  addTodo();
});

// Also allow pressing Enter in the input field
todoInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    addTodo();
  }
});

// Initial render
renderTodos();
