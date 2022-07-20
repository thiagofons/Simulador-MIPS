// Coisas do DOM
const inserirCodigo = document.getElementById("inserir-codigo");
const inserirContainer = document.querySelector(".inserir-container");
const submitButton = document.querySelector(".submit-btn");

const bancoReg = document.getElementById("banco-reg");
const memoria = document.getElementById("memoria");

const diagrama = document.getElementById("diagrama");

window.onload = () => {
    carregarBancoRegistradores();
    carregarMemoria();
};

// Dados
let numeroInstrucoes = 0;
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
let memoriaDados = {};
let bancoRegistradores = [];


// Logica

// Formulario para inserir o codigo-fonte
inserirCodigo.addEventListener("click", () => {
    inserirContainer.classList.toggle("inserir-container-on");
});

function submit() {
    resetaDiagrama();
    carregarDiagrama();
    textoCodigo = document.getElementById("codigo").value.split("\n").filter(checkNaoVazio);
    geraLinhas();
    textoCodigo = processaLinhas(textoCodigo);
    leLabel();
    document.getElementById("codigo").value = "";
    inserirContainer.classList.toggle("inserir-container-on");
}

function fecharInserir() {
    inserirContainer.classList.toggle("inserir-container-on");
}

//separa cada linha em array
function processaLinhas(linhas) {
    for(let i = 0; i < linhas.length; i++) {
        linhas[i] = linhas[i].replaceAll(", ", ","); //remove espaço pós virgula
        linhas[i] = linhas[i].toLowerCase();
        linhas[i] = linhas[i].replaceAll(":", " ");
        linhas[i] = linhas[i].replaceAll(",", " "); //substitui "," por " " para fazer apenas um split posteriormente
        linhas[i] = linhas[i].replaceAll("  ", " "); //remove espaço duplo, caso houver.
        linhas[i] = linhas[i].split(" ");
    }
    return linhas;
}

function leLabel() {
    for(let i = 0; i < textoCodigo.length; i++) {
        if(checkInst(textoCodigo[i][0]) == -1) {
            labels[textoCodigo[i][0]] = i;
            textoCodigo[i] = textoCodigo[i].slice(1, textoCodigo[i].length);
        }
    }
}

function checkInst(cmp) {
    for(let i = 0; i < instrucoes.length; i++) {
        if(instrucoes[i] == cmp) return i;
    }
    return -1;
}

function atualizaRegistrador(registrador, valorNovo) {
    document.getElementById(registrador).innerHTML = valorNovo;
    registradores[registrador] = valorNovo;
}

function insereMemoria(memoriaNova, valor=0) {
    tamanhoTabela = memoria.rows.length
    memoria.insertRow(tamanhoTabela).outerHTML = `<tr><td>${memoriaNova}</td><td id = ${memoriaNova}>${valor}</td></tr>`
    memoriaDados[memoriaNova] = valor;
}

function modificaMemoria(memoria, valorNovo) {
    document.getElementById(`${memoria}`).innerHTML = valorNovo;
    memoriaDados[memoriaNova] = valor;
}

// Conversao do codigo no diagrama
function carregarDiagrama() {
    let linhaAtual = 0;

    // Carregar o cabecalho do diagrama
    const cabecalho = document.getElementById("tab-cabecalho");
    cabecalho.innerHTML = `<th>instrução</th>`;
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
    for(let i = 0; i < valorReg.length; i++) {
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

function contaInstrucao() {
    let i = 0;
    let linhaJal = 0;
    while(i < textoCodigo.length) {
        if(checkInst(textoCodigo[i][0]) != -1) {
            numeroInstrucoes += 1;
            switch(textoCodigo[i][0]) {
                case "beq":
                    if(registradores[textoCodigo[i][1]] == registradores[textoCodigo[i][2]]) {
                        i = labels[textoCodigo[i][3]];
                    }
                    break;
                
                case "bne":
                    if(registradores[textoCodigo[i][1]] != registradores[textoCodigo[i][2]]) {
                        i = labels[textoCodigo[i][3]];
                    }
                    break;
                
                case "j":
                    i = labels[textoCodigo[i][1]];
                    break;
                
                case "jal":
                    linhaJal = i;
                    i = labels[textoCodigo[i][1]];
                    break;
                
                case "jr":
                    i = linhaJal + 1;
                    break;
                
                case "add":
                    atualizaRegistrador(textoCodigo[i][1], registradores[textoCodigo[i][2]] + registradores[textoCodigo[i][3]]);
                    break;
                
                case "addi":
                    atualizaRegistrador(textoCodigo[i][1], registradores[textoCodigo[i][2]] + parseInt(textoCodigo[i][3]));
                    break;
                
                case "and":
                    atualizaRegistrador(textoCodigo[i][1], registradores[textoCodigo[i][2]] & registradores[textoCodigo[i][3]]);
                    break;
                
                case "lw":
                    //??????
                    break;
                
                case "or":
                    atualizaRegistrador(textoCodigo[i][1], registradores[textoCodigo[i][2]] | registradores[textoCodigo[i][3]]);
                    break;
                
                case "sll":
                    atualizaRegistrador(textoCodigo[i][1], registradores[textoCodigo[i][1]] << parseInt(textoCodigo[i][2]))
                    break;
                
                case "srl":
                    atualizaRegistrador(textoCodigo[i][1], registradores[textoCodigo[i][1]] >> parseInt(textoCodigo[i][2]))
                    break;
                
                case "sw":

                    break;

                case "sub":
                    atualizaRegistrador(textoCodigo[i][1], registradores[textoCodigo[i][2]] - registradores[textoCodigo[i][3]]);
                    break;
            }
        }
        i++;
    }
}

function checkNaoVazio(arr) {
    if(arr.length > 0) return true;
    return false
}

function geraLinhas() {
    const cabecalho = document.getElementById("tab-cabecalho");
    
    for(let i = 1; i < 5; i++) {
        cabecalho.innerHTML += `<th>${i}</th>`;
    }

    for(let i = 0; i < textoCodigo.length; i++) {
        cabecalho.innerHTML += `<th>${i + 5}</th>`
        tamanhoTabela = diagrama.rows.length

        let inicio = `
            <tr class="tab-linha instrucao">
            <td class="nome-instrucao" id = "linha${i}">${textoCodigo[i]}</td>`;

        for(let espaco = 0; espaco < i; espaco++) {
            inicio += `<td></td>`;
        }
        inicio += `
            <td id = if${i}>IF</td>
            <td id = id${i}>ID</td>
            <td id = ex${i}>EX</td>
            <td id = mem${i}>MEM</td>
            <td id = wb${i}>WB</td>
            </tr>`;

        diagrama.insertRow(tamanhoTabela).outerHTML = inicio;
    }
}

function resetaDiagrama() {
    diagrama.innerHTML = "<tr id='tab-cabecalho'></tr>";
    let temp = Object.entries(registradores);
    for(let i = 0; i < temp.length; i++) {
        atualizaRegistrador(temp[i][0], 0) ;
    }
}

