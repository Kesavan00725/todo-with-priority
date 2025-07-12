

    let todos = [];
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

      if (text === '') {
        todoInput.focus();
        return;
      }

      const newTodo = new Todo(text, priority);
      todos.push(newTodo);

      todoInput.value = '';
      renderTodos();
      updateStats();
    }

    function deleteTodo(id) {
      todos = todos.filter(todo => todo.id !== id);
      renderTodos();
      updateStats();
    }


    function toggleTodo(id) {
      const todo = todos.find(todo => todo.id === id);
      if (todo) {
        todo.completed = !todo.completed;
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
            onchange="toggleTodo(${todo.id})"
          >
          <div class="priority-badge priority-${todo.priority}">
            ${todo.priority}
          </div>
          <div class="todo-text">${todo.text}</div>
          <div class="todo-actions">
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">
              ×
            </button>
          </div>
        </div>
      `).join('');
    }

   
    function updateStats() {
      const total = todos.length;
      const completed = todos.filter(todo => todo.completed).length;
      const pending = total - completed;

      totalTasks.textContent = total;
      completedTasks.textContent = completed;
      pendingTasks.textContent = pending;
    }

  
    function setFilter(filter) {
      currentFilter = filter;
      
      
      filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
      });
      
      renderTodos();
    }

    addBtn.addEventListener('click', addTodo);

    todoInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        addTodo();
      }
    });

    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        setFilter(this.dataset.filter);
      });
    });

    updateStats();
    renderTodos();

    setTimeout(() => {
      if (todos.length === 0) {
        todos.push(new Todo('Complete project proposal', 'high'));
        todos.push(new Todo('Review team meeting notes', 'medium'));
        todos.push(new Todo('Update personal website', 'low'));
        todos.push(new Todo('Call dentist for appointment', 'medium'));
        
        renderTodos();
        updateStats();
      }
    }, 1000);
  