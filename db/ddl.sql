--DROP DATABASE IF EXISTS faktnews;
--CREATE DATABASE faktnews;
--USE faktnews;

--DROP SCHEMA IF EXISTS public;
--CREATE SCHEMA public AUTHORIZATION <username>;

/* Imported module, in order to use the "uuid_generate_v4()" function and use UUID. 
for more information see: 

1. Tutorial on UUID in PGSQL: https://www.postgresqltutorial.com/postgresql-uuid/
2. PGSQL UUID type: https://www.postgresql.org/docs/9.1/datatype-uuid.html
3. PGSQL uuid-ossp module: https://www.postgresql.org/docs/9.1/uuid-ossp.html
*/
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- id uuid DEFAULT uuid_generate_v4 ()

DROP TABLE IF EXISTS source;
CREATE TABLE source(
    id SERIAL,
    name TEXT,
    url TEXT,
    CONSTRAINT source_pk PRIMARY KEY (id)
);

DROP TABLE IF EXISTS evidence;
CREATE TABLE evidence(
    id SERIAL,
    title TEXT,
    pubblication_date DATE,
    url TEXT,
    source_id INTEGER,
    CONSTRAINT evidence_pk PRIMARY KEY (id),
    CONSTRAINT evidence_source_fk FOREIGN KEY (source_id) REFERENCES source(id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS rating;
CREATE TABLE rating(
    id SERIAL,
    value TEXT,
    comment TEXT,
    associated_media_url TEXT,
    system_comment TEXT,
    system_url TEXT,
    CONSTRAINT rating_pk PRIMARY KEY (id)
);

DROP TABLE IF EXISTS judgment;
CREATE TABLE judgment(
    id SERIAL,
    value TEXT,
    CONSTRAINT judgment_pk PRIMARY KEY (id)
);

DROP TABLE IF EXISTS review;
CREATE TABLE review(
    id SERIAL,
    title TEXT,
    content TEXT,
    pubblication_date DATE,
    url TEXT,
    language varchar(2),
    rating_id INTEGER,
    judgment_id INTEGER,
    CONSTRAINT review_pk PRIMARY KEY (id),
    CONSTRAINT review_rating_fk FOREIGN KEY (rating_id) REFERENCES rating(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT review_judgment_fk FOREIGN KEY (judgment_id) REFERENCES judgment(id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS agent;
CREATE TABLE agent(
    id SERIAL,
    name TEXT,
    tipology TEXT,
    CONSTRAINT agent_pk PRIMARY KEY (id),
    CONSTRAINT agent_agent_fk FOREIGN KEY (id) REFERENCES agent(id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS claim;
CREATE TABLE claim(
    id SERIAL,
    title TEXT,
    content TEXT,
    pubblication_date DATE,
    url TEXT,
    language varchar(2),
    CONSTRAINT claim_pk PRIMARY KEY (id)
);

DROP TABLE IF EXISTS external_entity;
CREATE TABLE external_entity(
    id SERIAL,
    label TEXT, -- URI of the entity in DBPedia/Wikipedia
    CONSTRAINT external_entity_pk PRIMARY KEY (id)
);

-- Relation Tables ----------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS evidence_in_review;
CREATE TABLE evidence_in_review(
    id SERIAL,
    review_id INTEGER,
    evidence_id INTEGER,
    is_proving BOOLEAN, -- TODO: decidere se modellarlo così oppure con un campo "tipology TEXT" in cui si scrive se proving o disproving.
    CONSTRAINT evidence_in_review_pk PRIMARY KEY (id),
    CONSTRAINT evidence_in_review_review_fk FOREIGN KEY (review_id) REFERENCES review(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT evidence_in_review_evidence_fk FOREIGN KEY (evidence_id) REFERENCES evidence(id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS mention;
CREATE TABLE mention(
    id SERIAL,
    review_id INTEGER,
    external_entity_id INTEGER,
    CONSTRAINT mention_pk PRIMARY KEY (id),
    CONSTRAINT mention_review_fk FOREIGN KEY (review_id) REFERENCES review(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT mention_external_entity_fk FOREIGN KEY (external_entity_id) REFERENCES external_entity(id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS review_author;
CREATE TABLE review_author(
    id SERIAL,
    review_id INTEGER,
    agent_id INTEGER,
    CONSTRAINT review_author_pk PRIMARY KEY (id),
    CONSTRAINT review_author_review_fk FOREIGN KEY (review_id) REFERENCES review(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT review_author_agent_fk FOREIGN KEY (agent_id) REFERENCES agent(id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS claim_author;
CREATE TABLE claim_author(
    id SERIAL,
    claim_id INTEGER,
    agent_id INTEGER,
    CONSTRAINT claim_author_pk PRIMARY KEY (id),
    CONSTRAINT claim_author_claim_fk FOREIGN KEY (claim_id) REFERENCES claim(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT review_author_agent_fk FOREIGN KEY (agent_id) REFERENCES agent(id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS about;
CREATE TABLE about(
    id SERIAL,
    review_id INTEGER,
    claim_id INTEGER,
    CONSTRAINT about_pk PRIMARY KEY (id),
    CONSTRAINT about_review_fk FOREIGN KEY (review_id) REFERENCES review(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT about_claim_fk FOREIGN KEY (claim_id) REFERENCES claim(id) ON DELETE CASCADE ON UPDATE CASCADE
);
