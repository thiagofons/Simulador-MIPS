// Coisas do DOM
const inserirCodigo = document.getElementById("inserir-codigo");
const inserirContainer = document.querySelector(".inserir-container");
const submitButton = document.querySelector(".submit-btn");

const bancoReg = document.getElementById("banco-reg");
const memoria = document.getElementById("memoria");

const diagrama = document.getElementById("diagrama");
const proxInstrucao = document.querySelector(".prox-instrucao");

window.onload = () => {
    carregarBancoRegistradores();
    carregarMemoria();
};

// Dados
let stallJump = false;
let linha = 0;
let ciclo = 0;
let bolha = 0;
let finish = 1;

let fix = 0;

let numeroInstrucoes = 0;
var registradores = {
    "$zero": [0, -1, 0],
    "$at": [0, -1, 0],
    "$v0": [0, -1, 0],
    "$v1": [0, -1, 0],
    "$a0": [0, -1, 0],
    "$a1": [0, -1, 0],
    "$a2": [0, -1, 0],
    "$a3": [0, -1, 0],
    "$t0": [0, -1, 0],
    "$t1": [0, -1, 0],
    "$t2": [0, -1, 0],
    "$t3": [0, -1, 0],
    "$t4": [0, -1, 0],
    "$t5": [0, -1, 0],
    "$t6": [0, -1, 0],
    "$t7": [0, -1, 0],
    "$s0": [0, -1, 0],
    "$s1": [0, -1, 0],
    "$s2": [0, -1, 0],
    "$s3": [0, -1, 0],
    "$s4": [0, -1, 0],
    "$s5": [0, -1, 0],
    "$s6": [0, -1, 0],
    "$s7": [0, -1, 0],
    "$t8": [0, -1, 0],
    "$t9": [0, -1, 0],
    "$k0": [0, -1, 0],
    "$k1": [0, -1, 0],
    "$gp": [0, -1, 0],
    "$sp": [0, -1, 0],
    "$fp": [0, -1, 0],
    "$ra": [0, -1, 0]
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
let registradoresModificar = [];


// Logica

// Formulario para inserir o codigo-fonte
inserirCodigo.addEventListener("click", () => {
    inserirContainer.classList.toggle("inserir-container-on");
});

function submit() {
    resetaDiagrama();
    carregarDiagrama();
    textoCodigo = document.getElementById("codigo").value.split("\n").filter(checkLinhas);
    textoOriginal = [...textoCodigo];
    textoCodigo = processaLinhas(textoCodigo);

    // Verificar se vai ser necessario gerar stalls
    const gerarStalls = document.getElementsByName("stalls");
    for(let i = 0; i < gerarStalls.length; i++) {
        if(gerarStalls[i].checked) {
            if(gerarStalls[i].value === "sim") 
                stallJump = true;
            else 
                stallJump = false;
            break;
        }   
    }

    leLabel();
    document.getElementById("codigo").value = "";
    inserirContainer.classList.toggle("inserir-container-on");
    proxInstrucao.classList.add("exibir");
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
        linhas[i] = linhas[i].replaceAll("(", " ");
        linhas[i] = linhas[i].replaceAll(")", "");
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

function atualizaRegistrador(registrador, valorNovo, ciclos) {
    registradoresModificar.push(registrador);
    registradores[registrador][1] = ciclos;
    registradores[registrador][2] = valorNovo;
}

function controlaRegistrador(registrador, i) {
    registradores[registrador][1]--;
    if(registradores[registrador][1] == 0) {
        registradores[registrador][0] = registradores[registrador][2];
        document.getElementById(registrador).innerHTML = registradores[registrador][0]
        registradoresModificar.splice(i, 1);
        registradores[registrador][1] = -1;
        fix++;
    }
}

function insereMemoria(memoriaNova, valor=0) {
    tamanhoTabela = memoria.rows.length
    memoria.insertRow(tamanhoTabela).outerHTML = `<tr><td>${memoriaNova}</td><td id = ${memoriaNova}>${valor}</td></tr>`
    memoriaDados[memoriaNova] = valor;
}

function modificaMemoria(memoria, valorNovo) {
    document.getElementById(`${memoria}`).innerHTML = valorNovo;
    memoriaDados[memoria] = valor;
}

// Conversao do codigo no diagrama
function carregarDiagrama() {
    // Carregar o cabecalho do diagrama
    const cabecalho = document.getElementById("tab-cabecalho");
    cabecalho.innerHTML = `<th>instrução</th>`;
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
        loadReg += `\n<tr><td>${valorReg[i][0]}</td><td id = ${valorReg[i][0]}>${valorReg[i][1][0]}</td></tr>`;
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

function passaCiclo() {
    ciclo++;
    if(finish > 4) return;
    for(let i = 0; i-fix < registradoresModificar.length; i++) {
        console.log(registradoresModificar[i-fix]);
        controlaRegistrador(registradoresModificar[i-fix], i-fix);
    }
    fix = 0;
    if(linha >= textoCodigo.length) {
        finalizaPrograma(finish);
        finish++;
        return;
    };
    
    const cabecalho = document.getElementById("tab-cabecalho")
    cabecalho.innerHTML += `<th>${ciclo}</th>`;
    
    tamanhoTabela = diagrama.rows.length;
    if(bolha > 0) {
        let inicio = `
        <tr class="tab-linha instrucao" id = "${ciclo}">
        <td class="nome-instrucao" id = "codigo${ciclo}">sll $zero, $zero, 0</td>`

        for(let espaco = 0; espaco < ciclo - 1; espaco++) {
            inicio += `<td></td>`;
        }
        inicio += `<td id = "if${ciclo}">IF</td>`
        diagrama.insertRow(tamanhoTabela).outerHTML = inicio;
        for(let i = ciclo-1; i > ciclo-5 && i > 0; i--) {
            switch(i) {
                case ciclo-1: 
                    document.getElementById(`${i}`).innerHTML += `<td id = "id${ciclo}">ID</td>`
                    break;
                
                case ciclo-2:
                    document.getElementById(`${i}`).innerHTML += `<td id = "ex${ciclo}">EX</td>`
                    break;
                
                case ciclo-3:
                    document.getElementById(`${i}`).innerHTML += `<td id = "mem${ciclo}">MEM</td>`
                    break;
                
                case ciclo-4:
                    document.getElementById(`${i}`).innerHTML += `<td id = "wb${ciclo}">WB</td>`
                    break;
            }
        }
        bolha--;
    } else {
        let inicio = `
        <tr class="tab-linha instrucao" id = "${ciclo}">
        <td class="nome-instrucao" id = "codigo${ciclo}">${textoOriginal[linha]}</td>`

        for(let espaco = 0; espaco < ciclo - 1; espaco++) {
            inicio += `<td></td>`;
        }
        inicio += `<td id = "if${ciclo}">IF</td>`
        diagrama.insertRow(tamanhoTabela).outerHTML = inicio;
        for(let i = ciclo-1; i > ciclo-5 && i > 0; i--) {
            switch(i) {
                case ciclo-1: 
                    document.getElementById(`${i}`).innerHTML += `<td id = "id${ciclo}">ID</td>`
                    break;
                
                case ciclo-2:
                    document.getElementById(`${i}`).innerHTML += `<td id = "ex${ciclo}">EX</td>`
                    break;
                
                case ciclo-3:
                    document.getElementById(`${i}`).innerHTML += `<td id = "mem${ciclo}">MEM</td>`
                    break;
                
                case ciclo-4:
                    document.getElementById(`${i}`).innerHTML += `<td id = "wb${ciclo}">WB</td>`
                    break;
            }
        }
        let linhaJal = 0;
        if(checkInst(textoCodigo[linha][0]) != -1) {
            numeroInstrucoes += 1;
            switch(textoCodigo[linha][0]) {
                case "beq":
                    if((registradores[textoCodigo[linha][2]][1] == -1 && registradores[textoCodigo[linha][3]][1] == -1) || !stallJump) {
                        if(registradores[textoCodigo[linha][1]][0] == registradores[textoCodigo[linha][2]][0]) {
                            linha = labels[textoCodigo[linha][3]] - 1;
                        }
                        if(stallJump)
                            bolha = 1;
                    }
                    else {
                        document.getElementById(`codigo${ciclo}`).innerHTML = "sll $zero, $zero, 0"
                        bolha = 1;
                    }
                    break;
                
                case "bne":
                    if((registradores[textoCodigo[linha][2]][1] == -1 && registradores[textoCodigo[linha][3]][1] == -1) || !stallJump) {
                        if(registradores[textoCodigo[linha][1]][0] != registradores[textoCodigo[linha][2]][0]) {
                            linha = labels[textoCodigo[linha][3]] - 1;
                        }
                        if(stallJump)
                            bolha = 1;
                    }
                    else {
                        document.getElementById(`codigo${ciclo}`).innerHTML = "sll $zero, $zero, 0"
                        bolha = 1;
                    }
                    break;
                
                case "j":
                    linha = labels[textoCodigo[linha][1]] - 1;
                    if(stallJump)
                        bolha = 1;
                    break;
                
                case "jal":
                    linhaJal = linha;
                    linha = labels[textoCodigo[linha][1]] - 1;
                    if(stallJump)
                        bolha = 1;
                    break;
                
                case "jr":
                    linha = linhaJal;
                    if(stallJump)
                        bolha = 1;
                    break;
                
                case "add":
                    if((registradores[textoCodigo[linha][2]][1] == -1 && registradores[textoCodigo[linha][3]][1] == -1) || !stallJump)
                        atualizaRegistrador(textoCodigo[linha][1], registradores[textoCodigo[linha][2]][0] + registradores[textoCodigo[linha][3]][0], 3);
                    else {
                        document.getElementById(`codigo${ciclo}`).innerHTML = "sll $zero, $zero, 0"
                        if(registradores[textoCodigo[linha][2]][1] > -1)
                            bolha = registradores[textoCodigo[linha][2]][1];
                        else
                            bolha = registradores[textoCodigo[linha][3]][1];
                        linha--;
                    }
                    break;
                
                case "addi":
                    if(registradores[textoCodigo[linha][2]][1] == -1 || !stallJump)
                        atualizaRegistrador(textoCodigo[linha][1], registradores[textoCodigo[linha][2]][0] + parseInt(textoCodigo[linha][3]), 3);
                    else {
                        document.getElementById(`codigo${ciclo}`).innerHTML = "sll $zero, $zero, 0"
                        bolha = registradores[textoCodigo[linha][2]][1];
                        linha--;
                    }
                    break;
                
                case "and":
                    if((registradores[textoCodigo[linha][2]][1] == -1 && registradores[textoCodigo[linha][3]][1] == -1) || !stallJump)
                        atualizaRegistrador(textoCodigo[linha][1], registradores[textoCodigo[linha][2]][0] & registradores[textoCodigo[linha][3]][0], 3);
                    else {
                        document.getElementById(`codigo${ciclo}`).innerHTML = "sll $zero, $zero, 0"
                        if(registradores[textoCodigo[linha][2]][1] > -1)
                            bolha = registradores[textoCodigo[linha][2]][1];
                        else
                            bolha = registradores[textoCodigo[linha][3]][1];
                        linha--;
                    }
                    break;
                
                case "lw":
                    if((registradores[textoCodigo[linha][1]][1] == -1 && registradores[textoCodigo[linha][3]][1] == -1) || !stallJump)
                        atualizaRegistrador(textoCodigo[linha][1], memoriaDados[(parseInt(textoCodigo[linha][2]) + registradores[textoCodigo[linha][3]][0]).toString(16)], 4);
                    else {
                        document.getElementById(`codigo${ciclo}`).innerHTML = "sll $zero, $zero, 0"
                        if(registradores[textoCodigo[linha][1]][1] > -1)
                            bolha = registradores[textoCodigo[linha][2]][1];
                        else
                            bolha = registradores[textoCodigo[linha][3]][1];
                        linha--;
                    }
                    break;
                
                case "or":
                    if((registradores[textoCodigo[linha][2]][1] == -1 && registradores[textoCodigo[linha][3]][1] == -1) || !stallJump)
                        atualizaRegistrador(textoCodigo[linha][1], registradores[textoCodigo[linha][2]][0] | registradores[textoCodigo[linha][3]][0], 3);
                    else {
                        document.getElementById(`codigo${ciclo}`).innerHTML = "sll $zero, $zero, 0"
                        if(registradores[textoCodigo[linha][2]][1] > -1)
                            bolha = registradores[textoCodigo[linha][2]][1];
                        else
                            bolha = registradores[textoCodigo[linha][3]][1];
                        linha--;
                    }
                    break;
                
                case "sll":
                    if(registradores[textoCodigo[linha][2]][1] == -1 || !stallJump)
                        atualizaRegistrador(textoCodigo[linha][1], registradores[textoCodigo[linha][1]][0] << parseInt(textoCodigo[linha][2]), 3)
                    else {
                        document.getElementById(`codigo${ciclo}`).innerHTML = "sll $zero, $zero, 0"
                        bolha = registradores[textoCodigo[linha][2]][1];
                        linha--;
                    }
                    break;
                
                case "srl":
                    if(registradores[textoCodigo[linha][2]][1] == -1 || !stallJump)
                        atualizaRegistrador(textoCodigo[linha][1], registradores[textoCodigo[linha][1]][0] >> parseInt(textoCodigo[linha][2]), 3)
                    else {
                        document.getElementById(`codigo${ciclo}`).innerHTML = "sll $zero, $zero, 0"
                        bolha = registradores[textoCodigo[linha][2]][1];
                        linha--;
                    }
                    break;
                
                case "sw":
                    if((registradores[textoCodigo[linha][1]][1] == -1 && registradores[textoCodigo[linha][3]][1] == -1) || !stallJump)
                        insereMemoria((parseInt(textoCodigo[linha][2]) + registradores[textoCodigo[linha][3]][0]).toString(16), registradores[textoCodigo[linha][1]][0]);
                    else {
                        document.getElementById(`codigo${ciclo}`).innerHTML = "sll $zero, $zero, 0"
                        if(registradores[textoCodigo[linha][1]][1] > -1)
                            bolha = registradores[textoCodigo[linha][2]][1];
                        else
                            bolha = registradores[textoCodigo[linha][3]][1];
                        linha--;
                    }
                    break;

                case "sub":
                    if((registradores[textoCodigo[linha][2]][1] == -1 && registradores[textoCodigo[linha][3]][1] == -1) || !stallJump)
                        atualizaRegistrador(textoCodigo[linha][1], registradores[textoCodigo[linha][2]][0] - registradores[textoCodigo[linha][3]][0], 3);
                    else {
                        document.getElementById(`codigo${ciclo}`).innerHTML = "sll $zero, $zero, 0"
                        if(registradores[textoCodigo[linha][2]][1] > -1)
                            bolha = registradores[textoCodigo[linha][2]][1];
                        else
                            bolha = registradores[textoCodigo[linha][3]][1];
                        linha--;
                    }
                    break;
            }
            linha++;
        }
    }
}

function finalizaPrograma(pos) {
    const cabecalho = document.getElementById("tab-cabecalho")
    cabecalho.innerHTML += `<th>${ciclo}</th>`;
    switch(pos) {
        case 1:
            document.getElementById(`${ciclo-pos}`).innerHTML += `<td id = "id${ciclo-pos}">ID</td>`
            
            document.getElementById(`${ciclo-pos-1}`).innerHTML += `<td id = "ex${ciclo-pos-1}">EX</td>`
            
            document.getElementById(`${ciclo-pos-2}`).innerHTML += `<td id = "mem${ciclo-pos-2}">MEM</td>`

            document.getElementById(`${ciclo-pos-3}`).innerHTML += `<td id = "wb${ciclo-pos-3}">WB</td>`
            break;
        
        case 2:
            document.getElementById(`${ciclo-pos}`).innerHTML += `<td id = "ex${ciclo-pos}">EX</td>`

            document.getElementById(`${ciclo-pos-1}`).innerHTML += `<td id = "mem${ciclo-pos-1}">MEM</td>`
            
            document.getElementById(`${ciclo-pos-2}`).innerHTML += `<td id = "wb${ciclo-pos-2}">WB</td>`
            break;
        
        case 3:
            document.getElementById(`${ciclo-pos}`).innerHTML += `<td id = "mem${ciclo-pos}">MEM</td>`

            document.getElementById(`${ciclo-pos-1}`).innerHTML += `<td id = "wb${ciclo-pos-1}">WB</td>`
            break;

        case 4:
            document.getElementById(`${ciclo-pos}`).innerHTML += `<td id = "wb${ciclo-pos}">WB</td>`
            break;

    }
}

function checkLinhas(arr) {
    if(arr.length > 0 && !arr[0].startsWith("#")) return true;
    return false
}

function resetaDiagrama() {
    registradoresModificar = [];
    diagrama.innerHTML = "<tr id='tab-cabecalho'></tr>";
    let temp = Object.entries(registradores);
    linha = 0;
    ciclo = 0;
    finish = 1;
    for(let i = 0; i < temp.length; i++) {
        resetaRegistrador(temp[i][0]) ;
    }
}

function resetaRegistrador(registrador) {
    registradores[registrador][0] = 0;
    registradores[registrador][1] = -1;
    registradores[registrador][2] = 0;
    document.getElementById(registrador).innerHTML = registradores[registrador][0]
}