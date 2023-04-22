import net from 'net';
import { addFunko, eliminarFunko, listaFunkos, mostrarFunko, modificarFunko } from './funciones.js';
import { Funko } from './funko.js';
import { ResponseType } from './types.js';4

import express from 'express';
import { appendFile } from 'fs';

// Toda función que defina y que ejecute código asíncrono deberá implementarse haciendo uso del patrón callback. 
// Lo anterior permitirá, entre otras cosas, establecer las pruebas de un modo más sencillo.

const server = express();

// get: Para obtener información sobre un Funko Pop concreto de un usuario o para listar todos sus Funko Pops.
server.get('/funkos', (req, res) => {
  // se recibe sólo el nombre del usuario -> lista de funkos
  // se recibe el nombre del usuario y el id del funko -> funko concreto
  if (req.query.nombre) {
    if (req.query.id) {
      // funko concreto
      res.send("Funko concreto")
    }
    else {
      // lista de funkos
      res.send("Lista de funkos")
    }
  }
  else {
    res.status(400).send('No se ha recibido el nombre del usuario');
  }
});


// delete: Para eliminar un Funko Pop de la lista de un usuario.
server.delete('/funkos', (req, res) => {
  // se recibe nombre del usuario e id del funko
  if (req.query.nombre && req.query.id) {
    const resultado = eliminarFunko(req.query.nombre as string, Number(req.query.id) as number);
    if (resultado === true) {
      res.send("Funko eliminado");
    }
    else {
      res.status(404).send("No se ha encontrado el funko");
    }
  }
});

// post: Para añadir un Funko Pop a la lista de un usuario.
server.post('/funkos', (req, res) => {
  // se reciben todos los atributos de un funko
});

// patch: Para modificar la información de un Funko Pop existente en la lista de un usuario.
server.patch('/funkos', (req, res) => {
// se reciben todos los atributos de un funko

});


server.listen(3000, () => {
  console.log('Server is up on port 3000');
});

