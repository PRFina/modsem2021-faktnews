INSERT INTO tag (label) values
	('politica'),
	('deepfake'),
	('politics');

-- TODO: ricordarsi di sostituire il campo value con i nostri possibili value {True, Mostly True, Mostly False, False}
INSERT INTO rating (value, comment, media_url, system_comment, system_url) values
	('True',
	'Le affermazioni di Zingaretti e di molti altri esponenti della maggioranza sono TENDENZIALMENTE VERE. È vero infatti che la situazione dopo l’emanazione di ...[+203 words]',
	NULL,
	'Tendenzialmente vero',
	'https://www.lavoce.info/come-facciamo-il-fact-checking/'),
	('Mostly False',
	'Il 13 gennaio il segretario della Lega Matteo Salvini ha criticato il governo, colpevole – a suo dire – di voler ...[+1348 words]',
	NULL,
	'Pinocchio andante',
	'https://pagellapolitica.it/static/metodologia'),
	('False',
	'Deepfake. A couple of short video clips, a voice actor and an artificial intelligence algorithm.',
	NULL,
	NULL,
	'https://www.washingtonpost.com/graphics/2019/politics/fact-checker/manipulated-video-guide/?noredirect=on&utm_term=.985468bf6c1e&itid=lk_inline_manual_9'),
	('False',
	'The Facebook post is inaccurate and ridiculous. We rate it Pants on Fire!',
	'https://static.politifact.com/politifact/rulings/tom_ruling_pof.png',
	'Pants On Fire',
	'https://www.politifact.com/article/2018/feb/12/principles-truth-o-meter-politifacts-methodology-i/#Truth-O-Meter%20ratings');

INSERT INTO judgment (label, justification) values
	('Confirmed Fact', 'The fact is true and confirmed by Massimo Taddei (affiliated to lavoce.info).'),
	('Missing Context', 'Salvini often claims something without putting it into the rigth context.'),
	('Fabrication', 'The video is fake because it shows Mark Zuckerberg bragging about abusing “stolen data” from users.'),
	('Deceptive Editing','The video cited in the post shows Obama visiting the cell where Nelson Mandela was imprisoned in South Africa');

INSERT INTO review (title, content, publication_date, url, language, rating_id, judgment_id) values
	('Il governo ha davvero abolito i “decreti sicurezza”?', 
	'Il fact-checking de lavoce.info passa ...[+1283 words]', 
	'2020-10-08', 
	'https://www.lavoce.info/archives/69816/il-governo-ha-davvero-abolito-i-decreti-sicurezza/', 
	'it',
	'1', -- rating_id -> True
	'1'), -- judgment_id -> Confirmed Fact
	('No, “genitore 1 e 2” non tornano sui documenti d’identità (non ci sono mai stati)', 
	'Al governo si preoccupano di cancellare “padre” e “madre” dalla carta di identità dei minori per sostituirli con genitore 1 e 2 ...[+1568 words]', 
	'2021-01-15', 
	'https://pagellapolitica.it/dichiarazioni/8801/no-genitore-1-e-2-non-tornano-sui-documenti-didentita-non-ci-sono-mai-stati',
	'it',
	'2', -- rating_id -> Mostly False
	'2'), -- judgment_id -> Missing Context
	('Facebook wouldn’t delete an altered video of Nancy Pelosi. What about one of Mark Zuckerberg?', 
	'A couple of short video clips, a voice actor and an artificial intelligence algorithm. That’s all two artists and a technology start-up ...[+1497 words]', 
	'2019-06-19', 
	'https://www.washingtonpost.com/nation/2019/06/12/mark-zuckerberg-deepfake-facebook-instagram-nancy-pelosi/',
	'en',
	'3', -- rating_id -> False
	'3'), -- judgment_id -> Fabbrication
	('Barack Obama wasn’t arrested before Biden’s inauguration', 
	'In a video published Jan. 17, Gage Nelson, host of the conservative podcast America Divided, said: "Barack Obama was arrested."',
	'2021-01-18',
	'https://www.politifact.com/factchecks/2021/jan/18/facebook-posts/obama-wasnt-arrested-bidens-inauguration/',
	'en',
	'4', -- rating_id -> False
	'4'); -- judgment_id -> Deceptive Editing

INSERT INTO agent (name, type, role, affiliation_id) values
	('International Fact Checking Organization', 'Fact Checking Authority', 'factchecker', NULL),
	('Lavoce.info', 'Fact Checking Organization', 'factchecker', NULL),
	('Massimo Taddei', 'Person', 'factchecker', '2'),
	('Pagella Politica', 'Fact Checking Organization', 'factchecker', NULL),
	('Washington Post', 'Fact Checking Organization', 'factchecker', NULL),
	('Allyson Chiu', 'Person', 'factchecker', '5'),
	('Politifact.com', 'Fact Checking Organization', 'factchecker', NULL),
	('Daniel Funke', 'Person', 'factchecker', '7'),
	('Nicola Zingaretti', 'Person', 'claimant', NULL),
	('Matteo Salvini', 'Person', 'claimant', NULL),
	('Donald TrumpBot', 'Software Agent', 'claimant', NULL),
	('Mark Zucherberg', 'Person', 'claimant', NULL);

INSERT INTO claim (content, publication_date, url, language, claimant_id) values
	('Approvato ora in Consiglio dei Ministri il decreto immigrazione. I decreti propaganda/Salvini non ci sono più. Vogliamo un’Italia  più umana e sicura. Un’Europa più protagonista', 
	'2020-10-05', 
	'https://twitter.com/nzingaretti/status/1313218301200400389?ref_src=twsrc%5Etfw',
	'it',
	'5'
	),
	('Con tutti i problemi che ci sono in Italia, al governo si preoccupano di cancellare “padre” e “madre” dalla carta di identità dei minori per sostituirli con Genitore 1 e 2. Prima vanno a casa, meglio è.', 
	'2021-01-13', 
	'https://twitter.com/matteosalvinimi/status/1349377644941479937',
	'it',
	'6'
	),
	('Zuckerberg: we are increasing transparency on Ads. Announces new measure to protect the elections.', 
	'2019-06-07', 
	'https://www.instagram.com/p/ByaVigGFP2U/?utm_source=ig_embed&utm_campaign=embed_video_watch_again',
	'en',
	'7'
	),
	('Barack Obama was arrested: a video published on Facebook claims to show former President Barack Obama in jail.', 
	'2021-01-17', 
	'https://archive.vn/5P96s',
	'en',
	'6'
	);
	

INSERT INTO external_entity (label) values
	('http://dbpedia.org/page/Nicola_Zingaretti'),
	('http://dbpedia.org/page/Matteo_Salvini'),
	('https://dbpedia.org/page/Mark_Zuckerberg'),
	('https://dbpedia.org/page/Barack_Obama'),
	('https://www.wikidata.org/wiki/Q51213808'),
	('https://dbpedia.org/page/Nelson_Mandela');

-- Relational tables -------------------------------------------------------------------------------------------------

INSERT INTO topic (review_id, tag_id) values
	('1', '1'),
	('2', '1'),
	('3', '2'),
	('4', '3');

INSERT INTO mention (review_id, entity_id) values
	('1', '1'),
	('2', '2'),
	('3', '3'),
	('4', '4'),
	('4', '5'),
	('4', '6');

INSERT INTO review_author (review_id, agent_id) values
	('1', '3'),
	('2', '4'),
	('3', '6'),
	('4', '8');

INSERT INTO about (review_id, claim_id) values
	('1', '1'),
	('2', '2'),
	('3', '3'),
	('4', '4');
