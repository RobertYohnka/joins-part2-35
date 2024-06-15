const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/the_acme_store_db');

const createTables = async () => {
    const SQL = `
        DROP TABLE IF EXISTS favorites;
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS users;

        CREATE TABLE users(
            id UUID PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(50) NOT NULL
        );

        CREATE TABLE products(
            id UUID PRIMARY KEY,
            name VARCHAR(100) NOT NULL
        );
        
        CREATE TABLE favorites(
            id UUID PRIMARY KEY,
            product_id UUID REFERENCES products(id) NOT NULL,
            user_id UUID REFERENCES users(id) NOT NULL,
            CONSTRAINT unique_favorite UNIQUE (product_id, user_id) 
        );
    `;
    await client.query(SQL);
};

const createUser = async ({ username, password }) => {
    const SQL = `
    INSERT INTO users(id, username, password)
    VALUES ($1, $2, $3)
    RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), username, password]);
    return response.rows[0];
}

const createProduct = async ({ name }) => {
    const SQL = `
    INSERT INTO products(id, name)
    VALUES ($1, $2)
    RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
}

module.exports = {
    client,
    createTables,
    createProduct,
    createUser,
    fetchUsers,
    createFavorite,
    fetchFavorites,
    destroyFavorite
};
