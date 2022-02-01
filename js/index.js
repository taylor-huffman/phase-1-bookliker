document.addEventListener("DOMContentLoaded", function() {
    const booksURL = 'http://localhost:3000/books/'
    const usersURL = 'http://localhost:3000/users/'
    const ul = document.getElementById('list')
    const showPanel = document.getElementById('show-panel')
    let currentUser = {
        id: 1,
        username: "pouros"
      }

    fetch(booksURL)
    .then(res => res.json())
    .then(books => {
        books.forEach(book => renderBookList(book));
    })

    const renderBookList = (book) => {
        let li = document.createElement('li')
        li.textContent = book.title
        li.dataset.bookId = book.id
        li.addEventListener('click', () => renderBookDetails(book))
        ul.appendChild(li)
    }

    const renderBookDetails = (book) => {
        showPanel.innerHTML = ''
        let foundUser = book.users.map(user => user.username === currentUser.username)
        let img = document.createElement('img')
        let title = document.createElement('h3')
        let subtitle = document.createElement('h3')
        let author = document.createElement('h3')
        let description = document.createElement('p')
        let userLikesList = document.createElement('ul')
        let likeButton = document.createElement('button')
        if (foundUser.find(element => element === true)) {
            likeButton.textContent = 'Dislike'
            likeButton.addEventListener('click', () => removeLike(book))
        } else {
            likeButton.textContent = 'Like'
            likeButton.addEventListener('click', () => addLike(book))
        }
        userLikesList.id = 'user-likes'
        book.users.forEach((user) => {
            let li = document.createElement('li')
            li.textContent = user.username
            li.dataset.userId = user.id
            userLikesList.appendChild(li)
        })
        img.src = book.img_url
        title.textContent = book.title
        subtitle.textContent = book.subtitle
        author.textContent = book.author
        description.textContent = book.description
        showPanel.dataset.currentBookId = book.id
        showPanel.append(img, title, subtitle, author, description, userLikesList, likeButton)
    }

    const addLike = (book) => {
        book.users.push(currentUser)
        fetch(`${booksURL}${book.id}`, {
            method: "PATCH",
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify({
              users: book.users
            })
          })
          .then(response => response.json())
          .then(updatedBook => updatedBook)
          showPanel.innerHTML = ''
          renderBookDetails(book)
    }

    const removeLike = (book) => {
        book.users.pop()
        fetch(`${booksURL}${book.id}`, {
            method: "PATCH",
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify({
              users: book.users
            })
          })
          .then(response => response.json())
          .then(data => data)
          showPanel.innerHTML = ''
          renderBookDetails(book)
    }
});
