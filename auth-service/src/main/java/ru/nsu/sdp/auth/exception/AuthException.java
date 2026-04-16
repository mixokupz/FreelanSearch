package ru.nsu.sdp.auth.exception;

public class AuthException {

    public static class InvalidCredentials extends RuntimeException {
        public InvalidCredentials() {
            super("Неверный email или пароль");
        }
    }

    public static class EmailAlreadyExists extends RuntimeException {
        public EmailAlreadyExists() {
            super("Пользователь с таким email уже существует");
        }
    }

    public static class UserBlocked extends RuntimeException {
        public UserBlocked() {
            super("Аккаунт заблокирован");
        }
    }
}
