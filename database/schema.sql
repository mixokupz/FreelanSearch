CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NULL,
    phone VARCHAR(30) UNIQUE NULL,
    password_hash VARCHAR(255) NULL,
    auth_provider VARCHAR(50) NULL,
    auth_provider_id VARCHAR(255) NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_auth_provider_id ON users(auth_provider_id);

CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500) NULL,
    bio TEXT NULL,
    city VARCHAR(100) NULL,
    avg_rating DECIMAL(3,2) NOT NULL DEFAULT 0,
    reviews_count INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    category_id INTEGER NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NULL,
    price_type VARCHAR(20) NOT NULL DEFAULT 'fixed',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE INDEX idx_services_user_id ON services(user_id);
CREATE INDEX idx_services_category_id ON services(category_id);
CREATE INDEX idx_services_status ON services(status);

CREATE TABLE service_photos (
    id SERIAL PRIMARY KEY,
    service_id INTEGER NOT NULL,
    url VARCHAR(500) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (service_id) REFERENCES services(id)
);

CREATE TABLE service_tags (
    service_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (service_id, tag_id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);

CREATE TABLE deals (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    executor_id INTEGER NOT NULL,
    service_id INTEGER NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (client_id) REFERENCES users(id),
    FOREIGN KEY (executor_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);

CREATE INDEX idx_deals_client_id ON deals(client_id);
CREATE INDEX idx_deals_executor_id ON deals(executor_id);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    deal_id INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    target_id INTEGER NOT NULL,
    rating SMALLINT NOT NULL,
    comment TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deal_id) REFERENCES deals(id),
    FOREIGN KEY (author_id) REFERENCES users(id),
    FOREIGN KEY (target_id) REFERENCES users(id)
);

CREATE INDEX idx_reviews_deal_id ON reviews(deal_id);
CREATE INDEX idx_reviews_target_id ON reviews(target_id);

CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    deal_id INTEGER NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deal_id) REFERENCES deals(id)
);

CREATE TABLE conversation_participants (
    conversation_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (conversation_id, user_id),
    FOREIGN KEY (conversation_id) REFERENCES conversations(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);

CREATE TABLE favorite_services (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    UNIQUE (user_id, service_id)
);

CREATE TABLE favorite_users (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    target_user_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (target_user_id) REFERENCES users(id),
    UNIQUE (user_id, target_user_id)
);

CREATE TABLE albums (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE album_items (
    id SERIAL PRIMARY KEY,
    album_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,
    added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (album_id) REFERENCES albums(id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    UNIQUE (album_id, service_id)
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL,
    related_entity_type VARCHAR(50) NULL,
    related_entity_id INTEGER NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);

CREATE TABLE moderation_queue (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    moderator_id INTEGER NULL,
    rejection_reason TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    FOREIGN KEY (moderator_id) REFERENCES users(id)
);

CREATE INDEX idx_moderation_queue_status ON moderation_queue(status);
CREATE INDEX idx_moderation_queue_entity_type ON moderation_queue(entity_type);

CREATE TABLE support_tickets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'open',
    assigned_to INTEGER NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

INSERT INTO users (email, phone, password_hash, auth_provider, auth_provider_id, role, is_blocked) VALUES
('ivan.petrov@gmail.com',      '+79001234501', '$2b$12$hC2bVCgLHLPVyA0xURLB9OJEqSCUVPoH352x1IHwT11teoyIUobA6', 'local',    NULL,          'user',  FALSE),
('maria.sidorova@mail.ru',     '+79001234502', '$2b$12$hC2bVCgLHLPVyA0xURLB9OJEqSCUVPoH352x1IHwT11teoyIUobA6', 'local',    NULL,          'user',  FALSE),
('alex.volkov@yandex.ru',      NULL,           NULL,            'google',   'g_uid_003',   'user',  FALSE),
('olga.novikova@gmail.com',    '+79001234504', '$2b$12$hC2bVCgLHLPVyA0xURLB9OJEqSCUVPoH352x1IHwT11teoyIUobA6', 'local',    NULL,          'user',  FALSE),
('dmitry.kozlov@mail.ru',      '+79001234505', '$2b$12$hC2bVCgLHLPVyA0xURLB9OJEqSCUVPoH352x1IHwT11teoyIUobA6', 'local',    NULL,          'user',  FALSE),
('ekaterina.smirnova@ya.ru',   NULL,           NULL,            'yandex',   'y_uid_006',   'user',  FALSE),
('sergey.morozov@gmail.com',   '+79001234507', '$2b$12$hC2bVCgLHLPVyA0xURLB9OJEqSCUVPoH352x1IHwT11teoyIUobA6', 'local',    NULL,          'user',  FALSE),
('anna.popova@mail.ru',        '+79001234508', '$2b$12$hC2bVCgLHLPVyA0xURLB9OJEqSCUVPoH352x1IHwT11teoyIUobA6', 'local',    NULL,          'user',  FALSE),
('nikolay.lebedev@gmail.com',  NULL,           NULL,            'google',   'g_uid_009',   'user',  FALSE),
('yuliya.komarova@ya.ru',      '+79001234510', '$2b$12$hC2bVCgLHLPVyA0xURLB9OJEqSCUVPoH352x1IHwT11teoyIUobA6', 'local',    NULL,          'user',  FALSE),
('pavel.orlov@gmail.com',      '+79001234511', '$2b$12$hC2bVCgLHLPVyA0xURLB9OJEqSCUVPoH352x1IHwT11teoyIUobA6', 'local',    NULL,          'user',  FALSE),
('tatyana.golova@mail.ru',     NULL,           NULL,            'vk',       'vk_uid_012',  'user',  FALSE),
('artem.sokolov@gmail.com',    '+79001234513', '$2b$12$hC2bVCgLHLPVyA0xURLB9OJEqSCUVPoH352x1IHwT11teoyIUobA6', 'local',    NULL,          'user',  FALSE),
('oksana.fedorova@ya.ru',      '+79001234514', '$2b$12$hC2bVCgLHLPVyA0xURLB9OJEqSCUVPoH352x1IHwT11teoyIUobA6', 'local',    NULL,          'user',  FALSE),
('admin@platform.ru',          '+79009999999', '$2b$12$hC2bVCgLHLPVyA0xURLB9OJEqSCUVPoH352x1IHwT11teoyIUobA6', 'local',    NULL,          'admin', FALSE);

INSERT INTO profiles (user_id, display_name, avatar_url, bio, city, avg_rating, reviews_count) VALUES
(1,  'Иван Петров',       'https://cdn.example.com/av/1.jpg',  'Сантехник, 10 лет опыта',               'Москва',          4.80, 24),
(2,  'Мария Сидорова',    'https://cdn.example.com/av/2.jpg',  'Репетитор по математике и физике',      'Санкт-Петербург', 4.95, 37),
(3,  'Алексей Волков',    'https://cdn.example.com/av/3.jpg',  'Графический дизайнер-фрилансер',        'Казань',          4.60, 11),
(4,  'Ольга Новикова',    'https://cdn.example.com/av/4.jpg',  'Профессиональный фотограф',             'Москва',          4.75, 18),
(5,  'Дмитрий Козлов',    'https://cdn.example.com/av/5.jpg',  'Электрик, промышленный и бытовой',      'Екатеринбург',    4.50,  9),
(6,  'Екатерина Смирнова','https://cdn.example.com/av/6.jpg',  'Переводчик EN/DE/FR',                   'Новосибирск',     4.90, 43),
(7,  'Сергей Морозов',    'https://cdn.example.com/av/7.jpg',  'Разработчик на Python и FastAPI',       'Москва',          5.00,  7),
(8,  'Анна Попова',       'https://cdn.example.com/av/8.jpg',  'Бухгалтер, налоговый консультант',      'Казань',          4.70, 22),
(9,  'Николай Лебедев',   NULL,                                'Грузчик и сборщик мебели',              'Самара',          4.40, 15),
(10, 'Юлия Комарова',     'https://cdn.example.com/av/10.jpg', 'Визажист и стилист',                    'Санкт-Петербург', 4.85, 30),
(11, 'Павел Орлов',       'https://cdn.example.com/av/11.jpg', 'Веб-дизайнер, UI/UX',                   'Москва',          4.65, 14),
(12, 'Татьяна Голова',    'https://cdn.example.com/av/12.jpg', 'Юрист, семейное и гражданское право',   'Ростов-на-Дону',  4.80, 19),
(13, 'Артём Соколов',     'https://cdn.example.com/av/13.jpg', 'Курьер и водитель-экспедитор',          'Москва',          4.55, 28),
(14, 'Оксана Фёдорова',   'https://cdn.example.com/av/14.jpg', 'Репетитор английского, IELTS/TOEFL',    'Краснодар',       4.92, 51),
(15, 'Администратор',     NULL,                                NULL,                                    'Москва',          0.00,  0);

INSERT INTO categories (parent_id, name, slug) VALUES
(NULL, 'Ремонт и строительство', 'repair'),
(NULL, 'Обучение',               'education'),
(NULL, 'Дизайн',                 'design'),
(NULL, 'IT и разработка',        'it'),
(NULL, 'Красота и здоровье',     'beauty'),
(NULL, 'Юридические услуги',     'legal'),
(NULL, 'Транспорт и доставка',   'transport'),
(NULL, 'Бухгалтерия и финансы',  'finance'),
(1,    'Сантехника',             'plumbing'),
(1,    'Электрика',              'electrical'),
(2,    'Репетиторство',          'tutoring'),
(2,    'Языковые курсы',         'languages'),
(3,    'Графический дизайн',     'graphic-design'),
(3,    'UI/UX дизайн',           'ux-design'),
(4,    'Разработка сайтов',      'web-dev');

INSERT INTO tags (name, slug) VALUES
('срочно',          'urgent'),
('выезд на дом',    'home-visit'),
('онлайн',          'online'),
('гарантия',        'warranty'),
('опыт 5+ лет',     'exp-5plus'),
('опыт 10+ лет',    'exp-10plus'),
('студентам скидка','student-discount'),
('без выходных',    'no-days-off'),
('безналичный расчёт','non-cash'),
('договор',         'contract'),
('портфолио',       'portfolio'),
('бесплатная консультация','free-consult'),
('командная работа','team'),
('NDA',             'nda'),
('первый заказ -10%','first-order-discount');

INSERT INTO services (user_id, category_id, title, description, price, price_type, status) VALUES
(1,  9,  'Замена труб и кранов',            'Быстро заменю трубы, краны, смесители. Гарантия 1 год.',                2500.00, 'fixed',   'active'),
(1,  9,  'Установка водонагревателя',        'Монтаж бойлеров любого объёма. Выезд по Москве.',                       3500.00, 'fixed',   'active'),
(2,  11, 'Репетитор математика (ЕГЭ)',       'Подготовка к ЕГЭ, база и профиль. Онлайн и очно.',                      1500.00, 'hourly',  'active'),
(2,  12, 'Английский с нуля',               'Уроки для начинающих, разговорная практика.',                            1200.00, 'hourly',  'active'),
(3,  13, 'Разработка логотипа',             'Уникальный логотип для бизнеса. 3 концепции на выбор.',                  8000.00, 'fixed',   'active'),
(4,  13, 'Фотосъёмка мероприятий',          'Корпоративы, свадьбы, дни рождения. Обработка включена.',               15000.00, 'fixed',  'active'),
(5,  10, 'Прокладка электропроводки',       'Монтаж проводки в квартирах и офисах, составление схем.',               5000.00, 'fixed',   'active'),
(6,  2,  'Перевод документов EN↔RU',        'Юридические, технические и медицинские тексты, нотариальные.',           300.00,  'hourly',  'active'),
(7,  15, 'Разработка Telegram-бота',        'Пишу ботов на Python (aiogram). Интеграция с API, БД.',                  12000.00,'fixed',   'active'),
(8,  8,  'Ведение бухгалтерии ИП/ООО',      'Учёт, отчётность, налоговые декларации. УСН, ОСНО.',                    8000.00, 'monthly', 'active'),
(9,  7,  'Сборка мебели IKEA и других',     'Соберу быстро и аккуратно любую мебель. Инструмент свой.',               1000.00, 'fixed',   'active'),
(10, 5,  'Макияж на выход/мероприятие',     'Дневной, вечерний, свадебный макияж. Выезд возможен.',                   3000.00, 'fixed',   'active'),
(11, 14, 'Дизайн интерфейса (UI)',          'Прототипы и дизайн в Figma. Компоненты, адаптив.',                       9000.00, 'fixed',   'pending'),
(12, 6,  'Юридическая консультация',        'Семейные споры, договоры, защита прав потребителей.',                    2000.00, 'hourly',  'active'),
(14, 12, 'Репетитор по английскому (IELTS)','Подготовка к IELTS и TOEFL. 100% студентов сдали с первого раза.',      1800.00, 'hourly',  'active');

INSERT INTO service_photos (service_id, url, sort_order) VALUES
-- service 1: Замена труб и кранов
(1,  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', 0),
(1,  'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80', 1),

-- service 2: Установка водонагревателя
(2,  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80', 0),

-- service 3: Репетитор математика (ЕГЭ)
(3,  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80', 0),

-- service 5: Разработка логотипа
(5,  'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80', 0),
(5,  'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800&q=80', 1),
(5,  'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80', 2),

-- service 6: Фотосъёмка мероприятий
(6,  'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80', 0),
(6,  'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=800&q=80', 1),

-- service 7: Прокладка электропроводки
(7,  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80', 0),

-- service 9: Разработка Telegram-бота
(9,  'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80', 0),

-- service 10: Ведение бухгалтерии
(10, 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80', 0),

-- service 12: Макияж
(12, 'https://images.unsplash.com/photo-1487412840181-b8d56de36f6b?w=800&q=80', 0),

-- service 13: Дизайн интерфейса (UI)
(13, 'https://images.unsplash.com/photo-1616499615959-ba8b98b00fe4?w=800&q=80', 0),
(13, 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=800&q=80', 1);

INSERT INTO service_tags (service_id, tag_id) VALUES
(1,  1),  -- срочно
(1,  4),  -- гарантия
(2,  4),  -- гарантия
(3,  3),  -- онлайн
(3,  7),  -- студентам скидка
(4,  3),  -- онлайн
(5,  11), -- портфолио
(6,  2),  -- выезд на дом
(7,  3),  -- онлайн
(8,  14), -- NDA
(9,  5),  -- опыт 5+ лет
(10, 2),  -- выезд на дом
(12, 12), -- бесплатная консультация
(14, 3),  -- онлайн
(15, 5);  -- опыт 5+ лет

INSERT INTO deals (client_id, executor_id, service_id, status, completed_at) VALUES
(2,  1,  1,    'completed', CURRENT_TIMESTAMP - INTERVAL '30 days'),
(4,  1,  2,    'completed', CURRENT_TIMESTAMP - INTERVAL '20 days'),
(5,  2,  3,    'completed', CURRENT_TIMESTAMP - INTERVAL '14 days'),
(7,  2,  4,    'completed', CURRENT_TIMESTAMP - INTERVAL '10 days'),
(9,  3,  5,    'completed', CURRENT_TIMESTAMP - INTERVAL '7 days'),
(10, 4,  6,    'completed', CURRENT_TIMESTAMP - INTERVAL '5 days'),
(11, 5,  7,    'completed', CURRENT_TIMESTAMP - INTERVAL '3 days'),
(13, 6,  8,    'in_progress', NULL),
(3,  7,  9,    'in_progress', NULL),
(6,  8,  10,   'in_progress', NULL),
(8,  9,  11,   'in_progress', NULL),
(1,  10, 12,   'in_progress', NULL),
(4,  12, 14,   'in_progress', NULL),
(2,  14, 15,   'in_progress', NULL),
(12, 11, 13,   'cancelled',   NULL);

INSERT INTO reviews (deal_id, author_id, target_id, rating, comment) VALUES
(1,  2,  1,  5, 'Иван всё сделал быстро и аккуратно, пришёл минута в минуту!'),
(1,  1,  2,  5, 'Приятный клиент, оплата сразу. Рекомендую!'),
(2,  4,  1,  5, 'Бойлер установлен идеально, подробно объяснил как пользоваться.'),
(3,  5,  2,  5, 'Мария — отличный преподаватель, сын сдал ЕГЭ на 87 баллов!'),
(4,  7,  2,  4, 'Хороший педагог, иногда немного торопится, но результат есть.'),
(5,  9,  3,  5, 'Логотип получился лучше, чем ожидали. Работаем дальше!'),
(6,  10, 4,  5, 'Фотографии с корпоратива шикарные, все в восторге.'),
(7,  11, 5,  4, 'Проводка сделана хорошо, немного мусора осталось — убрал сам.'),
(2,  1,  2,  5, 'Очень пунктуальный клиент, порекомендую коллегам.'),
(3,  2,  5,  4, 'Работа выполнена качественно, всё в срок.'),
(4,  2,  7,  5, 'Сергей разработал бота быстрее срока, отличный специалист!'),
(5,  3,  8,  5, 'Анна взяла всю отчётность под контроль, я спокоен за бухгалтерию.'),
(6,  4,  9,  4, 'Мебель собрана аккуратно, но чуть дольше, чем договаривались.'),
(7,  5,  10, 5, 'Макияж продержался весь вечер, выглядела потрясающе!'),
(1,  2,  14, 5, 'Оксана — лучший репетитор по английскому, сдала IELTS на 7.5!');

INSERT INTO conversations (deal_id) VALUES
(1), (2), (3), (4), (5),
(6), (7), (8), (9), (10),
(11),(12),(13),(14),(15);

INSERT INTO conversation_participants (conversation_id, user_id) VALUES
(1,  2), (1,  1),
(2,  4), (2,  1),
(3,  5), (3,  2),
(4,  7), (4,  2),
(5,  9), (5,  3),
(6,  10),(6,  4),
(7,  11),(7,  5),
(8,  13),(8,  6),
(9,  3), (9,  7),
(10, 6), (10, 8),
(11, 8), (11, 9),
(12, 1), (12, 10),
(13, 4), (13, 12),
(14, 2), (14, 14),
(15, 12),(15, 11);

INSERT INTO messages (conversation_id, sender_id, content, is_read) VALUES
(1,  2,  'Здравствуйте! Когда сможете приехать?',                     TRUE),
(1,  1,  'Добрый день! Могу завтра в 10:00, вам удобно?',             TRUE),
(2,  4,  'Добрый день, интересует установка водонагревателя.',         TRUE),
(3,  5,  'Нам нужна подготовка к ЕГЭ по математике, профильный.',     TRUE),
(4,  7,  'Хочу начать учить английский, полный ноль.',                 TRUE),
(5,  9,  'Можете сделать логотип в минималистичном стиле?',            TRUE),
(6,  10, 'Здравствуйте, нужна фотосъёмка корпоратива на 50 человек.', TRUE),
(7,  11, 'Нужна разводка проводки в трёхкомнатной квартире.',         TRUE),
(8,  13, 'Добрый день! Нужен перевод договора с английского.',        FALSE),
(9,  3,  'Нужен Telegram-бот для записи клиентов.',                   FALSE),
(10, 6,  'Здравствуйте! Интересует ведение бухгалтерии для ИП.',      FALSE),
(11, 8,  'Нужно собрать шкаф-купе и кровать IKEA.',                   FALSE),
(12, 1,  'Хочу записаться на вечерний макияж в эту пятницу.',         FALSE),
(13, 4,  'Нужна консультация по разводу и разделу имущества.',        FALSE),
(14, 2,  'Хочу готовиться к IELTS, цель — 7.0.',                      FALSE);

INSERT INTO favorite_services (user_id, service_id) VALUES
(2,  5),
(3,  1),
(4,  9),
(5,  6),
(6,  3),
(7,  12),
(8,  7),
(9,  14),
(10, 2),
(11, 10),
(12, 4),
(13, 11),
(14, 8),
(1,  15),
(4,  13);

INSERT INTO favorite_users (user_id, target_user_id) VALUES
(2,  1),
(3,  2),
(4,  3),
(5,  4),
(6,  5),
(7,  6),
(8,  7),
(9,  8),
(10, 9),
(11, 10),
(12, 11),
(13, 12),
(14, 13),
(1,  14),
(3,  7);

INSERT INTO albums (user_id, name) VALUES
(1,  'Мои сантехнические работы'),
(2,  'Успехи учеников'),
(3,  'Логотипы и фирстиль'),
(4,  'Свадебные съёмки'),
(5,  'Электромонтаж'),
(6,  'Переводы и документы'),
(7,  'Telegram-боты'),
(8,  'Кейсы по бухгалтерии'),
(9,  'Сборка мебели до/после'),
(10, 'Портфолио макияжа'),
(11, 'UI/UX проекты'),
(12, 'Юридические победы'),
(13, 'Доставки и маршруты'),
(14, 'IELTS успехи студентов'),
(1,  'Избранное клиентов');

INSERT INTO album_items (album_id, service_id) VALUES
(1,  1),
(1,  2),
(2,  3),
(2,  4),
(3,  5),
(4,  6),
(5,  7),
(6,  8),
(7,  9),
(8,  10),
(9,  11),
(10, 12),
(11, 13),
(12, 14),
(14, 15);

INSERT INTO notifications (user_id, type, related_entity_type, related_entity_id, is_read) VALUES
(1,  'new_deal',       'deal',    1,  TRUE),
(2,  'deal_completed', 'deal',    1,  TRUE),
(1,  'new_review',     'review',  1,  TRUE),
(2,  'new_message',    'message', 1,  TRUE),
(3,  'new_deal',       'deal',    5,  TRUE),
(4,  'new_message',    'message', 3,  FALSE),
(5,  'deal_completed', 'deal',    7,  FALSE),
(6,  'new_deal',       'deal',    8,  FALSE),
(7,  'new_message',    'message', 9,  FALSE),
(8,  'new_deal',       'deal',    10, FALSE),
(9,  'new_message',    'message', 11, FALSE),
(10, 'new_deal',       'deal',    12, FALSE),
(11, 'new_message',    'message', 13, FALSE),
(12, 'new_deal',       'deal',    13, FALSE),
(14, 'new_message',    'message', 14, FALSE);

INSERT INTO moderation_queue (entity_type, entity_id, status, moderator_id, rejection_reason, reviewed_at) VALUES
('service', 1,  'approved', 15, NULL,                              CURRENT_TIMESTAMP - INTERVAL '29 days'),
('service', 2,  'approved', 15, NULL,                              CURRENT_TIMESTAMP - INTERVAL '21 days'),
('service', 3,  'approved', 15, NULL,                              CURRENT_TIMESTAMP - INTERVAL '13 days'),
('service', 4,  'approved', 15, NULL,                              CURRENT_TIMESTAMP - INTERVAL '10 days'),
('service', 5,  'approved', 15, NULL,                              CURRENT_TIMESTAMP - INTERVAL '8 days'),
('service', 6,  'approved', 15, NULL,                              CURRENT_TIMESTAMP - INTERVAL '6 days'),
('service', 7,  'approved', 15, NULL,                              CURRENT_TIMESTAMP - INTERVAL '4 days'),
('service', 8,  'approved', 15, NULL,                              CURRENT_TIMESTAMP - INTERVAL '3 days'),
('service', 9,  'approved', 15, NULL,                              CURRENT_TIMESTAMP - INTERVAL '2 days'),
('service', 10, 'approved', 15, NULL,                              CURRENT_TIMESTAMP - INTERVAL '1 day'),
('service', 11, 'approved', 15, NULL,                              CURRENT_TIMESTAMP - INTERVAL '12 hours'),
('service', 12, 'approved', 15, NULL,                              CURRENT_TIMESTAMP - INTERVAL '6 hours'),
('service', 13, 'pending',  NULL, NULL,                            NULL),
('service', 14, 'pending',  NULL, NULL,                            NULL),
('review',  2,  'rejected', 15, 'Содержит контактные данные',      CURRENT_TIMESTAMP - INTERVAL '2 days');

INSERT INTO support_tickets (user_id, subject, message, status, assigned_to) VALUES
(2,  'Не могу войти в аккаунт',             'Ввожу правильный пароль, но сайт не пускает. Помогите!',             'closed',       15),
(5,  'Ошибка при оплате',                   'При попытке оплатить заказ выходит ошибка 500.',                     'closed',       15),
(9,  'Как удалить объявление?',             'Хочу убрать одну услугу, но не нашёл такую кнопку.',                 'closed',       15),
(3,  'Проблема с загрузкой фото',           'Пытаюсь загрузить фото в портфолио, но файл не принимается.',        'closed',       15),
(11, 'Жалоба на исполнителя',               'Исполнитель взял предоплату и пропал, прошу заблокировать.',         'in_progress',  15),
(7,  'Как изменить категорию услуги?',      'Хочу перенести услугу в другую категорию.',                          'in_progress',  15),
(14, 'Не приходят уведомления на почту',    'Настроил email-уведомления, но письма не приходят.',                 'in_progress',  15),
(4,  'Ошибка в отзыве: хочу исправить',    'Поставил не ту оценку, можно ли редактировать отзыв?',               'open',         NULL),
(6,  'Технический вопрос по API',           'Использую ваш API, не понимаю как работает авторизация.',            'open',         NULL),
(8,  'Двойное списание',                    'С карты дважды списалась одна и та же сумма за сделку.',             'open',         NULL),
(10, 'Аккаунт заблокирован без причины',   'Зашла — аккаунт заблокирован, ничего не нарушала.',                  'open',         NULL),
(1,  'Как повысить рейтинг?',              'Хочу понять, от чего зависит рейтинг и как его улучшить.',           'open',         NULL),
(13, 'Не могу добавить услугу',            'При создании услуги форма зависает на последнем шаге.',              'open',         NULL),
(12, 'Вопрос по верификации',              'Как пройти верификацию юриста для отображения значка?',              'open',         NULL),
(NULL,'Общее предложение по улучшению',    'Было бы здорово добавить фильтр по городу на главной странице.',     'open',         NULL);