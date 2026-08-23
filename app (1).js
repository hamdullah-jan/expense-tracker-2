// ==========================================
// EXPENSE TRACKER
// ==========================================


// ---------- DOM ELEMENTS ----------

const expenseForm = document.querySelector("#expenseForm");

const expenseName = document.querySelector("#expenseName");
const expenseAmount = document.querySelector("#expenseAmount");
const expenseCategory = document.querySelector("#expenseCategory");
const expenseDate = document.querySelector("#expenseDate");

const expenseTable = document.querySelector("#expenseTable");

const totalExpense = document.querySelector("#totalExpense");
const averageExpense = document.querySelector("#averageExpense");
const expenseCount = document.querySelector("#expenseCount");

const searchInput = document.querySelector("#searchInput");
const categoryFilter = document.querySelector("#categoryFilter");

const loadSampleBtn = document.querySelector("#loadSampleBtn");


// ---------- DATA ----------

let expenses = [];


// ==========================================
// LOCAL STORAGE
// ==========================================

function loadExpenses() {

    const savedExpenses =
        localStorage.getItem("expenses");

    if (savedExpenses) {

        expenses = JSON.parse(savedExpenses);

    }

}


// Save expenses to LocalStorage

function saveExpenses() {

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

}


// ==========================================
// DISPLAY EXPENSES
// ==========================================

function displayExpenses(data = expenses) {

    expenseTable.innerHTML = "";

    if (data.length === 0) {

        expenseTable.innerHTML = `
            <tr>
                <td colspan="5">
                    No expenses found
                </td>
            </tr>
        `;

        return;
    }


    data.forEach(function(expense) {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${expense.name}</td>

            <td>${expense.category}</td>

            <td>Rs. ${expense.amount}</td>

            <td>${expense.date}</td>

            <td>
                <button
                    class="delete-btn"
                    onclick="deleteExpense(${expense.id})"
                >
                    Delete
                </button>
            </td>

        `;

        expenseTable.appendChild(row);

    });

}


// ==========================================
// ADD EXPENSE
// ==========================================

expenseForm.addEventListener(
    "submit",
    function(event) {

        // Stop page refresh

        event.preventDefault();


        const newExpense = {

            id: Date.now(),

            name: expenseName.value,

            amount: Number(expenseAmount.value),

            category: expenseCategory.value,

            date: expenseDate.value

        };


        // Add object to array

        expenses.push(newExpense);


        // Save data

        saveExpenses();


        // Update UI

        displayExpenses();

        calculateStatistics();


        // Clear form

        expenseForm.reset();

    }
);


// ==========================================
// DELETE EXPENSE
// ==========================================

function deleteExpense(id) {

    expenses = expenses.filter(function(expense) {

        return expense.id !== id;

    });


    saveExpenses();

    displayExpenses();

    calculateStatistics();

}


// ==========================================
// CALCULATE TOTAL & AVERAGE
// ==========================================

function calculateStatistics() {

    // Calculate total

    const total = expenses.reduce(
        function(sum, expense) {

            return sum + expense.amount;

        },
        0
    );


    // Calculate average

    const average =
        expenses.length > 0
            ? total / expenses.length
            : 0;


    // Display

    totalExpense.innerText =
        `Rs. ${total.toFixed(2)}`;

    averageExpense.innerText =
        `Rs. ${average.toFixed(2)}`;

    expenseCount.innerText =
        expenses.length;

}


// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener(
    "input",
    function() {

        filterExpenses();

    }
);


// ==========================================
// CATEGORY FILTER
// ==========================================

categoryFilter.addEventListener(
    "change",
    function() {

        filterExpenses();

    }
);


// ==========================================
// SEARCH + FILTER FUNCTION
// ==========================================

function filterExpenses() {

    const searchText =
        searchInput.value.toLowerCase();

    const selectedCategory =
        categoryFilter.value;


    const filteredExpenses =
        expenses.filter(function(expense) {


            // Search condition

            const matchesSearch =
                expense.name
                    .toLowerCase()
                    .includes(searchText);


            // Category condition

            const matchesCategory =
                selectedCategory === "All" ||
                expense.category === selectedCategory;


            return matchesSearch && matchesCategory;

        });


    displayExpenses(filteredExpenses);

}


// ==========================================
// FETCH API
// ==========================================

async function loadSampleExpenses() {

    try {

        const response =
            await fetch("expenses.json");


        if (!response.ok) {

            throw new Error(
                "Failed to load sample expenses"
            );

        }


        const sampleExpenses =
            await response.json();


        // Add sample data

        expenses = [
            ...expenses,
            ...sampleExpenses
        ];


        saveExpenses();

        displayExpenses();

        calculateStatistics();


        alert(
            "Sample expenses loaded successfully!"
        );

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to load sample expenses."
        );

    }

}


// Button event

loadSampleBtn.addEventListener(
    "click",
    loadSampleExpenses
);


// ==========================================
// APPLICATION START
// ==========================================

loadExpenses();

displayExpenses();

calculateStatistics();