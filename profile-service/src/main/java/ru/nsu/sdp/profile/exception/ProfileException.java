package ru.nsu.sdp.profile.exception;

public class ProfileException {

    /** JWT отсутствует или невалиден */
    public static class InvalidToken extends RuntimeException {
        public InvalidToken() {
            super("Отсутствует или невалидный JWT токен");
        }
        public InvalidToken(String message) {
            super(message);
        }
    }

    /** Пользователь не найден в БД */
    public static class UserNotFound extends RuntimeException {
        public UserNotFound() {
            super("Пользователь не найден");
        }
    }

    /** Пользователь заблокирован */
    public static class UserBlocked extends RuntimeException {
        public UserBlocked() {
            super("Пользователь заблокирован");
        }
    }
}
