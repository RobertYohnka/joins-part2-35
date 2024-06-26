const {
    client,
    createTables,
    createUser,
    createProduct,
    createFavorite,
    fetchUsers,
    fetchProducts,
    fetchFavorites,
    destroyFavorite
} = require('./db'); // import the functions from db.js file
const express = require('express');
const app = express();
app.use(express.json());

app.get('/api/products', async (req, res, next) => {
    try {
        res.send(await fetchProducts());
    } catch (error) {
        next(error);
    }
});

app.get('/api/users', async (req, res, next) => {
    try {
        res.send(await fetchUsers());
    } catch (error) {
        next(error);
    }
});


app.get('/api/users/:id/favorites', async (req, res, next) => {
    try {
        res.send(await fetchFavorites(req.params.id));
    } catch (error) {
        next(error);
    }
});

app.post('/api/users/:id/favorites', async (req, res, next) => {
    try {
        res.status(201).send(await createFavorite({ user_id: req.params.id, product_id: req.body.product_id }));
    } catch (error) {
        next(error);
    }
});

app.delete('/api/users/:id/favorites/:favorite_id', async (req, res, next) => {
    try {
        await destroyFavorite({ user_id: req.params.userId, id: req.params.favorite_id });
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
});


const init = async () => {
    console.log('connecting to database');
    await client.connect();
    console.log('connected to database');
    await createTables();
    console.log('tables created');
    const [moe, lucy, curly, ethyl, flowers, paint, lumber, appliances] = await Promise.all([
        createUser({ username: 'moe', password: 'moe123' }),
        createUser({ username: 'lucy', password: 'lucy123' }),
        createUser({ username: 'curly', password: 'curly123' }),
        createUser({ username: 'ethyl', password: 'ethyl123' }),
        createProduct({ name: 'flowers' }),
        createProduct({ name: 'paint' }),
        createProduct({ name: 'lumber' }),
        createProduct({ name: 'appliances' }),
    ]);
    const users = await fetchUsers();
    console.log(users);

    const products = await fetchProducts();
    console.log(products);
    console.log(moe.id)
    console.log(flowers.id)

    const favorites = await Promise.all([
        createFavorite({ user_id: moe.id, product_id: flowers.id }),
        createFavorite({ user_id: ethyl.id, product_id: paint.id }),
        createFavorite({ user_id: lucy.id, product_id: lumber.id }),
        createFavorite({ user_id: curly.id, product_id: appliances.id }),
    ]);

    console.log(await fetchFavorites(moe.id));
    await destroyFavorite(favorites[0].id);
    console.log(await fetchFavorites(moe.id));

    console.log(`CURL localhost:3000/api/users/${moe.id}/favorites -d '{"product_id": "${lumber.id}"}' -H "Content-Type: application/json'`);

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
