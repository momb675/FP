let expenses = [
    { id: 1, category: "Питание", sum: 560, date: "2026-06-05", description: "Продукты в супермаркете" },
    { id: 2, category: "Дорога", sum: 320, date: "2026-06-04", description: "Такси до аэропорта" },
    { id: 3, category: "Досуг", sum: 1200, date: "2026-06-03", description: "Билет в кинотеатр" },
    { id: 4, category: "Питание", sum: 890, date: "2026-06-02", description: "Ужин в ресторане" },
    { id: 5, category: "Дорога", sum: 150, date: "2026-06-01", description: "Метро + автобус" },
    { id: 6, category: "Досуг", sum: 2500, date: "2026-05-30", description: "Концерт любимой группы" },
    { id: 7, category: "Питание", sum: 430, date: "2026-05-29", description: "Завтрак в кафе" },
    { id: 8, category: "Дорога", sum: 540, date: "2026-05-28", description: "Бензин АЗС" },
    { id: 9, category: "Досуг", sum: 800, date: "2026-05-27", description: "Боулинг с друзьями" },
    { id: 10, category: "Питание", sum: 370, date: "2026-05-26", description: "Пицца на вынос" }
];

let currentFilter = "all";   
let nextId = 11;             


const expensesContainer = document.getElementById("expensesContainer");
const totalAmountSpan = document.getElementById("totalAmount");
const filterBtns = document.querySelectorAll(".filter-btn");
const addBtn = document.getElementById("addExpenseBtn");
const categorySelect = document.getElementById("expenseCategory");
const sumInput = document.getElementById("expenseSum");
const dateInput = document.getElementById("expenseDate");
const descInput = document.getElementById("expenseDesc");


function getFilteredExpenses() {
    if (currentFilter === "all") {
        return [...expenses];
    } else {
        return expenses.filter(exp => exp.category === currentFilter);
    }
}


function calculateTotal(filteredArray) {
    if (!filteredArray.length) return 0;
    return filteredArray.reduce((acc, curr) => acc + curr.sum, 0);
}


function renderExpenses() {
    const filtered = getFilteredExpenses();
    const total = calculateTotal(filtered);


    totalAmountSpan.innerText = total.toLocaleString('ru-RU') + " ₽";

    if (filtered.length === 0) {
        expensesContainer.innerHTML = `<div class="empty-state">✨ Трат по выбранной категории пока нет<br>Добавьте первую запись</div>`;
        return;
    }

 
    let html = '';
    filtered.forEach(exp => {
        const formattedDate = new Date(exp.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
        html += `
            <div class="expense-card">
                <div class="expense-info">
                    <span class="expense-category">${escapeHtml(exp.category)}</span>
                    <div class="expense-desc">${escapeHtml(exp.description)}</div>
                    <div class="expense-date">${formattedDate}</div>
                </div>
                <div class="expense-amount">${exp.sum.toLocaleString('ru-RU')} ₽</div>
            </div>
        `;
    });
    expensesContainer.innerHTML = html;
}

//защита от XSS
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}


function setFilter(category) {
    currentFilter = category;
    filterBtns.forEach(btn => {
        const btnCat = btn.getAttribute('data-cat');
        if ((btnCat === 'all' && category === 'all') || (btnCat === category)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    renderExpenses();
}


function addExpense() {
    const category = categorySelect.value;
    const sumRaw = sumInput.value.trim();
    const dateVal = dateInput.value;
    const descriptionRaw = descInput.value.trim();

    if (!sumRaw) {
        alert("Пожалуйста, укажите сумму расхода");
        return;
    }
    const sumNumber = parseFloat(sumRaw);
    if (isNaN(sumNumber) || sumNumber <= 0) {
        alert("Сумма должна быть положительным числом");
        return;
    }
    if (!dateVal) {
        alert("Укажите дату покупки");
        return;
    }
    let finalDesc = descriptionRaw === "" ? "Без описания" : descriptionRaw;

    const newExpense = {
        id: nextId++,
        category: category,
        sum: sumNumber,
        date: dateVal,
        description: finalDesc
    };

    expenses.push(newExpense);

  
    sumInput.value = '';
    descInput.value = '';
    if (!dateInput.value) dateInput.value = new Date().toISOString().slice(0,10);

    renderExpenses();
}


function setDefaultDate() {
    const today = new Date().toISOString().slice(0,10);
    if (!dateInput.value) {
        dateInput.value = today;
    }
}


function bindEvents() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const chosenCat = btn.getAttribute('data-cat');
            setFilter(chosenCat === 'all' ? 'all' : chosenCat);
        });
    });

    addBtn.addEventListener('click', addExpense);

 
    const formInputs = [sumInput, descInput, categorySelect, dateInput];
    formInputs.forEach(input => {
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addExpense();
                }
            });
        }
    });
}


function init() {
    setDefaultDate();
    bindEvents();
    setFilter('all');
}

init();