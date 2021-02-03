'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderContries = function (data, countryName) {
  const html = `
    <article class="country ${countryName}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        Number(data.population) / 1000000
      ).toFixed(1)} millions</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>
    `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', `${msg}`);
};

///////////////////////////////////////

/* ASYNC JS: Os códigos assincronos são executados em paralelo aos códigos sincronos, assim sua execução não precisa ser finalizada para o código sincrono ser executado. Ex: setTimeout(function,2000).

Os códigos assincronos estão presentes na chamada de API'S através do AJAX (Assyncronos JS and XML):

As APIS são ,basicamente, um pedaço de um software que pode ser aproveitado por um outro pedaço de software, permitindo a troca de informação entre dois sistemas.

// AJAX: Nos permite comunicarmos com um web server de maneira assincrona. Com as chamadas AJAX podemos solicitar dados de um web server de maneira dinâmica (sem recarregar página)

Client -> HTTP Request (GET - get Data, POST - send data, etc...) 
Web Server (Normalmente, uma API) -> Response (Send data back)

*/

// countryName receives "" for the current country e "neighbor" for the country neighbor

// const getCountryInfo = function (country) {
//   const request = new XMLHttpRequest();
//   // Abrindo uma requisição - request.open("Tipo de Requisição", "END POINT DA API - LINK QUE CONTÉM OS DADOS QUE SERÃO SOLICITADOS")
//   request.open('GET', `https://restcountries.eu/rest/v2/name/${country}`);

//   // Solicitando a requisição
//   request.send();

//   // As funcionalidades do programa dependem que os dados da API sejam carregados, dessa forma definiu-se um event handler para o loading da requisição
//   request.addEventListener('load', function () {
//     const response = this.responseText;

//     // Converter o JSON da API em objeto:
//     const [data] = JSON.parse(response);
//     console.log(data);

//     renderContries(data, '');
//   });
// };

// getCountryInfo('brazil');

// Sequence of Ajax Calls - Render neighbours

// CallBack Hell : Não é uma boa prática, deixa o código dificil de se ler

// const getCountryAndNeighbor = function (country) {
//   const request = new XMLHttpRequest();

//   request.open('GET', `https://restcountries.eu/rest/v2/name/${country}`); // GET HTTP request
//   request.send();

//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);
//     renderContries(data, '');
//     console.log(data);

//     // Request neighbour
//     const [neighbour] = data.borders; // country code

//     const request2 = new XMLHttpRequest();
//     request2.open('GET', `https://restcountries.eu/rest/v2/alpha/${neighbour}`);
//     request2.send();

//     request2.addEventListener('load', function () {
//       const data2 = JSON.parse(this.responseText);
//       renderContries(data2, 'neighbour');
//     });
//   });
// };

// getCountryAndNeighbor('brazil');

// Modern Way to make AJAX - fetch api

// Promisses - É um Obj que armazena os dados que serão recebidos após o request (A container for a future value)

/*  Vantagens:
    - Usando Promisses não precisamos contar com eventos ou callbacks que contém funções assincronas
    - We can chain promisses for a sequence of asynchronous -  Solve callback hell problem

    LifeCycling: Pending -> Settled (Asynchronous task has finished) -> Fulfilled (Fetch data Sucess) or Rejected (Error)

*/

// Promises: A promise é um objeto que representa a eventual conclusão ou falha de uma operaçaõ assincrona. É um objeto que armazena o resultado de uma operação assincrona

// const getCountry = function (country) {
//   // return promises - Objeto que contém dados sobre o request, then (Request foi aceito e retornou uma promises com os dados solicitados).

//   // fetch -> build a promise
//   fetch(`https://restcountries.eu/rest/v2/name/${country}`)
//     .then(
//       response => response.json(),
//       // OBS: HTTP response, has a body that contains a JSON if we get the response of an API or HTML in case of we get a web page.
//       err => console.log(err.message)
//     ) // .json parsing the body text as JSON.
//     .then(data => {
//       // console.log(data); // Retorna um array que contém o objeto que esta sendo solicitado no fetch
//       renderContries(data[0], '');
//       const [neighbour] = data[0].borders;
//       return fetch(`https://restcountries.eu/rest/v2/alpha/${neighbour}`);
//     })
//     .then(response => response.json()) // parsing the body text as JSON.
//     .then(data => renderContries(data, 'neighbour'))
//     .catch(() => renderError()) // identifica error de maneira global, ou seja, erros que ocorrem em toda chain promisse.
//     .finally(() => (countriesContainer.style.opacity = 1)); // função é executada sempre, independendo do resultado da requisição (failed or sucess)
// };

// Handle errors in promisses só são disparados quando o usuário perde a conexão de internet - promisses não foram preenchidas

/* 

Promisses.them(sucess func,err func): Chama a callback do segundo parametro para os erros que ocorrem na promisse que chamou o metodo 

Promisses.catch(): Chama uma callback para todo erro de fetch da promisse chain

Promisses.finally(): Metodo da promisses que sempre executa a callback, independendo do resultado do request

*/

btn.addEventListener('click', function () {
  getCountry('Australia');
  countriesContainer.innerHTML = '';
});

// A callback do erro não é disparada se fizermos um fetch de uma pagina que não existe/não pode ser encontrada - 404, para corrig"irmos tal limitação, vamos definir a callback para este erro manualmente. In this case, the propertie ok of the promise that was returned by fetch() is false.

// getCountry('aosaskapsk'); // Page cannot be found

const getJSON = function (url, errMsg = 'Something went wrong 💣💣 : ') {
  return fetch(`${url}`).then(response => {
    // Page not found (404)
    if (!response.ok) throw new Error(`${errMsg}`); // throw -> se linha for executada muda status da promise para failed, seta err.msg

    return response.json();
  });
};

const getCountry = function (country) {
  // fetch -> build a promise
  getJSON(`https://restcountries.eu/rest/v2/name/${country}`)
    .then(data => {
      renderContries(data[0], '');
      const [neighbour] = data[0].borders;

      if (!neighbour) throw new Error('There are no neighbors in this country');

      return getJSON(`https://restcountries.eu/rest/v2/alpha/${neighbour}`);
    })
    .then(data => renderContries(data, 'neighbour'))
    .catch(err => renderError(`Something went wrong 💣💣 : ${err.message}`))
    .finally(() => (countriesContainer.style.opacity = 1));
};

// getCountry('asaoksap');
