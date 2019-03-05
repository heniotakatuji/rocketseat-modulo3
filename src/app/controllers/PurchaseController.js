const Purchase = require('../models/Purchase')
const User = require('../models/User')
const Queue = require('../services/Queue')
const PurchaseMail = require('../jobs/PurchaseMail')
const Ad = require('../models/Ad')

class PurchaseController {
  async index (req, res) {
    const purchases = await Purchase.paginate(
      { purchaseBy: null },
      {
        page: req.query.page || 1,
        limit: 20,
        populate: ['comprador', 'ad'],
        sort: '-createdAt'
      }
    )

    return res.json(purchases)
  }
  async store (req, res) {
    const { ad, content } = req.body

    const purchaseAd = await Ad.findById(ad).populate('author')
    const user = await User.findById(req.userId)

    if (purchaseAd.purchaseBy) {
      return res.status(500).json({ erro: 'Produto vendido' })
    }

    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save()

    const purchase = await Purchase.create({
      content,
      ad: purchaseAd,
      user
    })

    return res.json(purchase)
  }
}

module.exports = new PurchaseController()
