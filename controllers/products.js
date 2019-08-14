const handleProductsGet = (req,res,db) => {
    const {user_id} = req.headers;
    console.log('our id in the get: ', user_id)
    db.select(['product.id', 'product.name', 'product.price', 'store.store_name', 'category.category_name']).returning('*')
            .from('product')
            .innerJoin('store', 'store.id', '=', 'product.store_id')
            .innerJoin('category', 'category.id', '=', 'product.category_id')
            .where('product.added_by', '=', user_id)
            .orderBy('product.name')
            .then(data => res.json(data))
}
const handleProductEdit = (req,res,db) => {
    const {id, user_id} = req.headers;
        const {newPrice} = req.body;

        console.log('our id: ', id)
        console.log('our id: ', user_id)
        //take input value and add to db
        db('product').returning('*').where('id', '=', id).andWhere('added_by', user_id)
        .update({
            price: newPrice,
        }).then(response => {
            console.log('we had a response');
            res.json(response)
        }).catch(err => res.status(400).json('unable to update'))
}

const handleAddProduct = (req,res,db) => {
    const product = req.body;
    const {user_id} = req.headers;
    console.log('product received: ', product)
    console.log('our id: ', user_id)
    //take input value and add to db
    db('product').returning('*').insert({
        name: product.name,
        price: parseInt(product.price),
        store_id: product.store,
        category_id: product.category,
        added_by: user_id,
        date_added: new Date(),
    }).then(response => {
        console.log('we had a response');
        res.json(response)
    }).catch(err => res.status(400).json('unable to add'))
}

const handleDeleteProduct = (req,res,db) => {
        //get id and delete it from db
        const {id, user_id} = req.headers;
        console.log('our id: ', id)
        console.log('our id: ', user_id)
        //take input value and add to db
        db('product').returning('*').where('id', '=', id).andWhere('added_by', user_id)
        .delete().then(response => {
            console.log('we had a response, ' , response);
            res.json(response)
        }).catch(err => res.status(400).json('unable to delete'))
}

module.exports = {
    handleProductsGet,
    handleProductEdit,
    handleAddProduct,
    handleDeleteProduct
}