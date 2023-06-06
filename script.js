// Função para gerar um ID único
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Função para cadastrar um livro
function cadastrarLivro() {
  var titulo = document.getElementById("titulo").value;
  var autor = document.getElementById("autor").value;
  var editora = document.getElementById("editora").value;
  var ano = parseInt(document.getElementById("ano").value);
  var preco = parseFloat(document.getElementById("preco").value);

  var livro = {
    id: generateUUID(),
    titulo: titulo,
    autor: autor,
    editora: editora,
    ano: ano,
    preco: preco,
  };

  fetch("http://localhost:8080/livros", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(livro),
  })
    .then(function (response) {
      if (response.ok) {
        console.log("Livro cadastrado com sucesso!");
      } else {
        throw new Error(
          "Erro na requisição. Status do erro: " + response.status
        );
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

// Função para exibir os livros na tabela
function exibirLivros() {
  fetch("http://localhost:8080/livros", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      var livros = response.data;
      console.log(response);

      var table = document.getElementById("livrosTable");
      table.innerHTML = "";

      for (var i = 0; i < livros.length; i++) {
        var row = table.insertRow(i + 1);

        var idCell = row.insertCell(0);
        idCell.innerHTML = livros[i].id;

        var tituloCell = row.insertCell(1);
        tituloCell.innerHTML = livros[i].titulo;

        var autorCell = row.insertCell(2);
        autorCell.innerHTML = livros[i].autor;

        var editoraCell = row.insertCell(3);
        editoraCell.innerHTML = livros[i].editora;

        var anoCell = row.insertCell(4);
        anoCell.innerHTML = livros[i].ano;

        var precoCell = row.insertCell(5);
        precoCell.innerHTML = livros[i].preco.toFixed(2);

        var actionsCell = row.insertCell(6);
        actionsCell.innerHTML =
          '<button class="button button-red" onclick="deletarLivro(\'' +
          livros[i].id +
          "')\">Deletar</button>" +
          '<button class="button button-blue" onclick="editarLivro(\'' +
          livros[i].id +
          "')\">Editar</button>";
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

// Função para deletar um livro
function deletarLivro(id) {
  //   axios
  //     .delete("/" + `/${id}`)
  //     .then(function (response) {
  //       exibirLivros();
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
}

// Função para buscar um livro por título
function buscarLivro() {
  var buscaTitulo = document.getElementById("busca_titulo").value.toLowerCase();
  var buscaAutor = document.getElementById("busca_autor").value.toLowerCase();
  const autorQuery = autor && autor.length ? `autor=${buscaAutor}` : "";
  const tituloQuery = titulo && titulo.length ? `autor=${buscaTitulo}` : "";

  fetch(`http://localhost:8080/livros?` + autorQuery + "&" + tituloQuery, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      var livros = response.data;
      exibirLivros(livros);
    })
    .catch(function (error) {
      console.log(error);
    });
}

// Função para editar um livro
function editarLivro(id) {
  var index = -1;

  for (var i = 0; i < livros.length; i++) {
    if (livros[i].id === id) {
      index = i;
      break;
    }
  }

  if (index !== -1) {
    var livro = livros[index];
    document.getElementById("titulo").value = livro.titulo;
    document.getElementById("autor").value = livro.autor;
    document.getElementById("editora").value = livro.editora;
    document.getElementById("ano").value = livro.ano;
    document.getElementById("preco").value = livro.preco.toFixed(2);

    var salvarButton = document.createElement("button");
    salvarButton.innerHTML = "Salvar";
    salvarButton.className = "button button-green";
    salvarButton.onclick = function () {
      livro.titulo = document.getElementById("titulo").value;
      livro.autor = document.getElementById("autor").value;
      livro.editora = document.getElementById("editora").value;
      livro.ano = parseInt(document.getElementById("ano").value);
      livro.preco = parseFloat(document.getElementById("preco").value);

      fetch("http://localhost:8080/livros", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(livro),
      })
        .then(function (response) {
          exibirLivros();
          limparFormulario();
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    var div = document.getElementById("livrosTable").parentNode;
    div.appendChild(salvarButton);
  }
}

// Função para limpar o formulário
function limparFormulario() {
  document.getElementById("titulo").value = "";
  document.getElementById("autor").value = "";
  document.getElementById("editora").value = "";
  document.getElementById("ano").value = "";
  document.getElementById("preco").value = "";
}

// Carrega a lista de livros ao carregar a página
window.onload = function () {
  exibirLivros();
};
