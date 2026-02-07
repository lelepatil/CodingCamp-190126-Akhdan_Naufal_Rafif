const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const dateInput = document.getElementById('dateInput');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const filterBtns = document.querySelectorAll('.filter-btn');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

dateInput.min = new Date().toISOString().split('T')[0];

todoForm.addEventListener('submit', addTodo);

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});

function addTodo(e) {
    e.preventDefault();

    const todoText = todoInput.value.trim();
    const todoDate = dateInput.value;

    if (!todoText) {
        alert('Please enter a task!');
        return;
    }

    if (!todoDate) {
        alert('Please select a date!');
        return;
    }

    // Create todo object
    const todo = {
        id: Date.now(),
        text: todoText,
        date: todoDate,
        completed: false,
        createdAt: new Date().toISOString()
    };

    todos.push(todo);

    saveTodos();

    todoInput.value = '';
    dateInput.value = '';

    renderTodos();

    todoInput.focus();
}

function deleteTodo(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
    }
}

function toggleComplete(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    saveTodos();
    renderTodos();
}

function filterTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(todo => !todo.completed);
        case 'completed':
            return todos.filter(todo => todo.completed);
        default:
            return todos;
    }
}

function renderTodos() {
    const filteredTodos = filterTodos();

    todoList.innerHTML = '';

    if (filteredTodos.length === 0) {
        emptyState.classList.remove('hidden');
        todoList.classList.add('hidden');
    } else {
        emptyState.classList.add('hidden');
        todoList.classList.remove('hidden');
    }

    filteredTodos.forEach(todo => {
        const todoItem = createTodoElement(todo);
        todoList.appendChild(todoItem);
    });
}

function createTodoElement(todo) {
    const todoItem = document.createElement('div');
    todoItem.className = `todo-item bg-gray-100 p-5 rounded-xl flex items-center gap-4 transition-all duration-300 hover:bg-gray-200 hover:translate-x-1 ${todo.completed ? 'opacity-60' : ''}`;
    todoItem.dataset.id = todo.id;

    const formattedDate = formatDate(todo.date);

    todoItem.innerHTML = `
        <div class="flex-shrink-0">
            <input 
                type="checkbox" 
                class="w-6 h-6 cursor-pointer accent-purple-600" 
                ${todo.completed ? 'checked' : ''}
                onchange="toggleComplete(${todo.id})"
            >
        </div>
        <div class="flex-1 min-w-0">
            <div class="text-lg text-gray-800 break-words ${todo.completed ? 'line-through text-gray-500' : ''}">${escapeHtml(todo.text)}</div>
            <div class="text-sm text-gray-600 mt-1">📅 ${formattedDate}</div>
        </div>
        <button 
            class="flex-shrink-0 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 hover:scale-105 active:scale-95 transition-all duration-200 text-sm"
            onclick="deleteTodo(${todo.id})"
        >
            Delete
        </button>
    `;

    return todoItem;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

renderTodos();
