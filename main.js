'use strict';

let bookData = [];
//responseJson.Similar.Results[i].name

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    return queryItems.join('&');
}

function getGoogleApi(searchTerm) {
    //Googlebooks api
    console.log(searchTerm);
    const keyGoogle = 'AIzaSyA8VKI7V3csSpGGiqz2bNyjEOzaTzn30Tc';
    const googleURL = 'https://www.googleapis.com/books/v1/volumes';
    const params = {
        q: searchTerm,
        key: keyGoogle
    }
    const queryString = formatQueryParams(params);
    const url = `${googleURL}?${queryString}`;
    console.log(url)

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayImages(responseJson))
        .then(() => {
            for(let i = 0; i < bookData.length; i++){
            getGoogleTasteApi(bookData[i])}})
        .catch(err => {
            $('.mainbook').text(`Something went wrong: ${err.message}`);
        });
}

function getTasteApi(searchTerm) {
    //Get TasteDiveApi
    const keyTaste = '323255-booksapi-QJEP8SJ8';
    const tasteURL = 'https://tastedive.com/api/similar';
    const params = {
        k: keyTaste,
        type: 'books',
        q: searchTerm,
        limit: 8,
        info: 1
    }
    const queryString = formatQueryParams(params);
    const url = `${tasteURL}?${queryString}`;
    
    console.log(url);

    $.ajax({
        dataType: "jsonp",
        url: url,
        data: queryString,
        success: function(responseJson){
            //displayTasteImages(searchTerm)
            const booksName = responseJson.Similar.Results;
            for (let i = 0; i < booksName.length; i++){
                bookData.push(booksName[i].Name)
            }
            getGoogleApi(searchTerm);
        }
    });
}

//run a for loop outside of getGoogleTasteApi

function getGoogleTasteApi(bookData) {
    //Googlebooks api
    console.log(bookData);
    const keyGoogle = 'AIzaSyA8VKI7V3csSpGGiqz2bNyjEOzaTzn30Tc';
    const googleURL = 'https://www.googleapis.com/books/v1/volumes';
    
    const params = {
        q: bookData,
        key: keyGoogle
    }
       
    console.log(params);
    const queryString = formatQueryParams(params);
    const url = `${googleURL}?${queryString}`;
    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayTasteImages(responseJson))
        .catch(err => {
            $('.mainbook').text(`Something went wrong: ${err.message}`);
        });
}

function displayImages(responseJson) {
    $('.mainbook').empty();
    const bookImage = responseJson.items[0].volumeInfo.imageLinks.smallThumbnail;
    const bookTitle = responseJson.items[0].volumeInfo.title;
    const displayImage = $('<img>',
        {
            id: 'mainbook-img',
            src: bookImage,
            alt: bookTitle
        })
        .appendTo($('.mainbook'))
    console.log(displayImage)
}

function displayTasteImages(responseJson){
    
    
    const bookImage = responseJson.items[0].volumeInfo.imageLinks.smallThumbnail;
    const bookTitle = responseJson.items[0].volumeInfo.title;
    const displayImage = $('<img>',
        {
            class: 'matchbook-img',
            src: bookImage,
            alt: bookTitle
        })
        .appendTo($('.matchbook'))
    console.log(displayImage)  
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('.search-input-js').val();
        getTasteApi(searchTerm);
    })
}

$(watchForm);