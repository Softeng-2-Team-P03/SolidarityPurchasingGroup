class user {
    constructor(id, name,surname) {
        this.id = id;
        this.name = name;
        this.surname = surname;
    }

    static from(json) {
      return new product(
          json.id,
           json.name,
           json.surname,
           json.description,
            );
    }
  }
  
  export default user;