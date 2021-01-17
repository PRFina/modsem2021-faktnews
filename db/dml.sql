INSERT INTO source (name, url) values
	('twitter.it','https://www.twitter.it/');

insert into evidence (title, pubblication_date, source_id, url) values
	('Nicola Zingaretti (@nzingaretti) October 5, 2020','2020-10-05','436444a1-6f56-403d-9526-3d5469ba25a1','https://twitter.com/nzingaretti/status/1313218301200400389?ref_src=twsrc%5Etfw'),
	('Matteo Salvini (@matteosalvinimi) January 13, 2021', '2021-01-13', '436444a1-6f56-403d-9526-3d5469ba25a1', 'https://twitter.com/matteosalvinimi/status/1349377644941479937');

insert into rating (value, comment, associated_media_url, system_comment, system_url) values
	('TENDENZIALMENTE VERO',
	'Le affermazioni di Zingaretti e di molti altri esponenti della maggioranza sono TENDENZIALMENTE VERE. È vero infatti che...',
	'',
	'Le dichiarazioni sono catalogate secondo l’accuratezza: Vero, Tendenzialmente vero, Incerto, Tendenzialmente falso, Falso',
	'https://www.lavoce.info/come-facciamo-il-fact-checking/'),
	('PINOCCHIO ANDANTE',
	'Secondo Matteo Salvini, il governo vuole...',
	'',
	'Le dichiarazioni sono catalogate secondo l’accuratezza: Vero, cera quasi, ni, pinocchio andante panzana pazesca',
	'https://pagellapolitica.it/static/metodologia');

insert into judgment (value) values
	('Confirmed Fact'),
	('Deceptive Editing'),
	('Omission'),
	('Splicing'),
	('Malicious Transformation'),
	('Doctoring'),
	('Fabrication'),
	('Missing Context'),
	('Isolation'),
	('Misrepresentation'),
	('Not Clear Geography Context'),
	('Not Clear Time Period Context'),
	('Not Clear Subject'),
	('Qualitative Claim');

INSERT INTO review (title, content, pubblication_date, url, language, rating_id, judgment_id) values
	('Il governo ha davvero abolito i “decreti sicurezza”?', 
	'Il fact-checking de lavoce.info passa...', 
	'2020-10-08', 
	'https://www.lavoce.info/archives/69816/il-governo-ha-davvero-abolito-i-decreti-sicurezza/', 
	'it',
	'4638197e-71d5-4b53-8294-98a6e3fb4a0a', -- rating_id
	'69eb692d-bede-465b-997b-23ebdf13db68'), -- judgment_id
	('No, “genitore 1 e 2” non tornano sui documenti d’identità (non ci sono mai stati)', 
	'Al governo si preoccupano di cancellare “padre” e “madre” dalla carta di identità dei minori per sostituirli con genitore 1 e 2', 
	'2021-01-15', 
	'https://pagellapolitica.it/dichiarazioni/8801/no-genitore-1-e-2-non-tornano-sui-documenti-didentita-non-ci-sono-mai-stati',
	'it',
	'5203a00a-d53e-4a7f-8f71-595533d6aaab', -- rating_id
	'9a54b9b4-8ffa-464c-8617-52e476f59937'); -- judgment_id

INSERT INTO agent (name, tipology) values
	('Massimo Taddei', 'Person'),
	('Pagella Politica', 'Fact Checking Organization'),
	('International Fact Checking Organization', 'Fact Checking Authority'),
	('Donald TrumpBot', 'Software Agent');

INSERT INTO claim (title, content, pubblication_date, url) values
	('Tweet di Nicola Zingaretti', 
	'Approvato ora in Consiglio dei Ministri il decreto immigrazione. I decreti propaganda/Salvini non ci sono più. Vogliamo un’Italia  più umana e sicura. Un’Europa più protagonista', 
	'2020-10-05', 
	'https://twitter.com/nzingaretti/status/1313218301200400389?ref_src=twsrc%5Etfw',
	'it'
	),
	('No, “genitore 1 e 2” non tornano sui documenti d’identità (non ci sono mai stati)', 
	'Con tutti i problemi che ci sono in Italia, al governo si preoccupano di cancellare “padre” e “madre” dalla carta di identità dei minori per sostituirli con Genitore 1 e 2. Prima vanno a casa, meglio è.', 
	'2021-01-13', 
	'https://twitter.com/matteosalvinimi/status/1349377644941479937',
	'it'
	);

INSERT INTO external_entity (label) values
	('http://dbpedia.org/page/Matteo_Salvini'),
	('http://dbpedia.org/page/Nicola_Zingaretti');

-- From here to on ou have to link the tables by hand using the UUID! -------------------------------------------------
