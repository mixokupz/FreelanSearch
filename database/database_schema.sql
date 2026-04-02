CREATE TABLE organizations (
    org_id  SERIAL PRIMARY KEY,
    orgid   VARCHAR(100),
    orgname VARCHAR(500) NOT NULL,
    country CHAR(3),
    town    VARCHAR(100)
);

CREATE TABLE organization_names (
    id     SERIAL PRIMARY KEY,
    org_id INTEGER      NOT NULL REFERENCES organizations(org_id),
    name   VARCHAR(500) NOT NULL,
    type   VARCHAR(100)
);

CREATE TABLE journals (
    journal_id            SERIAL PRIMARY KEY,
    title                 VARCHAR(500) NOT NULL,
    issn                  VARCHAR(20),
    eissn                 VARCHAR(20),
    publisher             VARCHAR(500),
    country               CHAR(3),
    town                  VARCHAR(100),
    website               VARCHAR(500),
    doi_prefix            VARCHAR(100),
    translated_journal_id INTEGER REFERENCES journals(journal_id)
);

CREATE TABLE journal_titles (
    title_id   SERIAL PRIMARY KEY,
    journal_id INTEGER NOT NULL REFERENCES journals(journal_id),
    lang       CHAR(2),
    title_text TEXT    NOT NULL
);

CREATE TABLE issues (
    issue_id   SERIAL PRIMARY KEY,
    journal_id INTEGER     NOT NULL REFERENCES journals(journal_id),
    year       SMALLINT    NOT NULL,
    volume     SMALLINT,
    number     VARCHAR(20),
    contnumber INTEGER
);

CREATE TABLE items (
    item_id            INTEGER PRIMARY KEY,
    issue_id           INTEGER     NOT NULL REFERENCES issues(issue_id),
    linkurl            TEXT,
    genre              VARCHAR(100),
    type               VARCHAR(100),
    pages              VARCHAR(30),
    language           CHAR(2),
    doi                VARCHAR(100),
    edn                VARCHAR(20),
    grnti              VARCHAR(20),
    risc               BOOLEAN,
    corerisc           BOOLEAN,
    citation           TEXT,
    supported          TEXT,
    print_date         DATE,
    received_date      DATE,
    authors_count      SMALLINT,
    translated_item_id INTEGER REFERENCES items(item_id)
);

CREATE TABLE authors (
    author_id          SERIAL PRIMARY KEY,
    elibrary_author_id INTEGER UNIQUE,
    firstname          VARCHAR(200),
    middlename         VARCHAR(200),
    lastname           VARCHAR(200) NOT NULL,
    initials           VARCHAR(200),
    email              VARCHAR(200),
    general_org_id     INTEGER REFERENCES organizations(org_id)
);

CREATE TABLE author_names (
    id         SERIAL PRIMARY KEY,
    author_id  INTEGER      NOT NULL REFERENCES authors(author_id),
    lang       CHAR(2)      NOT NULL,
    firstname  VARCHAR(200),
    middlename VARCHAR(200),
    lastname   VARCHAR(200) NOT NULL,
    initials   VARCHAR(200)
);

CREATE TABLE item_authors (
    id                 SERIAL PRIMARY KEY,
    item_id            INTEGER  NOT NULL REFERENCES items(item_id),
    author_id          INTEGER  NOT NULL REFERENCES authors(author_id),
    num                SMALLINT,
    aboutauthor        VARCHAR(300),
    affiliations_count SMALLINT,
    UNIQUE (item_id, author_id)
);

CREATE TABLE author_affiliations (
    id                   SERIAL PRIMARY KEY,
    item_author_id       INTEGER      NOT NULL REFERENCES item_authors(id),
    org_id               INTEGER      NOT NULL REFERENCES organizations(org_id),
    num                  SMALLINT,
    affiliation_as_given VARCHAR(500)
);

CREATE TABLE titles (
    title_id   SERIAL PRIMARY KEY,
    item_id    INTEGER NOT NULL REFERENCES items(item_id),
    lang       CHAR(2),
    title_text TEXT    NOT NULL
);

CREATE TABLE databases (
    db_id            SERIAL PRIMARY KEY,
    name             VARCHAR(200) NOT NULL,
    website          VARCHAR(500),
    quartile_prefix  VARCHAR(50)
);

CREATE TABLE journals_databases (
    id         SERIAL PRIMARY KEY,
    journal_id INTEGER  NOT NULL REFERENCES journals(journal_id),
    db_id      INTEGER  NOT NULL REFERENCES databases(db_id),
    year       SMALLINT NOT NULL,
    is_included BOOLEAN NOT NULL,
    quartile   VARCHAR(10),
    if_value   FLOAT,
    percentile FLOAT,
    UNIQUE (journal_id, db_id, year)
);

CREATE TABLE author_databases (
    id           SERIAL PRIMARY KEY,
    author_id    INTEGER NOT NULL REFERENCES authors(author_id),
    db_id        INTEGER NOT NULL REFERENCES databases(db_id),
    db_author_id TEXT,
    UNIQUE (author_id, db_id)
);

CREATE TABLE white_list_versions (
    version_id   SERIAL PRIMARY KEY,
    version_name VARCHAR(100) NOT NULL,
    published_at DATE,
    description  TEXT
);

CREATE TABLE white_list_entries (
    entry_id   SERIAL PRIMARY KEY,
    journal_id INTEGER  NOT NULL REFERENCES journals(journal_id),
    version_id INTEGER  NOT NULL REFERENCES white_list_versions(version_id),
    level      SMALLINT,
    included_at DATE,
    excluded_at DATE,
    UNIQUE (journal_id, version_id)
);
