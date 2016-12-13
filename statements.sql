CREATE INDEX idx_movies_title ON movies(title) WHERE META().id LIKE "Movie%";
CREATE INDEX idx_persons_name ON movies(name) WHERE META().id LIKE "Person%";
SELECT name, META().id FROM movies WHERE META().id LIKE "Person%" AND name LIKE "A%";
SELECT title, META().id FROM movies WHERE META().id LIKE "Movie%" AND title LIKE "A%";
