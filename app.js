const fs = require("fs");

class Contenedor {
  constructor(fileName) {
    this.fileName = fileName;
    async function createFile() {
      try {
        await fs.promises.writeFile(`${fileName}`, "");
        console.log("archivo Creado ");
      } catch (err) {
        console.log(`hubo un error : ${err}`);
      }
    }
    createFile();
  }
  //guardar el objeto en el archivo y devolver el id asignado
  async save(obj) {
    try {
      let inventary = await fs.promises.readFile(`${this.fileName}`, "utf-8");
      // console.log(inventary);
      if (!inventary) {
        obj.id = 1;
        const arrObjs = [obj];
        await fs.promises.writeFile(
          `${this.fileName}`,
          JSON.stringify(arrObjs)
        );
        return obj.id;
      } else {
        inventary = JSON.parse(inventary);
        obj.id = inventary[inventary.length - 1].id + 1;
        inventary.push(obj);
        await fs.promises.writeFile(
          `${this.fileName}`,
          JSON.stringify(inventary)
        );
        return obj.id;
      }
    } catch (err) {
      console.log(`no se pudeo agregar el objeto por : ${err}`);
    }
  }
  // recibe un id y devuelve el objeto con ese id si no existe devolver null

  async getbyId(id) {
    try {
      const inventary = await fs.promises.readFile(`${this.fileName}`, "utf-8");
      let dataParse = JSON.parse(inventary);
      let objFind = dataParse.find((item) => item.id == id);
      if (objFind) {
        return objFind;
      } else {
        return null;
      }
    } catch (err) {
      console.log(`hubo un error en recuperar el objeto por id : ${err}`);
    }
  }
  // devolver un array de objetos con todos los objetos que esten el archivo
  async getAll() {
    try {
      const inventary = await fs.promises.readFile(`${this.fileName}`, "utf-8");
      let inventaryParse = JSON.parse(inventary);
      return inventaryParse;
    } catch (err) {
      console.log(`hubo un error : ${err}`);
    }
  }

  // borrar el elemento segun el id que le pasemos en el archivo
  async deleteById(id) {
    try {
      const data = await fs.promises.readFile(`${this.fileName}`, "utf-8");
      let dataParse = JSON.parse(data);
      let objsFind = dataParse.filter((item) => item.id != id);
      fs.promises.writeFile(`${this.fileName}`, JSON.stringify(objsFind));
      console.log(`objeto con id : ${id} borrado`);
    } catch (err) {
      console.log(`hubo un error en recuperar el objeto por id : ${err}`);
    }
  }
  // elimina todos
  async deleteAll() {
    try {
      await fs.promises.writeFile(`./${this.fileName}`, " ");
      console.log("contenido Borrado");
    } catch (err) {
      console.log(`hubo un error : ${err}`);
    }
  }
}

const newFile = new Contenedor("./productos.txt");

async function uploadProducts() {
  await newFile.save({
    title: "Placa de video",
    price: 102200,
    thumbnail:
      "https://http2.mlstatic.com/D_NQ_NP_775503-MLA45043082424_032021-W.jpg",
  });
  await newFile.save({
    title: "Procesador",
    price: 30220,
    thumbnail:
      "https://www.bateprecios.com.ar/wp-content/uploads/2022/03/D_661373-MLA43004112186_082020-O-1.jpg",
  });
  await newFile.save({
    title: "RAM",
    price: 10600,
    thumbnail: "https://i.blogs.es/3ce3df/ddr5/1366_521.jpg",
  });
}

uploadProducts();

/* express */
const express = require("express");
const app = express();
const port = 8080;

//home
app.get("/", (req, res) => {
  res.send("casita");
});

// ruta productos
app.get("/products", (req, res) => {
  newFile.getAll().then((i) => res.json(i));
});

// ruta productoRandom
app.get("/productsRandom", (req, res) => {
  const min = Math.ceil(1);
  const max = Math.floor(3);
  const numAleatorio = Math.floor(Math.random() * (max - min + 1) + min);
  console.log(numAleatorio)
  newFile.getbyId(numAleatorio).then((i) => res.json(i));
});

//listen
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto: ${port}`);
});
