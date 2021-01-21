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

DROP TABLE IF EXISTS tag CASCADE;
CREATE TABLE tag(
    id SERIAL,
    label TEXT,
    CONSTRAINT tag_pk PRIMARY KEY (id)
);

DROP TABLE IF EXISTS rating CASCADE;
CREATE TABLE rating(
    id SERIAL,
    value TEXT,
    comment TEXT,
    media_url TEXT,
    system_comment TEXT,
    system_url TEXT,
    CONSTRAINT rating_pk PRIMARY KEY (id)
);

DROP TABLE IF EXISTS judgment CASCADE;
CREATE TABLE judgment(
    id SERIAL,
    label TEXT,
    justification TEXT,
    CONSTRAINT judgment_pk PRIMARY KEY (id)
);

DROP TABLE IF EXISTS review CASCADE;
CREATE TABLE review(
    id SERIAL,
    title TEXT,
    content TEXT,
    publication_date DATE,
    url TEXT,
    language varchar(2),
    rating_id INTEGER,
    judgment_id INTEGER,
    CONSTRAINT review_pk PRIMARY KEY (id),
    CONSTRAINT review_rating_fk FOREIGN KEY (rating_id) REFERENCES rating(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT review_judgment_fk FOREIGN KEY (judgment_id) REFERENCES judgment(id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS agent CASCADE;
CREATE TABLE agent(
    id SERIAL,
    name TEXT,
    tipology TEXT,
    role TEXT,
    affiliation_id INTEGER,
    CONSTRAINT agent_pk PRIMARY KEY (id),
    CONSTRAINT agent_agent_fk FOREIGN KEY (affiliation_id) REFERENCES agent(id) ON UPDATE CASCADE
);

DROP TABLE IF EXISTS claim CASCADE;
CREATE TABLE claim(
    id SERIAL,
    title TEXT,
    content TEXT,
    pubblication_date DATE,
    url TEXT,
    language varchar(2),
    claimant_id INTEGER,
    CONSTRAINT claim_pk PRIMARY KEY (id),
    CONSTRAINT claim_agent_fk FOREIGN KEY (claimant_id) REFERENCES agent(id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS external_entity CASCADE;
CREATE TABLE external_entity(
    id SERIAL,
    label TEXT, -- URI of the entity in DBPedia/Wikipedia
    CONSTRAINT external_entity_pk PRIMARY KEY (id)
);

-- Relation Tables ----------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS topic CASCADE;
CREATE TABLE topic(
    id SERIAL,
    review_id INTEGER,
    tag_id INTEGER,
    CONSTRAINT topic_pk PRIMARY KEY (id),
    CONSTRAINT topic_review_fk FOREIGN KEY (review_id) REFERENCES review(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT topic_tag_fk FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS mention CASCADE;
CREATE TABLE mention(
    id SERIAL,
    review_id INTEGER,
    external_entity_id INTEGER,
    CONSTRAINT mention_pk PRIMARY KEY (id),
    CONSTRAINT mention_review_fk FOREIGN KEY (review_id) REFERENCES review(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT mention_external_entity_fk FOREIGN KEY (external_entity_id) REFERENCES external_entity(id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS review_author CASCADE;
CREATE TABLE review_author(
    id SERIAL,
    review_id INTEGER,
    agent_id INTEGER,
    CONSTRAINT review_author_pk PRIMARY KEY (id),
    CONSTRAINT review_author_review_fk FOREIGN KEY (review_id) REFERENCES review(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT review_author_agent_fk FOREIGN KEY (agent_id) REFERENCES agent(id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS about CASCADE;
CREATE TABLE about(
    id SERIAL,
    review_id INTEGER,
    claim_id INTEGER,
    CONSTRAINT about_pk PRIMARY KEY (id),
    CONSTRAINT about_review_fk FOREIGN KEY (review_id) REFERENCES review(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT about_claim_fk FOREIGN KEY (claim_id) REFERENCES claim(id) ON DELETE CASCADE ON UPDATE CASCADE
);
