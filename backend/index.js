const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuração do banco de dados
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "devfinance",
});

db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
        return;
    }
    console.log("Conexão com o banco de dados bem-sucedida!");
});

// Rotas da API

// Adicionar transação
app.post("/transactions", (req, res) => {
    const { description, value, type } = req.body;

    if (!description || !value || !type) {
        return res.status(400).send({ error: "Preencha todos os campos." });
    }

    const query = "INSERT INTO transactions (description, value, type) VALUES (?, ?, ?)";
    db.query(query, [description, value, type], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ error: "Erro ao adicionar transação." });
        }
        res.status(201).send({ message: "Transação adicionada com sucesso!" });
    });
});

// Listar transações
app.get("/transactions", (req, res) => {
    const query = "SELECT * FROM transactions ORDER BY date DESC";
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ error: "Erro ao buscar transações." });
        }
        res.status(200).send(results);
    });
});

// Remover transação
app.delete("/transactions/:id", (req, res) => {
    const { id } = req.params;

    const query = "DELETE FROM transactions WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ error: "Erro ao remover transação." });
        }
        res.status(200).send({ message: "Transação removida com sucesso!" });
    });
});

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
