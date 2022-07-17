// Coisas do DOM
const inserirCodigo = document.getElementById("inserir-codigo");
const inserirContainer = document.querySelector(".inserir-container");
const submitButton = document.querySelector(".submit-btn");

const bancoReg = document.getElementById("banco-reg");

window.onload = () => {
    // Carregar o banco de registradores
    bancoReg.innerHTML = 
    `   <tr>
            <th>Registrador</th>
            <th>Valor</th>
        </tr>
        <tr><td>$zero</td><td>0</td></tr>
        <tr><td>$at</td><td>0</td></tr>
        <tr><td>$v0</td><td>0</td></tr>
        <tr><td>$v1</td><td>0</td></tr>
        <tr><td>$a0</td><td>0</td></tr>
        <tr><td>$a1</td><td>0</td></tr>
        <tr><td>$a2</td><td>0</td></tr>
        <tr><td>$a3</td><td>0</td></tr>
        <tr><td>$t0</td><td>0</td></tr>
        <tr><td>$t1</td><td>0</td></tr>
        <tr><td>$t2</td><td>0</td></tr>
        <tr><td>$t3</td><td>0</td></tr>
        <tr><td>$t4</td><td>0</td></tr>
        <tr><td>$t5</td><td>0</td></tr>
        <tr><td>$t6</td><td>0</td></tr>
        <tr><td>$t7</td><td>0</td></tr>
        <tr><td>$s0</td><td>0</td></tr>
        <tr><td>$s1</td><td>0</td></tr>
        <tr><td>$s2</td><td>0</td></tr>
        <tr><td>$s3</td><td>0</td></tr>
        <tr><td>$s4</td><td>0</td></tr>
        <tr><td>$s5</td><td>0</td></tr>
        <tr><td>$s6</td><td>0</td></tr>
        <tr><td>$s7</td><td>0</td></tr>
        <tr><td>$t8</td><td>0</td></tr>
        <tr><td>$t9</td><td>0</td></tr>
        <tr><td>$k0</td><td>0</td></tr>
        <tr><td>$k1</td><td>0</td></tr>
        <tr><td>$gp</td><td>0</td></tr>
        <tr><td>$sp</td><td>0</td></tr>
        <tr><td>$fp</td><td>0</td></tr>
        <tr><td>$ra</td><td>0</td></tr>
    `
};

// Dados
const numeroInstrucoes = 10;

const formularioCodigo = document.querySelector(".inserir-container");
let textoCodigo;

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

// Formulario para inserir o codigo-fonte
inserirCodigo.addEventListener("click", () => {
    inserirContainer.classList.toggle("inserir-container-on");
});

function submit() {
    textoCodigo = document.getElementById("codigo").value.split("\n");
    document.getElementById("codigo").value = "";
    inserirContainer.classList.toggle("inserir-container-on");
}

