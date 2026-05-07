-- Up
CREATE TABLE drawing_data (
    id TEXT PRIMARY KEY,
    title VARCHAR(50),
    stroke_data TEXT NOT NULL,
    created_at DATETIME
);

-- Down
DROP TABLE drawing_data;