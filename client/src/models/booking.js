class Booking {
    constructor(id, bookingStartDate,userId,totalPrice, pickupTime,state,deliveryTime,products) { //NOSONAR
        this.id = id;
        this.bookingStartDate = bookingStartDate;
        this.userId = userId;
        this.totalPrice = totalPrice;
        this.pickupTime = pickupTime;
        this.deliveryTime = deliveryTime;
        this.state =state;
        this.products=products
    }

    static from(json) {
      return new Booking(
          json.id,
           json.bookingStartDate,
           json.userId,
           json.totalPrice,
           json.pickupTime,
           json.deliveryTime,
           json.state,
           json.products
            );
    }
  }
  class BookingsAndProduct {
    constructor(id, bookingId,productId,quantity, price) {
        this.id = id;
        this.bookingId = bookingId;
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
 
    }

    static from(json) {
      return new BookingsAndProduct(
          json.id,
           json.bookingId,
           json.productId,
           json.quantity,
           json.price
          
            );
    }
  }
  
  export default {Booking,BookingsAndProduct};