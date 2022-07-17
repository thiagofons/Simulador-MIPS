// Coisas do DOM
const inserirCodigo = document.getElementById("inserir-codigo");
const inserirContainer = document.querySelector(".inserir-container");
const submitButton = document.querySelector(".submit-btn");

const bancoReg = document.getElementById("banco-reg");
const memoria = document.getElementById("memoria");

const diagrama = document.getElementById("diagrama");
const cabecalho = document.getElementById("tab-cabecalho")

window.onload = () => {
    carregarDiagrama(textoCodigo);
    carregarBancoRegistradores();
    carregarMemoria();
};

// Dados
let numeroInstrucoes = 10;
var registradores = {
    "$zero": 0,
    "$at": 0,
    "$v0": 0,
    "$v1": 0,
    "$a0": 0,
    "$a1": 0,
    "$a2": 0,
    "$a3": 0,
    "$t0": 0,
    "$t1": 0,
    "$t2": 0,
    "$t3": 0,
    "$t4": 0,
    "$t5": 0,
    "$t6": 0,
    "$t7": 0,
    "$s0": 0,
    "$s1": 0,
    "$s2": 0,
    "$s3": 0,
    "$s4": 0,
    "$s5": 0,
    "$s6": 0,
    "$s7": 0,
    "$t8": 0,
    "$t9": 0,
    "$k0": 0,
    "$k1": 0,
    "$gp": 0,
    "$sp": 0,
    "$fp": 0,
    "$ra": 0
}

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
let labels = {};
let memoriaDados = [];
let bancoRegistradores = [];


// Logica

// Formulario para inserir o codigo-fonte
inserirCodigo.addEventListener("click", () => {
    inserirContainer.classList.toggle("inserir-container-on");
});

function submit() {
    textoCodigo = document.getElementById("codigo").value.split("\n");
    textoCodigo = processaLinhas(textoCodigo);
    leLabel();
    document.getElementById("codigo").value = "";
    inserirContainer.classList.toggle("inserir-container-on");
    console.log("Texto do codigo: " + textoCodigo);
}

//separa cada linha em array
function processaLinhas(linhas) {
    for(i = 0; i < linhas.length; i++) {
        linhas[i] = linhas[i].replace(", ", ","); //remove espaço pós virgula
        linhas[i] = linhas[i].toLowerCase();
        linhas[i] = linhas[i].replace(":", " ");
        linhas[i] = linhas[i].replace(",", " "); //substitui "," por " " para fazer apenas um split posteriormente
        linhas[i] = linhas[i].replace("  ", " "); //remove espaço duplo, caso houver.
        linhas[i] = linhas[i].split();
    }
    return linhas;
}

function leLabel() {
    for(i = 0; i < textoCodigo.length; i++) {
        if(!(textoCodigo[i][0] in instrucoes)) {
            labels[textoCodigo[i][0]] = i;
            textoCodigo[i] = textoCodigo[i].slice(1, textoCodigo[i].length);
        }
    }
}

function atualizaRegistrador(registrador, valorNovo) {
    document.getElementById(registrador).innerHTML = valorNovo;
}

function insereMemoria(memoriaNova, valor=0) {
    tamanhoTabela = memoria.rows.length
    memoria.insertRow(tamanhoTabela).outerHTML = `<tr><td>${memoriaNova}</td><td id = ${memoriaNova}>${valor}</td></tr>`
}

function modificaMemoria(memoria, valorNovo) {
    document.getElementById(`${memoria}`).innerHTML = valorNovo;
}

// Conversao do codigo no diagrama
function carregarDiagrama(codigo) {
    let linhaAtual = 0;

    // Carregar o cabecalho do diagrama
    cabecalho.innerHTML += `<th>instrução</th>`;
    for(let i = 1; i < numeroInstrucoes + 1; i++) {
        cabecalho.innerHTML += `<th>${i}</th>`;
    }
    linhaAtual++;

    // Carregar as instrucoes

}

function carregarBancoRegistradores() {
    loadReg = 
    `   <tr>
            <th>Registrador</th>
            <th>Valor</th>
        </tr>
    `
    valorReg = Object.entries(registradores);
    for(i = 0; i < valorReg.length; i++) {
        loadReg += `\n<tr><td>${valorReg[i][0]}</td><td id = ${valorReg[i][0]}>${valorReg[i][1]}</td></tr>`;
    }
    bancoReg.innerHTML = loadReg;
}

function carregarMemoria() {
    // Cabecalho da memoria
    memoria.innerHTML = `<tr>
    <th>Endereço</th>
    <th>Valor</th>
    </tr>`;
}