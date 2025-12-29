"""
Python CRUD Backend для управления фильмами
Использует Flask и PostrgeSQL
"""

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

app = Flask(__name__)

#подключение базы данных
basedir = os.path.abspath(os.path.dirname(__file__))
#app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(basedir, "movies.db")}' ############ SQ Lite
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+pg8000://movie_user:password@localhost:5432/movies_db' ############### Postgres

#CORS для работы с фронтендом
CORS(app) #разрешает междоменные запросы Фронтенд на localhost может свободно обращаться к бэкенду на localhost:5000

db = SQLAlchemy(app)


class Movie(db.Model):
    """Модель фильма"""
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    genre = db.Column(db.String(50), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text)

    def to_dict(self):
        """Преобразование объекта в словарь"""
        return {
            'id': self.id,
            'title': self.title,
            'rating': self.rating,
            'genre': self.genre,
            'year': self.year,
            'description': self.description
        }


# Создание таблиц при первом запуске
with app.app_context():
    db.create_all()


# CRUD

# Create - Добавление фильма
@app.route('/movies', methods=['POST'])
def add_movie():
    """Добавление нового фильма"""
    try:
        # Получает данные запроса в формате JSON в виде словаря Python
        data = request.json
        
        # Валидация данных
        # Эта часть кода выполняет валидацию данных, полученных из запроса на добавление нового фильма
        # Она поочередно проверяет наличие обязательных полей: название фильма ('title'), рейтинг ('rating')
        # жанр ('genre') и год выпуска ('year'). Если какое-либо из этих полей отсутствует,
        # или если рейтинг вне диапазона от 1 до 10, возвращается ошибка с кодом 400
        # После успешной проверки создаётся объект Movie с полученными данными

        if not data.get('title'):
            return jsonify({'error': 'Название фильма обязательно'}), 400
        if not data.get('rating') or not (1 <= float(data.get('rating')) <= 10):
            return jsonify({'error': 'Рейтинг должен быть от 1 до 10'}), 400
        if not data.get('genre'):
            return jsonify({'error': 'Жанр обязателен'}), 400
        if not data.get('year'):
            return jsonify({'error': 'Год выпуска обязателен'}), 400
        
        movie = Movie(
            title=data['title'],
            rating=float(data['rating']),
            genre=data['genre'],
            year=int(data['year']),
            description=data.get('description', '')
        )
        
        # Эта часть кода добавляет новый объект фильма в базу данных.
        # Сначала создаём запрос на добавление (db.session.add(movie))
        # затем сохраняем изменения (db.session.commit()).
        # После успешного добавления возвращаем подтверждение в формате JSON
        # а если произошла ошибка откатываем транзакцию и возвращаем сообщение об ошибке
        db.session.add(movie)
        db.session.commit()
        
        return jsonify({
            'message': 'Фильм успешно добавлен',
            'movie': movie.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# Read - Получение всех фильмов
@app.route('/movies', methods=['GET'])
def get_movies():
    """Получение списка всех фильмов с возможностью фильтрации"""
    # Эта часть кода реализует обработку GET-запроса на /movies
    try:
        # Получаем параметры запроса для фильтрации
        # "genre" — для фильтрации по жанру фильма
        # "min_rating" — для фильтрации по минимальному рейтингу
        genre = request.args.get('genre')
        min_rating = request.args.get('min_rating')
        
        # Создаём объект запроса к таблице Movie
        query = Movie.query
        
        # Если был передан параметр genre, добавляем фильтр по жанру
        if genre:
            query = query.filter(Movie.genre == genre)
        # Если был передан минимальный рейтинг, добавляем соответствующий фильтр
        if min_rating:
            query = query.filter(Movie.rating >= float(min_rating))
        
        # Получаем все фильмы, удовлетворяющие условиям (или вообще все фильмы)
        movies = query.all()
        
        # Преобразуем каждую запись Movie в словарь и отправляем список клиенту в формате JSON
        # Число 200 обозначает успешный HTTP-статус "OK" (операция прошла успешно).
        # Число 500 — это код ошибки сервера ("Internal Server Error")
        return jsonify([movie.to_dict() for movie in movies]), 200
    except Exception as e:
        # В случае любой ошибки возвращаем JSON с сообщением об ошибке и статусом (ошибка сервера)
        return jsonify({'error': str(e)}), 500


# Read - Получение одного фильма
@app.route('/movies/<int:movie_id>', methods=['GET'])
def get_movie(movie_id):
    """Получение информации о конкретном фильме"""
    try:
        movie = Movie.query.get(movie_id)
        if not movie:
            return jsonify({'error': 'Фильм не найден'}), 404
        
        return jsonify(movie.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Update - Обновление фильма
@app.route('/movies/<int:movie_id>', methods=['PUT'])
def update_movie(movie_id):
    """Обновление информации о фильме"""
    try:
        movie = Movie.query.get(movie_id)
        if not movie:
            return jsonify({'error': 'Фильм не найден'}), 404
        
        data = request.json
        
        # Обновление полей, если они предоставлены
        if 'title' in data:
            movie.title = data['title']
        if 'rating' in data:
            if not (1 <= float(data['rating']) <= 10):
                return jsonify({'error': 'Рейтинг должен быть от 1 до 10'}), 400
            movie.rating = float(data['rating'])
        if 'genre' in data:
            movie.genre = data['genre']
        if 'year' in data:
            movie.year = int(data['year'])
        if 'description' in data:
            movie.description = data['description']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Фильм успешно обновлен',
            'movie': movie.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# Delete - Удаление фильма
@app.route('/movies/<int:movie_id>', methods=['DELETE'])
def delete_movie(movie_id):
    """Удаление фильма"""
    try:
        movie = Movie.query.get(movie_id)
        if not movie:
            return jsonify({'error': 'Фильм не найден'}), 404
        
        db.session.delete(movie)
        db.session.commit()
        
        return jsonify({'message': 'Фильм успешно удален'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# Получение всех жанров
@app.route('/genres', methods=['GET'])
def get_genres():
    """Получение списка всех уникальных жанров"""
    try:
        genres = db.session.query(Movie.genre).distinct().all()
        # genres содержит список кортежей вида ('Драма'), ('Комедия'), ...
        # Поэтому genre[0] извлекает строку жанра из каждого кортежа
        return jsonify([genre_tuple[0] for genre_tuple in genres]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Проверка работы сервера
@app.route('/health', methods=['GET'])
def health_check():
    """Проверка работоспособности сервера"""
    return jsonify({'status': 'ok', 'message': 'Сервер работает'}), 200


if __name__ == '__main__':
    print("Запуск сервера на http://localhost:5000")
    print("API endpoints:")
    print("  POST   /movies - Добавить фильм")
    print("  GET    /movies - Получить все фильмы")
    print("  DELETE /movies/<id> - Удалить фильм")
    print("  GET    /health - Проверка работы сервера")
    app.run(debug=True, host='0.0.0.0', port=5000)


