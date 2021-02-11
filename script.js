'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const imagesContainer = document.querySelector(".images");

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

// btn.addEventListener('click', function () {
//   getCountry('Australia');
//   countriesContainer.innerHTML = '';
// });

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

////////////////////////////////////////////

// Coding Challenge #1

/*
  In this challenge you will build a function 'whereAmI' which renders a country
only based on GPS coordinates. For that, you will use a second API to geocode
coordinates. So in this challenge, you’ll use an API on your own for the first time �
Your tasks:

PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value ('lat')
and a longitude value ('lng') (these are GPS coordinates, examples are in test
data below).

2. Do “reverse geocoding” of the provided coordinates. Reverse geocoding means
to convert coordinates to a meaningful location, like a city and country name.
Use this API to do reverse geocoding: https://geocode.xyz/api. The AJAX call
will be done to a URL with this format:
https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and
promises to get the data. Do not use the 'getJSON' function we created, that
is cheating �

3. Once you have the data, take a look at it in the console to see all the attributes
that you received about the provided location. Then, using this data, log a
message like this to the console: “You are in Berlin, Germany”

4. Chain a .catch method to the end of the promise chain and log errors to the
console

5. This API allows you to make only 3 requests per second. If you reload fast, you
will get this error with code 403. This is an error with the request. Remember,
fetch() does not reject the promise in this case. So create an error to reject
the promise yourself, with a meaningful error message
PART 2

6. Now it's time to use the received data to render a country. So take the relevant
attribute from the geocoding API result, and plug it into the countries API that
we have been using.

7. Render the country and catch any errors, just like we have done in the last
lecture (you can even copy this code, no need to type the same code)
The Complete JavaScript Course 31
Test data:
§ Coordinates 1: 52.508, 13.381 (Latitude, Longitude)
§ Coordinates 2: 19.037, 72.873
§ Coordinates 3: -33.933, 18.474

*/

// build a function 'whereAmI' which renders a country only based on GPS coordinates.



// const whereAmI = function (lat, long) {

//   const coords = [lat,long];
 
//   // fetch data
//   fetch(`https://geocode.xyz/${coords}?geoit=json`)
//     .then((response) => {
//         if (response.status === 403)
//           throw new Error(`You are reloading the page soo fast : ${response.status}`)

//         if (!response.ok)
//           throw new Error(`Cannot found the current location : ${response.status}`);  

//         // Como response é o body do HTML request , converte-se o JSON em objeto usando o metodo .json() 
//         return response.json();
//     })
//     .then((data) => {
//       // console.log(data);
//       console.log(`You are in ${data.city}, ${data.country}`)
//       return fetch(`https://restcountries.eu/rest/v2/name/${data.country}?fullText=true`)
//     })
//     .then((res) => {
//       if(!res.ok)
//         throw new Error(`Cannot found the current location: ${res.status}`);
//       return res.json()
//     })
//     .then((data) => {
//       const [country] = data;
//       renderContries(country, "");
//     })
//     .catch((err) => console.log(`Something went wrong 💣💣 : ${err.message}`));
// }

// whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);
// whereAmI(-33.933, 18.474);

// Geolocation API 

// setTimeout(() => {
//   navigator.geolocation.getCurrentPosition((geolocation) => {

//     const {latitude,longitude} = geolocation.coords;
//     whereAmI(latitude,longitude);
  
//   }, () => alert("Error"))
// },2000)

// Assyncronos Behind the scenes: 

// Events: Event Handler (Callback) -> Web API's enviroment -> Quando a operação assincrona é finaliza -> CallBack Queue -> (CallStack === "") ? Event Handler da Callback Queue -> Call Stack (Execução) : Wait call stack to be empty 

// AJAX : AJAX CALLS -> Web API's enviroment -> Quando a operação assincrona é finaliza -> Microtasks Queue -> (CallStack === "") ? AJAX operation da Microtasks Queue -> Call Stack (Execução) : Wait call stack to be empty

// OBS: Microtasks possuem prioridade em relação a CallBack

// Ex: Números representam a ordem de execução

// console.log("Test start"); // 1
// setTimeout(() => console.log("0 sec timer"),0); // 4

// Criando uma promise que é sempre bem sucedida
// Promise.resolve("Resolved promise 1").then(res => console.log(res)); //3
// console.log("Test end"); // 2

// Ex: Como as microtask serão executadas como prioridade, ao utilizarmos o setTimeout que esta na Callback Queue ele pode ser executado após o tempo passado como parâmetro caso a microtask exija um tempo considerável para ser executada 

// setTimeout(() => console.log("0 sec timer"),0); // delay de +- 1 sec
// Promise.resolve("Resolved promise").then((res) => {
//   for(let i = 0; i < 1000000000 ; i++) {}
// })

// Building Promises 

const lotteryPromise = new Promise(function (resolve,reject) {
  // Executor function -> Defini o comportamento do resultado da operação async

  console.log("Lotter draw is happening 🔮")
  // Aplicando comportamento Async a promise
  setTimeout( function () {
    if(Math.random() >= 0.5) {
      // Promise fullfiled
      resolve("You win 💰")
    } else {
      // Promise Rejected
      reject(new Error("You lost your money 💩")) // <- err 
    }
  }, 2000)
  
})

lotteryPromise.then(res => console.log(res)).catch(err => console.error(err));

// Na maior parte do tempo vamos apenas consumir promises (EX: Uso de uma API). Entrentanto, criando uma promise podemos forçar uma função a ter um comportamento assincrono, retornando uma promise

const wait = function (sec) {
  return new Promise(function (resolve) {
    setTimeout(resolve, sec * 1000);
  });
};

wait(2).then(() => {
  console.log("I waited for 2 seconds");
})

console.log("I wil be executed first")

// Promisifying the Geolocation API 
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    // navigator.geolocation.getCurrentPosition(
    //   position => resolve(position),
    //   err => reject(err)
    // )
    navigator.geolocation.getCurrentPosition(resolve,reject);
  })
}

const whereAmI = function () {

  getPosition().then((pos) => {
    const {latitude: lat , longitude : lng} = pos.coords
    return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
  })
    .then((response) => {
        if (response.status === 403)
          throw new Error(`You are reloading the page soo fast : ${response.status}`)

        if (!response.ok)
          throw new Error(`Cannot found the current location : ${response.status}`);  

        // Como response é o body do HTML request , converte-se o JSON em objeto usando o metodo .json() 
        return response.json();
    })
    .then((data) => {
      // console.log(data);
      console.log(`You are in ${data.city}, ${data.country}`)
      return fetch(`https://restcountries.eu/rest/v2/name/${data.country}?fullText=true`)
    })
    .then((res) => {
      if(!res.ok)
        throw new Error(`Cannot found the current location: ${res.status}`);
      return res.json()
    })
    .then((data) => {
      const [country] = data;
      renderContries(country, "");
    })
    .catch((err) => console.log(`Something went wrong 💣💣 : ${err.message}`));
}

btn.addEventListener("click",whereAmI)


///////////////////////////////////

// Coding Challenge # 2

/*
For this challenge you will actually have to watch the video! Then, build the image loading functionality that I just showed you on the screen.
Your tasks:
Tasks are not super-descriptive this time, so that you can figure out some stuff by
yourself. Pretend you're working on your own �
PART 1
1. Create a function 'createImage' which receives 'imgPath' as an input.
This function returns a promise which creates a new image (use
document.createElement('img')) and sets the .src attribute to the
provided image path
2. When the image is done loading, append it to the DOM element with the
'images' class, and resolve the promise. The fulfilled value should be the
image element itself. In case there is an error loading the image (listen for
the'error' event), reject the promise
3. If this part is too tricky for you, just watch the first part of the solution
PART 2
4. Consume the promise using .then and also add an error handler
5. After the image has loaded, pause execution for 2 seconds using the 'wait'
function we created earlier
6. After the 2 seconds have passed, hide the current image (set display CSS
property to 'none'), and load a second image (Hint: Use the image element
returned by the 'createImage' promise to hide the current image. You will
need a global variable for that �)
7. After the second image has loaded, pause execution for 2 seconds again
8. After the 2 seconds have passed, hide the current image
Test data: Images in the img folder. Test the error handler by passing a wrong
image path. Set the network speed to “Fast 3G” in the dev tools Network tab,
otherwise images load too fast


*/

// const createImage = function (imgPath) {
//   return new Promise(function (resolve,reject) {
//     const img = document.createElement('img');
//     img.src = `${imgPath}`; // async 

//     //Load Event 
//     img.addEventListener("load", function () {
//       imagesContainer.append(img);
//       resolve(img);
//     })
    
//     // Loading error event
//     img.addEventListener("error", function () {
//       reject(new Error("Image not found 💩"));
//     })
//   })
// }

// let currentImg 
// createImage("/img/img-1.jpg")
//   .then((img) => {
//     currentImg = img;
//     return wait(2)
//   })
//   .then(() => {
//     currentImg.style.display = "none";
//     return createImage("img/img-2.jpg");
//   })
//   .then((img) => {
//     currentImg = img;
//     return wait(2);
//   })
//   .then(() => currentImg.style.display = "none")
//   .catch((err) => imagesContainer.insertAdjacentText('beforeend', `${err}`));

  // NO ES2017, foi adicionado uma nova feature ao js que facilita o processo de consumir novas promisses - async await 


  // É uma função que é executada de forma assincrona que automaticante retorna uma promisse 
// Obs: await [Promisse que deseja retornar ]

  // async await is a syntatic sugar of then method 
  /*
    fetch("Api Endpoint").then((response) => console.log(response))
  */

  const getPosition2 = async function () {
    return new Promise(function (resolve,reject) {
      // if the request be sucessed the first callback will receive the position object
      navigator.geolocation.getCurrentPosition(resolve,reject);
    })
  }



  const whereAmIAsync = async function () {
    try {
      const {coords} = await getPosition2();
      const { latitude : lat,longitude: lng } = coords;
  
      // await wait for the result of this promisse - stop execution until the promisse is returned
  
      //  Geocoding
      const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
      if (!resGeo.ok) 
        throw new Error("Failed to get the data of geocode api")
      if (resGeo.status === 403)
        throw  new Error("Teste")
      const dataGeo = await resGeo.json();


  
      // Rest Country API
      const dataCountry = await fetch(`https://restcountries.eu/rest/v2/name/${dataGeo.country}`);
      if (!resGeo.ok) 
        throw new Error("Failed to get the data of rest countries api");
      const [responseCountry] = await dataCountry.json()
      renderContries(responseCountry);
    } catch (err) {
      console.error(err.message);
      renderError(`${err.message}`)
    }

  }


// catch has acess to every error that ocorred in the try block . 
/*
try {
  const y = 3;
  y = 10; 

  
} catch (err) {
  alert(err.message);
}

*/