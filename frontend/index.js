const incomeBtn = document.getElementById('income')
const outcomeBtn = document.getElementById('outcome')

let list = []
let totalOutcome = 0
let totalIncome = 0

function balance() {
    const element = `<h2 id="total">${Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(totalIncome - totalOutcome)}</h2>`;

    document.getElementById("info").innerHTML = element;
}

function listLength() {
    return document.querySelectorAll(`li`).length;
}

async function removeTransaction(id) {
    const response = await fetch(`http://localhost:3000/transactions/${id}`, {
        method: "DELETE",
    });

    if (response.ok) {
        alert("Transação removida!");
        fetchTransactions();
    } else {
        alert("Erro ao remover transação.");
    }
}

async function fetchTransactions() {
    const response = await fetch("http://localhost:3000/transactions");
    const transactions = await response.json();

    const transactionsList = document.getElementById("transactions-list");
    transactionsList.innerHTML = "";

    transactions.forEach((transaction) => {
        const { id, description, value, type, date } = transaction;

        const element = `<li id="${id}">
                            <div class="left-side">
                                <p class="${type}">${type === true ? "Receita:" : "Despesa:"}</p>
                                <p class="description">${description}</p>
                            </div>
                            <div class="right-side">
                                <p class="date">${new Date(date).toLocaleString("pt-BR")}</p>
                                <p class="value">${Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                }).format(value)}</p>
                                <button onclick="removeTransaction(${id})">
                                    <img src="./assets/trash.svg" alt="Ícone lixeira">
                                </button>
                            </div>
                        </li>`;
        transactionsList.innerHTML += element;
    });

    balance(); // Atualiza o saldo
}
fetchTransactions();


incomeBtn.addEventListener("click", async () => {
    const description = window.prompt("Descrição da receita");
    const value = parseFloat(window.prompt("Informe o valor da receita (apenas números)"));

    if (!description || isNaN(value)) {
        alert("Preencha todos os campos!");
        return;
    }

    const response = await fetch("http://localhost:3000/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, value, type: true }),
    });

    if (response.ok) {
        alert("Receita adicionada com sucesso!");
        fetchTransactions(); // Atualiza a lista
    } else {
        alert("Erro ao adicionar receita.");
    }

    balance()
});

outcomeBtn.addEventListener("click", async () => {
    const description = window.prompt("Descrição da receita");
    const value = parseFloat(window.prompt("Informe o valor da receita (apenas números)"));

    if (!description || isNaN(value)) {
        alert("Preencha todos os campos!");
        return;
    }

    const response = await fetch("http://localhost:3000/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, value, type: false }),
    });

    if (response.ok) {
        alert("Receita adicionada com sucesso!");
        fetchTransactions(); // Atualiza a lista
    } else {
        alert("Erro ao adicionar receita.");
    }
});

