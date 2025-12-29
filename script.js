 // URL API бэкенда!!!!!!!!!!!!!!!!!!!!!!!!!!
        const API_URL = 'http://localhost:5000';
        ////////////////////////////////////////////

        


        // Карусель - автоматическая смена слайдов
        let currentSlide = 0;
        let carouselInterval;

        // Инициализация карусели
        function initCarousel() {
            const slides = document.querySelectorAll('.carousel-slide');
            const indicatorsContainer = document.getElementById('carouselIndicators');
            const carouselContainer = document.querySelector('.carousel-container');
            
            // Создаем индикаторы
            slides.forEach((_, index) => {
                const indicator = document.createElement('button');
                indicator.className = 'carousel-indicator';
                if (index === 0) indicator.classList.add('active');
                indicator.addEventListener('click', () => goToSlide(index));
                indicatorsContainer.appendChild(indicator);
            });

            

            // Запускаем автоматическую смену слайдов каждые 3 секунды
            startAutoSlide();
        }

        // Функция смены слайда
        function changeSlide(direction) {
            const slides = document.querySelectorAll('.carousel-slide');
            const indicators = document.querySelectorAll('.carousel-indicator');
            
            // Убираем активный класс с текущего слайда
            slides[currentSlide].classList.remove('active');
            indicators[currentSlide].classList.remove('active');
            
            // Вычисляем новый индекс слайда
            currentSlide += direction;
            
            // Зацикливаем слайды
            if (currentSlide >= slides.length) {
                currentSlide = 0;
            } else if (currentSlide < 0) {
                currentSlide = slides.length - 1;
            }
            
            // Добавляем активный класс к новому слайду
            slides[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');
            
            // Перезапускаем автоматическую смену
            restartAutoSlide();
        }

        // Функция перехода к конкретному слайду
        function goToSlide(index) {
            const slides = document.querySelectorAll('.carousel-slide');
            const indicators = document.querySelectorAll('.carousel-indicator');
            
            // Убираем активный класс с текущего слайда
            slides[currentSlide].classList.remove('active');
            indicators[currentSlide].classList.remove('active');
            
            // Устанавливаем новый слайд
            currentSlide = index;
            
            // Добавляем активный класс к новому слайду
            slides[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');
            
            // Перезапускаем автоматическую смену
            restartAutoSlide();
        }

        // Запуск автоматической смены слайдов
        function startAutoSlide() {
            carouselInterval = setInterval(() => {
                changeSlide(1);
            }, 1400); // 1.4 секунды
        }

        // Остановка автоматической смены
        function stopAutoSlide() {
            if (carouselInterval) {
                clearInterval(carouselInterval);
            }
        }

        // Перезапуск автоматической смены
        function restartAutoSlide() {
            stopAutoSlide();
            startAutoSlide();
        }

        // Функции для работы с интерфейсом
        function toggleAdminPanel() {
            const panel = document.getElementById('adminPanel');
            panel.classList.toggle('active');
        }


        // Инициализация
        document.addEventListener('DOMContentLoaded', function() {
            // Инициализация карусели
            initCarousel();

            // Добавление эффекта при наведении на элементы контента
            const contentItems = document.querySelectorAll('.content-item');
            
            contentItems.forEach(item => {
                item.addEventListener('mouseenter', function() {
                    this.style.zIndex = '10';
                });
                
                item.addEventListener('mouseleave', function() {
                    this.style.zIndex = '1';
                });
            });
        });

////////////////////////////////////////////////////////////////////////////////////////////
///////////////ГРАДИЕНТ НА БЛОКЕ CONTENT////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////



document.addEventListener('DOMContentLoaded', function() {
    const gradientBg = document.querySelector('.gradient-bg1');
    document.addEventListener('mousemove', function(e) {
        //позицию мыши
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        const posX = mouseX * 100;
        const posY = mouseY * 100;
        gradientBg.style.background = `
            radial-gradient(
                circle at ${posX}% ${posY}%,
rgb(68, 10, 10) 0%,
rgb(61, 8, 8) 25%,
rgb(43, 5, 5) 50%,
rgb(34, 3, 3) 75%,
rgb(14, 13, 13) 100%
            )
        `;
    });
});


////////////////////////////////////////////////////////////////////////////////////////////


        ///////////////////////////////////////////////////////////////////
        ///JavaScript-код для загрузки и добавления фильмов через API./////
        ///////////////////////////////////////////////////////////////////
        ////////////LoadMovies///////////////////AddMovies/////////////////
        ///////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////



// Загрузка фильмов с бэкенда
async function loadMovies() {
    try {
    const response = await fetch(`${API_URL}/movies`);
    if (!response.ok) {
        throw new Error('Ошибка загрузки фильмов');
    }
    const movies = await response.json();
    const moviesList = document.getElementById('moviesList');
    moviesList.innerHTML = '';
    
    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.className = 'movie-item';
        movieItem.innerHTML = `
            <div class="movie-info">
                <h4>${movie.title} (${movie.year})</h4>
                <p>${movie.genre} • Рейтинг: ${movie.rating.toFixed(1)} • ${movie.description || 'Нет описания'}</p>
            </div>
            <div class="movie-actions">
                <button class="admin-btn secondary">Смотреть</button>
                <button class="admin-btn secondary" onclick="editMovie(${movie.id})">Редактировать</button>
                <button class="admin-btn" onclick="deleteMovie(${movie.id})">Удалить</button>
            </div>
        `;
        moviesList.appendChild(movieItem);
    });
    } catch (error) {
    console.error('Ошибка:', error);
    document.getElementById('moviesList').innerHTML = '<p>Ошибка загрузки фильмов</p>';
    }
    }
    
    // Добавление фильма
    async function addMovie(event) {
    event.preventDefault();
    
    const title = document.getElementById('movieTitle').value.trim();
    const rating = document.getElementById('movieRating').value;
    const genre = document.getElementById('movieGenre').value;
    const year = document.getElementById('movieYear').value;
    const description = document.getElementById('movieDescription').value.trim();
    
    // Валидация
    if (!title || !rating || !genre || !year) {
    alert('Заполните все обязательные поля');
    return;
    }
    
    const movieData = {
    title,
    rating,
    genre,
    year,
    description
    };
    
    try {
    const response = await fetch(`${API_URL}/movies`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(movieData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
        // Очистка формы
        document.getElementById('movieTitle').value = '';
        document.getElementById('movieRating').value = '';
        document.getElementById('movieGenre').value = '';
        document.getElementById('movieYear').value = '';
        document.getElementById('movieDescription').value = '';
        // Обновить список
        loadMovies();
    } else {
        alert('Ошибка: ' + result.error);
    }
    } catch (error) {
    console.error('Ошибка отправки:', error);
    alert('Не удалось подключиться к серверу');
    }
    }
    
    // Удаление фильма
    async function deleteMovie(id) {
    if (!confirm('Вы уверены, что хотите удалить этот фильм?')) return;
    
    try {
    const response = await fetch(`${API_URL}/movies/${id}`, {
        method: 'DELETE'
    });
    
    if (response.ok) {
        loadMovies(); // Обновить список
    } else {
        const result = await response.json();
        alert('Ошибка: ' + result.error);
    }
    } catch (error) {
    console.error('Ошибка:', error);
    alert('Не удалось удалить фильм');
    }
    }
    
    
    
    // Фильтрация (loadMovies с фильтрами)
    async function filterMovies() {
    const genre = document.getElementById('filterGenre').value;
    const rating = document.getElementById('filterRating').value;
    
    let url = `${API_URL}/movies`;
    const params = new URLSearchParams();
    if (genre) params.append('genre', genre);
    if (rating) params.append('min_rating', rating);
    
    if (params.toString()) {
    url += '?' + params.toString();
    }
    
    try {
    const response = await fetch(url);
    const movies = await response.json();
    const moviesList = document.getElementById('moviesList');
    moviesList.innerHTML = '';
    
    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.className = 'movie-item';
        movieItem.innerHTML = `
            <div class="movie-info">
                <h4>${movie.title} (${movie.year})</h4>
                <p>${movie.genre} • Рейтинг: ${movie.rating.toFixed(1)} • ${movie.description || 'Нет описания'}</p>
            </div>
            <div class="movie-actions">
                <button class="admin-btn secondary">Смотреть</button>
                <button class="admin-btn secondary" onclick="editMovie(${movie.id})">Редактировать</button>
                <button class="admin-btn" onclick="deleteMovie(${movie.id})">Удалить</button>
            </div>
        `;
        moviesList.appendChild(movieItem);
    });
    } catch (error) {
    console.error('Ошибка фильтрации:', error);
    }
    }













