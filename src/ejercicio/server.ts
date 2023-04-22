import net from 'net';
import { addFunko, eliminarFunko, listaFunkos, mostrarFunko} from './funciones.js';
import { Funko } from './funko.js';
import { Tipo, Genero } from './types.js';

import express from 'express';
import { appendFile } from 'fs';

// Toda función que defina y que ejecute código asíncrono deberá implementarse haciendo uso del patrón callback. 
// Lo anterior permitirá, entre otras cosas, establecer las pruebas de un modo más sencillo.

const server = express();

// get: Para obtener información sobre un Funko Pop concreto de un usuario o para listar todos sus Funko Pops.
server.get('/funkos', (req, res) => {
  // se recibe sólo el nombre del usuario -> lista de funkos
  // se recibe el nombre del usuario y el id del funko -> funko concreto
  if (req.query.usuario) {
    if (req.query.id) {
      // se recibe un array con un funko, lo guardamos y lo enviamos en formato json
      const funkos = mostrarFunko(req.query.usuario as string, Number(req.query.id) as number);
      if (funkos.length === 0) {
        res.status(404).send("No existe el funko solicitado");
      }
      else {
        res.send(funkos[0]);
      }
      
    }
    else {
      // se recibe un array con un funko, lo guardamos y lo enviamos en formato json
      const funkos = listaFunkos(req.query.usuario as string);
      if (funkos.length === 0) {
        res.status(404).send("No hay funkos en la colección");
      }
      else {
        res.send(funkos);
      }

    }
  }
  else {
    res.status(400).send('No se ha recibido el nombre del usuario');
  }
});



server.delete('/funkos', (req, res) => {
  if (req.query.usuario && req.query.id) {
    const resultado = eliminarFunko(req.query.usuario as string, Number(req.query.id) as number);
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
  if (req.query.usuario && req.query.nombre && req.query.descripcion && req.query.tipo && req.query.genero && req.query.franquicia && req.query.numero && req.query.exclusivo && req.query.caracteristicasEspeciales && req.query.valorMercado) {
    const funko = new Funko(req.query.nombre as string, req.query.descripcion as string, req.query.tipo as Tipo, req.query.genero as Genero, req.query.franquicia as string, Number(req.query.numero) as number, Boolean(req.query.exclusivo) as boolean, req.query.caracteristicasEspeciales as string, Number(req.query.valorMercado) as number, Number(req.query.id) as number);
    const resultado = addFunko(funko, req.query.usuario as string);
    if (resultado === true) {
      res.send("Funko añadido a la colección correctamente");
    }
    else {
      res.status(404).send("No se ha podido añadir el funko");
    }
  }
  else {
    res.status(400).send("No se han recibido todos los datos");
  }
});

// patch: Para modificar la información de un Funko Pop existente en la lista de un usuario.
server.patch('/funkos', (req, res) => {
  if (req.query.usuario && req.query.nombre && req.query.descripcion && req.query.tipo && req.query.genero && req.query.franquicia && req.query.numero && req.query.exclusivo && req.query.caracteristicasEspeciales && req.query.valorMercado) {
    // eliminar funko
    const resultado1 = eliminarFunko(req.query.usuario as string, Number(req.query.id) as number);
    if (resultado1 === true) {
      // añadir funko
      const funko = new Funko(req.query.nombre as string, req.query.descripcion as string, req.query.tipo as Tipo, req.query.genero as Genero, req.query.franquicia as string, Number(req.query.numero) as number, Boolean(req.query.exclusivo) as boolean, req.query.caracteristicasEspeciales as string, Number(req.query.valorMercado) as number, Number(req.query.id) as number);
      const resultado2 = addFunko(funko, req.query.usuario as string);
      if (resultado2 === true) {
        res.send("Funko modificado correctamente");
      }
      else {
        res.status(404).send("No se ha podido modificar el funko");
      }
    }
    else {
      res.status(404).send("No se ha encontrado el funko a modificar");
    }
  }


});


server.listen(3000, () => {
  console.log('Server is up on port 3000');
});

