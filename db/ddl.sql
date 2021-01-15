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

DROP TABLE IF EXISTS agent;
CREATE TABLE agent(
    id uuid DEFAULT uuid_generate_v4(),
    name TEXT,
    typology TEXT,
    CONSTRAINT agent_pk PRIMARY KEY (id)
);
-- INSERT INTO agent (name, typology) values
-- 	('John Doe','Person'),
-- 	('Donald Trump','Person'),
-- 	('International Fact Checking Organisation','Authority'),
-- 	('Politifact','Fact Checking Organisation');

DROP TABLE IF EXISTS judgment;
CREATE TABLE judgment(
    id uuid DEFAULT uuid_generate_v4 (),
    value TEXT,
    CONSTRAINT judgment_pk PRIMARY KEY (id)
);

DROP TABLE IF EXISTS rating;
CREATE TABLE rating(
    id uuid DEFAULT uuid_generate_v4 (),
    value TEXT,
    comment TEXT,
    associated_media_url TEXT,
    system_comment TEXT,
    system_url TEXT,
    CONSTRAINT rating_pk PRIMARY KEY (id)
);

DROP TABLE IF EXISTS evidence_source;
CREATE TABLE evidence_source(
    id uuid DEFAULT uuid_generate_v4 (),
    name TEXT,
    url TEXT,
    CONSTRAINT evidence_source_pk PRIMARY KEY (id)
);

DROP TABLE IF EXISTS evidence;
CREATE TABLE evidence(
    id uuid DEFAULT uuid_generate_v4 (),
    title TEXT,
    pubblication_date DATE,
    url TEXT,
    evidence_source_id uuid,
    CONSTRAINT evidence_pk PRIMARY KEY (id),
    CONSTRAINT evidence_evidence_source_fk FOREIGN KEY (evidence_source_id) REFERENCES evidence_source(id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS review;
CREATE TABLE review(
    id uuid DEFAULT uuid_generate_v4 (),
    title TEXT,
    content TEXT,
    pubblication_date DATE,
    url TEXT,
    author_id uuid,
    rating_id uuid,
    judgment_id uuid,
    CONSTRAINT review_pk PRIMARY KEY (id),
    CONSTRAINT review_agent_fk FOREIGN KEY (author_id) REFERENCES agent(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT review_rating_fk FOREIGN KEY (rating_id) REFERENCES rating(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT review_judgment_fk FOREIGN KEY (judgment_id) REFERENCES judgment(id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS claim;
CREATE TABLE claim(
    id uuid DEFAULT uuid_generate_v4 (),
    title TEXT,
    content TEXT,
    pubblication_date DATE,
    url TEXT,
    author_id uuid,
    CONSTRAINT claim_pk PRIMARY KEY (id),
    CONSTRAINT claim_agent_fk FOREIGN KEY (author_id) REFERENCES agent(id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS evidences;
CREATE TABLE evidences(
    id uuid DEFAULT uuid_generate_v4 (),
    review_id uuid,
    evidence_id uuid,
    is_proving BOOLEAN, -- TODO: decidere se modellarlo così oppure con un campo "tipology TEXT" in cui si scrive se proving o disproving.
    CONSTRAINT evidences_pk PRIMARY KEY (id),
    CONSTRAINT evidences_review_fk FOREIGN KEY (review_id) REFERENCES review(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT evidences_evidence_fk FOREIGN KEY (evidence_id) REFERENCES evidence(id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS mentions;
CREATE TABLE mentions(
    id uuid DEFAULT uuid_generate_v4 (),
    review_id uuid,
    claim_id uuid,
    CONSTRAINT mentions_pk PRIMARY KEY (id),
    CONSTRAINT mentions_review_fk FOREIGN KEY (review_id) REFERENCES review(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT mentions_claim_fk FOREIGN KEY (claim_id) REFERENCES claim(id) ON DELETE CASCADE ON UPDATE CASCADE
);
