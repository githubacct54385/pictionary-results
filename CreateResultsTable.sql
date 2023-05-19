CREATE TABLE Results (
    id UUID PRIMARY KEY, 
    datetime TIMESTAMP not null, 
    animal VARCHAR(255) not null, 
    winner VARCHAR(255) not null, 
    artist VARCHAR(255) not null,
    userId VARCHAR(255) not null,
    isDeleted bool not null)
