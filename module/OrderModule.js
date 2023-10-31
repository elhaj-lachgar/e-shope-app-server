const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      required: [true, "user is required"],
      ref: "user",
    },

    card_items: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "product",
          required: [true, "product is required "],
        },
        quantity: {
          type: Number,
          default: 1,
        },
        color: String,
        price: Number,
      },
    ],

    taxPrice: {
      type: Number,
      default: 0,
    },

    totaleOrderPrice: Number,

    schoppingPrice: Number,
    schoppingAddresse: {
      city: String,
      alias: String,
      details: String,
      phone: String,
      code_postal: Number,
    },
    paymentMethode: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: Date,
    isDeliverd: {
      type: Boolean,
      default: false,
    },
    deliverdAt: Date,
  },
  { timestamps: true }
);

OrderSchema.pre(/^find/, function (next) {
    
  this.populate({ path: "user", select: "name profile email" }).populate(
    "card_items.product"
  );

  next();
});
const OrderModule = mongoose.model("order", OrderSchema);

module.exports = OrderModule;
