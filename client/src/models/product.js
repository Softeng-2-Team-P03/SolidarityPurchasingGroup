 class Product {
    constructor(id, farmerId,name,description, quantity,state,typeId,pricePerUnit,images,user) { //NOSONAR
        this.id = id;
        this.farmerId = farmerId;
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.typeId = typeId;
        this.state =state;
        this.pricePerUnit =pricePerUnit;
        this.images =images;
        this.user =user;
    }

    static from(json) {
      return new Product(
          json.id,
           json.farmerId,
           json.name,
           json.description,
           json.quantity,
           json.typeId,
           json.state,
           json.typeId,  
           json.images,
           json.user
            );
    }
  }
  
  export default Product;