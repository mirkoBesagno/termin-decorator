CREATE TABLE Persona(
updated_at timestamp with time zone  NOT NULL  DEFAULT current_timestamp,
created_at timestamp with time zone  NOT NULL  DEFAULT current_timestamp,
deleted_at timestamp with time zone,
nome   text
);
CREATE INDEX idx_somethings_deleted_at ON Persona (deleted_at ASC);
CREATE TRIGGER tg_somethings_updated_at
        BEFORE UPDATE
        ON Persona
        FOR EACH ROW
        EXECUTE PROCEDURE update_updated_at_column();
CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW;
    END;
    $$ language 'plpgsql';