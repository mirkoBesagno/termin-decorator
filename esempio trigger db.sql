

/* Creo tabella! */



/* ESEGUO : elimino tutte le tabelle */
DROP SCHEMA public CASCADE;
/* ricreo lo schema pubblico, ovvero quello di default */
CREATE SCHEMA public;
    GRANT ALL ON SCHEMA public TO postgres;
    GRANT ALL ON SCHEMA public TO public;
    COMMENT ON SCHEMA public IS 'standard public schema';

ESEGUO : 
CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW;
    END;
    $$ language 'plpgsql';


ESEGUO : 
CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW;
    END;
    $$ language 'plpgsql';    
    


ESEGUO :
CREATE TABLE  IF NOT EXISTS  Persona(
updated_at timestamp with time zone  NOT NULL  DEFAULT current_timestamp,
created_at timestamp with time zone  NOT NULL  DEFAULT current_timestamp,
deleted_at timestamp with time zone,
nome varchar(255),
id SERIAL PRIMARY KEY
);

ESEGUO : 
DROP TRIGGER IF EXISTS tg_somethings_updated_at ON Persona;
        CREATE TRIGGER tg_somethings_updated_at
        BEFORE UPDATE
        ON Persona
        FOR EACH ROW
        EXECUTE PROCEDURE update_updated_at_column();

ESEGUO :
CREATE INDEX IF NOT EXISTS idx_somethings_deleted_at ON Persona (deleted_at ASC);

*******




CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW;
    END;
    $$ language 'plpgsql';
CREATE TABLE  IF NOT EXISTS  Persona(
updated_at timestamp with time zone  NOT NULL  DEFAULT current_timestamp,
created_at timestamp with time zone  NOT NULL  DEFAULT current_timestamp,
deleted_at timestamp with time zone,
nome varchar(255),
id SERIAL PRIMARY KEY
);
DROP TRIGGER IF EXISTS tg_somethings_updated_at ON Persona;
CREATE TRIGGER tg_somethings_updated_at
        BEFORE UPDATE
        ON Persona
        FOR EACH ROW
        EXECUTE PROCEDURE update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_somethings_deleted_at ON Persona (deleted_at ASC);


/* Creo l'estensione per gestire javascript ora devo installarla prima nel sistema operativo. */
CREATE EXTENSION plv8;

CREATE OR REPLACE FUNCTION test_trigger() RETURNS trigger AS
$$
    if (NEW.nome != 'mirko'){  
        plv8.elog(INFO, 'HELLO', 'Messaggio di saluto sei passato!') 
        return NEW;
    }
    else{
       throw new Error('Attenzione nome Mirko, illegale'); 
    }
$$
LANGUAGE "plv8";


DROP TRIGGER IF EXISTS test_trigger ON persona;

CREATE TRIGGER test_trigger
    BEFORE INSERT OR UPDATE 
    ON persona FOR EACH ROW
    EXECUTE PROCEDURE test_trigger();


INSERT INTO persona(nome) VALUES ('Michele');
INSERT INTO persona(nome) VALUES ('Mirko');