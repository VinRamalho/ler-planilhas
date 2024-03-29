// CAPTURANDO OS BOTOES E INPUTS
const openbtn = document.getElementById("campoSelect");
const saveBtn = document.getElementById("env");
const base = document.getElementById('base');
const msg = document.getElementById('msg');
const btnConsulta = document.getElementById('bntConsulta');
const btnLimpar = document.getElementById('btnApagarTabela');
const toastTrigger = document.getElementById('liveToastBtn');
const toastLiveExample = document.getElementById('liveToast');
document.getElementById("env").disabled = true;
let int;
let setTime = 0;

// DECLARACAO DE ARRAYS VAZIOS.
let arr1 = [];
let arr2 = [];

// MOSTRA O CARREGAMENTO NA TELA PRINCIPAL
const mostrarCarregando = () => {
    const loading = document.getElementById('loading');
    loading.classList.add("spinner-grow");
    setTimeout(() => {
        loading.classList.remove("spinner-grow");
    }, 10000);
}

// OCULTA O CARREGAMENTO NA TELA PRINCIPAL
const ocultarCarregando = () => {
    const loading = document.getElementById('loading');
    loading.classList.remove("spinner-grow");
}

// MOSTRA O CARREGAMENTO NA TELA AONDE MOSTRA DE TABELA
const mostrarCarregandoConsulta = () => {
    const loadingConsulta = document.getElementById('loadingConsulta');
    loadingConsulta.classList.add("spinner-grow");
    setTimeout(() => {
        loadingConsulta.classList.remove("spinner-grow");
    }, 10000);
}

// OCULTA O CARREGAMENTO NA TELA AONDE MOSTRA DE TABELA
const ocultarCarregandoConsulta = () => {
    const loadingConsulta = document.getElementById('loadingConsulta');
    loadingConsulta.classList.remove("spinner-grow");
}

// ESSA CLASSE LÊ UMA PLANILHA DE EXCEL E TRANFORMA TODO O CONTEUDO EM UM JSON. INSERINDO OS CAMPOS DESEJADOS NOS ARRAYS.
const ExcelToJSON = function () {
    this.parseExcel = function (file) {
        let reader = new FileReader();

        reader.onload = function (e) {
            let data = e.target.result;
            let workbook = XLSX.read(data, {
                type: "binary",
            });

            workbook.SheetNames.forEach(function (sheetName) {
                let XL_row_object = XLSX.utils.sheet_to_row_object_array(
                    workbook.Sheets[sheetName]
                );
                let dataColuns = XL_row_object;
                console.log(dataColuns);
                for (i = 0; i < dataColuns.length; i++) {
                    arr1.push(dataColuns[i].id)
                    arr2.push(dataColuns[i].quantidade)
                }
                if (dataColuns.length >= 501) {
                    setTimeout(() => {
                        setTime = 0;
                        const toast = new bootstrap.Toast(toastLiveExample)
                        msg.classList.remove('sucess')
                        msg.classList.add('error')
                        document.getElementById('msg').innerText = "ERRO: A TABELA SÓ ENVIA NO MAXIMO 500 LINHAS POR VEZ"
                        document.getElementById('time').innerText = "agora"
                        toast.show(5000)
                        clearInterval(int)
                        int = setInterval(() => {
                            setTime++
                            document.getElementById('time').innerText = `${setTime} min`
                        }, 60000)
                        arr1 = [];
                        arr2 = [];
                    })
                }
            });
        };
        reader.onerror = function (ex) {
            console.log(ex);
        };

        reader.readAsBinaryString(file);
    };
};

// ESSA FUNCAO PEGA OS ARRAYS E IMPRIME EM DUAS TABELAS OS VALORES.
const imprimeNaTela = () => {
    for (i = 0; i < arr1.length; i++) {
        const tr1 = document.createElement('tr');
        tr1.classList.add("liRemove");
        const liArray1 = document.createElement('td');
        liArray1.classList.add("liRemove");
        liArray1.innerText = arr1[i]

        document.getElementById("table1").appendChild(tr1)

        tr1.appendChild(liArray1)
    }
    for (i = 0; i < arr2.length; i++) {
        const tr2 = document.createElement('tr');
        tr2.classList.add("liRemove");
        const liArray2 = document.createElement('td');
        liArray2.classList.add("liRemove");
        liArray2.innerText = arr2[i]

        document.getElementById("table2").appendChild(tr2)

        tr2.appendChild(liArray2)
    }
    saveBtn.disabled = false;
    ocultarCarregando();
}

// ESSA FUNCAO:
// * VERIFICA SE OS ARRAYS JA TEM CONTEUDO (caso tenha ela limpa).
// * CASO JA TENHA CONTEUDO NA TABELA ELA LIMPA.
// * SELECIONA O ARQUIVO E MANDA PARA A CLASSE QUE TRANFORMA EXCEL EM JSON. 
const selecaoDeArquivo = (evt) => {
    if (arr1.length > 0 || arr2.length > 0) {
        arr1 = [];
        arr2 = [];
    }

    let lista = document.getElementsByClassName("liRemove");
    for (let i = lista.length - 1; i >= 0; i--) {
        lista[i].remove()
    }

    let files = evt.target.files; // FileList object
    let xl2json = new ExcelToJSON();
    xl2json.parseExcel(files[0]);
    mostrarCarregando()
    setTimeout(() => { imprimeNaTela(); }, 1000)
}

// ESSA FUNCAO PEGA OS ARRAY COM OS VALORES E ENVIA PARA O BACK-END.
const pegarDados = () => {
    const dados = `{"dados1": [${arr1}], "dados2": [${arr2}]}`;
    return JSON.parse(dados);
};

// ESSA FUNCAO ENVIA OS DADOS E RETORNA "SUCESSO" OU "ERRO".
const enviaDados = () => {
    $('#loading').addClass("spinner-grow");
    $.ajax({
        crossDomain: true,
        url: "http://192.168.100.155:8000/api/file",
        type: "GET",
        dataType: "json",
        data: pegarDados(),
        contentType: "application/json",
    })
        .done(function (response) {
            // console.log(response);
            mostrarCarregando()
            if (response.message === "Dados arquivados com sucesso") {
                msg.classList.remove('error')
                msg.classList.add('sucess')
                saveBtn.disabled = true;
                setTimeout(() => {
                    setTime = 0;
                    const toast = new bootstrap.Toast(toastLiveExample)
                    msg.innerText = "Dados Salvos com sucesso"
                    document.getElementById('time').innerText = "agora"
                    toast.show(5000)
                    clearInterval(int)
                    int = setInterval(() => {
                        setTime++
                        document.getElementById('time').innerText = `${setTime} min`
                    }, 60000)
                }, 500)
            } else {
                msg.classList.remove('sucess')
                msg.classList.add('error')
                setTimeout(() => {
                    setTime = 0;
                    const toast = new bootstrap.Toast(toastLiveExample)
                    msg.innerText = "ERRO dados NÃO enviados"
                    toast.show(5000)
                    document.getElementById('time').innerText = "agora"
                    clearInterval(int)
                    int = setInterval(() => {
                        setTime++
                        document.getElementById('time').innerText = `${setTime} min`
                    }, 60000)
                }, 500)
            }
            ocultarCarregando();
        })
        .fail(function (error) {
            console.log(error);
            // alert('API NÃO RESPONDE');
            setTimeout(() => {
                setTime = 0;
                const toast = new bootstrap.Toast(toastLiveExample)
                document.getElementById('msg').innerText = "API NÃO RESPONDE"
                toast.show(5000)
                document.getElementById('time').innerText = "agora"
                clearInterval(int)
                int = setInterval(() => {
                    setTime++
                    document.getElementById('time').innerText = `${setTime} min`
                }, 60000)
            }, 500)
            ocultarCarregando();
        });
};

// ESSA FUNCAO BUSCA TODO O CONTEUDO DA TABELA. TRATA ERRO OU TABELA VAZIA. E MANDA PARA A FUNCAO DE IMPRIMIR NA TABELA
const consultaTabela = async () => {
    try {
        mostrarCarregandoConsulta()
        document.getElementById("table1Consulta").innerText = "";
        document.getElementById("table2Consulta").innerText = "";
        const result = await fetch(`http://192.168.100.155:8000/api/getall`);
        const data = await result.json();
        preencheConsulta(data)
        ocultarCarregandoConsulta();
        if (data.length == 0) {
            // alert('A TABELA ESTA VAZIA')
            msg.classList.remove('sucess')
            msg.classList.remove('error')
            setTimeout(() => {
                setTime = 0;
                const toast = new bootstrap.Toast(toastLiveExample)
                document.getElementById('msg').innerText = "A TABELA ESTA VAZIA"
                toast.show(5000)
                document.getElementById('time').innerText = "agora"
                clearInterval(int)
                int = setInterval(() => {
                    setTime++
                    document.getElementById('time').innerText = `${setTime} min`
                }, 60000)
            }, 500)
        }
    } catch {
        // alert('API NÃO RESPONDE')
        setTimeout(() => {
            setTime = 0;
            const toast = new bootstrap.Toast(toastLiveExample)
            document.getElementById('msg').innerText = "API NÃO RESPONDE"
            toast.show(5000)
            document.getElementById('time').innerText = "agora"
            clearInterval(int)
            int = setInterval(() => {
                setTime++
                document.getElementById('time').innerText = `${setTime} min`
            }, 60000)
        }, 500)
    }
}

// ESSA FUNCAO PASSA UM FOREACH NA CONSULTA E IMPRIME TUDO NA TABELA
const preencheConsulta = async (data) => {
    const dados = Object.entries(data)
    dados.forEach(([index, dado]) => {
        ////////////////////////////////////////////////////
        const tr1 = document.createElement('tr');
        tr1.classList.add("liRemoveConsulta");
        const liArray1 = document.createElement('td');
        liArray1.classList.add("liRemoveConsulta");
        liArray1.innerText = dado.dados1;

        document.getElementById("table1Consulta").appendChild(tr1)

        tr1.appendChild(liArray1)
        ////////////////////////////////////////////////////
        const tr2 = document.createElement('tr');
        tr2.classList.add("liRemoveConsulta");
        const liArray2 = document.createElement('td');
        liArray2.classList.add("liRemoveConsulta");
        liArray2.innerText = dado.dados2;

        document.getElementById("table2Consulta").appendChild(tr2)

        tr2.appendChild(liArray2)
        ////////////////////////////////////////////////////
    });
}

// ESSA FUNCAO APAGA TODO CONTEUDO DA TABELA E TRATA ERRO
const apagaTabela = async () => {
    try {
        mostrarCarregando()
        const data = await fetch('http://192.168.100.155:8000/api/deleteFile')
            .then(data => {
                return data.json();
            })
        const dataJson = await data;
        if (dataJson.message === "Tabela apagada com sucesso") {
            document.getElementById("table1").innerText = "";
            document.getElementById("table2").innerText = "";
            document.getElementById('btnClose').click();
            setTimeout(() => {
                setTime = 0;
                msg.classList.remove('sucess');
                msg.classList.add('error');
                const toast = new bootstrap.Toast(toastLiveExample)
                msg.innerText = dataJson.message;
                toast.show(5000)
                document.getElementById('time').innerText = "agora"
                clearInterval(int)
                int = setInterval(() => {
                    setTime++
                    document.getElementById('time').innerText = `${setTime} min`
                }, 60000)
            }, 500)
        } else {
            msg.classList.remove('error');
            msg.classList.add('sucess');
            setTimeout(() => {
                setTime = 0;
                msg.classList.remove('sucess');
                msg.classList.add('error');
                const toast = new bootstrap.Toast(toastLiveExample)
                msg.innerText = "ERRO: A tabela NÃO foi limpa.";
                toast.show(5000)
                document.getElementById('time').innerText = "agora"
                clearInterval(int)
                int = setInterval(() => {
                    setTime++
                    document.getElementById('time').innerText = `${setTime} min`
                }, 60000)
            }, 500)
        }
        ocultarCarregando()
    } catch {
        document.getElementById('btnClose').click();
        alert('API NÃO RESPONDE');
        setTimeout(() => {
            setTime = 0;
            const toast = new bootstrap.Toast(toastLiveExample)
            document.getElementById('msg').innerText = "API NÃO RESPONDE"
            toast.show(5000)
            document.getElementById('time').innerText = "agora"
            clearInterval(int)
            int = setInterval(() => {
                setTime++
                document.getElementById('time').innerText = `${setTime} min`
            }, 60000)
        }, 500)
    }
}

// ESSA FUNCAO, DEPOIS DE ROLAR 100 PIXELS PRA BAIXO CHAM A FUNCAO (scrollToTop)
$(function () {
    $(document).on('scroll', function () {
        if ($(window).scrollTop() > 100) {
            $('.smoothscroll-top').addClass('show');
        } else {
            $('.smoothscroll-top').removeClass('show');
        }
    });
    $('.smoothscroll-top').on('click', scrollToTop);
});

// ESSA FUNCAO MOSTRA O BOTAO DE VOLTAR PRA CIMA DE NOVO
const scrollToTop = () => {
    verticalOffset = typeof (verticalOffset) != 'undefined' ? verticalOffset : 0;
    element = $('body');
    offset = element.offset();
    offsetTop = offset.top;
    $('html, body').animate({ scrollTop: 50 }, 100).animate({ scrollTop: 0 }, 50);
}

// ESSE EVENTO NO INPUT, ASSIM UQE SUBIR UM ARQUIVO CHAMA A FUNCAO selecaoDeArquivo.
document.getElementById('upload').addEventListener('change', selecaoDeArquivo);

// ESSE EVENTO NO BOTAO DE ENVIAR, CHAMA A FUNCAO enviaDados()
document.getElementById('env').addEventListener('click', () => { enviaDados() });

// ESSE EVENTO NO BOTAO DE CONSULTAR TABELA
btnConsulta.addEventListener('click', () => { consultaTabela() });

// ESSE EVENTO NO BOTAO DE APAGAR
btnLimpar.addEventListener('click', () => { apagaTabela() })

// ESSE EVENTO OCORRE APOS A PAGINA SER CARREGADA, E AJUSTA O TAMANHO DA 
//TABELA DE CONSULTA, DE ACORDO COM A TELA DO USUARIO
document.addEventListener('DOMContentLoaded', (e) => {
    const tabela = document.getElementById('tabelaConsulta');
    let height = e.path[1].screen.availHeight;
    let width = e.path[1].screen.availWidth;
    tabela.style.height = height - 100 + "px";
    if (width <= 768) {
        tabela.style.height = height - 150 + "px";
    }
})


// <-- EXEMPLOS PARA USO DE localStorage -->

// let myObj = [
//     { 'name': 'Gabriel', 'age': 25 },
//     { 'name': 'Patrick', 'age': 38 },
//     { 'name': 'Moacir', 'age': 56 },
//     { 'name': 'Paty', 'age': 23 },
//     { 'name': 'Logan', 'age': 30 }
// ]


// localStorage.setItem("pessoas", JSON.stringify(myObj));



// for (let i = 0; i < localStorage.length; i++) {
//     let key = localStorage.key(i);
//     let value = localStorage.getItem(key);
//     console.log(JSON.parse(value));
// }
