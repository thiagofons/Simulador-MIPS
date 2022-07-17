// Coisas do DOM
const inserirCodigo = document.getElementById("inserir-codigo");
const inserirContainer = document.querySelector(".inserir-container");
const submitButton = document.querySelector(".submit-btn");

// Dados
const numeroInstrucoes = 10;

const formularioCodigo = document.querySelector(".inserir-container");
let textoCodigo = "";

const instrucao = ["IF" , "ID", "EX", "MEM", "WB"];
const instrucoes = [
    "add",
    "addi",
    "and",
    "beq",
    "bne",
    "j",
    "jal",
    "jr",
    "lw",
    "or",
    "sll",
    "srl",
    "sw",
    "sub"
];
const memoriaDados = [];
const bancoRegistradores = [];

// Logica
inserirCodigo.addEventListener("click", () => {
    inserirContainer.classList.toggle("inserir-container-on");
});

formularioCodigo.addEventListener("submit", (s) => {
    console.log(textoCodigo);
})

function submit() {
    textoCodigo = document.getElementById("codigo").value;
    document.getElementById("codigo").value = "";
    inserirContainer.classList.toggle("inserir-container-on");
}