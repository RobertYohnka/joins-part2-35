const {
    client,
    createTables,
    createProduct,
    createUser,
    fetchUsers,
    fetchProducts,
    createFavorite,
    fetchFavorites,
    destroyFavorite
} = require('./db'); // import the functions from db.js file
const express = require('express');
const app = express();
app.use(express.json());

app.get('/api/users', async (req, res, next) => {
    try {
        res.send(await fetchUsers());
    } catch (error) {
        next(error);
    }
});

app.get('/api/favorites', async (req, res, next) => {


    const init = async () => {
        console.log('connecting to database');
        await client.connect();
        console.log('connected to database');
        await client.query(SQL);
        console.log('tables created');
        const [moe, lucy, curly, ethyl, flowers, paint, lumber, appliances] = await Promise.all([
            createUser({ name: 'moe' }),
            createUser({ name: 'lucy' }),
            createUser({ name: 'curly' }),
            createUser({ name: 'ethyl' }),
            createProduct({ name: 'flowers' }),
            createProduct({ name: 'paint' }),
            createProduct({ name: 'lumber' }),
            createProduct({ name: 'appliances' }),
        ]);
        const users = (await fetchUsers());
        console.log(users);
        const products = (await fetchProducts());
        console.log(products);
        console.log(moe.id)
        console.log(flowers.id)

        const favorites = await Promise.all([
            createFavorite({ user_id: moe.id, product_id: flowers.id }),
            createFavorite({ user_id: ethyl.id, product_id: paint.id }),
            createFavorite({ user_id: lucy.id, product_id: lumber.id }),
        ]);

        console.log(await fetchFavorites(moe.id));
        await destroyFavorite(favorites[0].id);
        console.log(await fetchFavorites(moe.id));
    };

    init();
