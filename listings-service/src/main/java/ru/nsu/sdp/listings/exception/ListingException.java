package ru.nsu.sdp.listings.exception;

public class ListingException {

    public static class NotFound extends RuntimeException {
        public NotFound() {
            super("Объявление не найдено");
        }
    }

    public static class Forbidden extends RuntimeException {
        public Forbidden() {
            super("Недостаточно прав для изменения объявления");
        }
    }

    public static class Unauthorized extends RuntimeException {
        public Unauthorized(String message) {
            super(message);
        }
    }
}
