/*
    CIT 281 Project 6
    Name: Arissa Samaniego
*/

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

async function fetchTodos() {
    const res = await fetch('/tasks');
    const todos = await res.json();
    list.innerHTML = '';
    todos.forEach(todo => renderTodo(todo));
}

function renderTodo(todo) {
    const li = document.createElement('li');
    li.textContent = todo.description;

    if (todo.completed) {
        li.classList.add('completed');
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = async () => {
        await fetch(`/tasks/${todo.id}`, { method: "DELETE" });
        fetchTodos();
    };
    li.appendChild(deleteBtn);
        
    const completeBtn = document.createElement('button');    
    completeBtn.textContent = todo.completed ? 'Completed' : 'Complete';
    completeBtn.disabled = todo.completed;
    completeBtn.onclick = async () => {
        await fetch(`/tasks/${todo.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: true })
        });
        fetchTodos();    
    };
    li.appendChild(completeBtn);
    list.appendChild(li);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const task = input.value.trim();
    if (task) {
        await fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: task })
        });
        input.value = '';
        fetchTodos();
    }
});

fetchTodos();