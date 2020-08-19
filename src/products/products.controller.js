import request from 'superagent'

const API = 'https://api.mercadolibre.com'

export async function list(req, res) {
  const query = req.query.q

  if (!query)
    return res.status(204).json([])

  try {
    const response = await request
      .get(`${API}/sites/MLA/search`)
      .query({q: encodeURIComponent(query)})

    const products = response.body.results
      .slice(0, 4)
      .map(toProductItem)

    res.json(products)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}

function toProductItem(item) {
  return {
    id: item.id,
    title: item.title,
    price: {
      currency: item.currency_id,
      amount: item.price,
      // decimals: Number
    },
    picture: item.thumbnail,
    condition: item.condition,
    free_shipping: item.shipping.free_shipping,
    // author: {
    //   name: String,
    //   lastname: String,
    // },
    categories: item.attributes
      .filter(byId)
      .map(toValue),
  }
}

function byId ({ id }) {
  const attributes = ['BRAND', 'LINE', 'MODEL']

  return attributes.includes(id)
}

function toValue ({ value_name }) {
  return value_name
}

export async function single(req, res) {
  const { id } = req.params

  try {
    let product = await request.get(`${API}/items/${id}`)
    let description = await request.get(`${API}/items/${id}/description`)

    product = product.body
    description = description.body

    res.json({
      // author: {
      //   name: String,
      //   lastname: String,
      // },
      item: {
        id: product.id,
        title: product.title,
        price: {
          currency: product.currency_id,
          amount: product.price,
          // decimals: Number,
        },
      },
      picture: product.thumbnail,
      condition: product.condition,
      free_shipping: product.shipping.free_shipping,
      sold_quantity: product.sold_quantity,
      description: description.plain_text,
      categories: product.attributes
        .filter(byId)
        .map(toValue)
    })
  } catch (error) {
    return res.status(500).json(error)
  }
}
