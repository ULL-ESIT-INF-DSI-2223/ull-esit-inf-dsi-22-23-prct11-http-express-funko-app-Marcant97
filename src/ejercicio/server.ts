import { addFunko, eliminarFunko, listaFunkos, mostrarFunko} from './funciones.js';
import { Funko } from './funko.js';
import { Tipo, Genero } from './types.js';
import express from 'express';


const server = express();

server.get('/funkos', async (req, res) => {
  // se recibe sólo el nombre del usuario -> lista de funkos
  // se recibe el nombre del usuario y el id del funko -> funko concreto
  if (req.query.usuario) {
    if (req.query.id) {
      // se recibe un array con un funko, lo guardamos y lo enviamos en formato json
      const funkos = await mostrarFunko(req.query.usuario as string, Number(req.query.id) as number);
      if (funkos.length === 0) {
        res.status(404).send("No existe el funko solicitado");
      }
      else {
        res.send(funkos[0]);
      }
      
    }
    else {
      // se recibe un array con un funko, lo guardamos y lo enviamos en formato json
      const funkos = await listaFunkos(req.query.usuario as string);
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

server.delete('/funkos', async (req, res) => {
  if (req.query.usuario && req.query.id) {
    const resultado = await eliminarFunko(req.query.usuario as string, Number(req.query.id) as number);
    if (resultado === true) {
      res.send("Funko eliminado");
    } else {
      res.status(404).send("No se ha encontrado el funko");
    }
  }
});


server.post('/funkos', async (req, res) => {
  const funko = new Funko(req.query.nombre as string, req.query.descripcion as string, req.query.tipo as Tipo, req.query.genero as Genero, req.query.franquicia as string, Number(req.query.numero) as number, Boolean(req.query.exclusivo) as boolean, req.query.caracteristicasEspeciales as string, Number(req.query.valorMercado) as number, Number(req.query.id) as number);
  const resultado = await addFunko(funko, req.query.usuario as string);

  if (resultado) {
    res.send("Funko añadido");
  } else {
    res.status(400).send("Funko no añadido");
  }
});

server.patch('/funkos', async (req, res) => {
  try {
    if (req.query.usuario && req.query.nombre && req.query.descripcion && req.query.tipo && req.query.genero && req.query.franquicia && req.query.numero && req.query.exclusivo && req.query.caracteristicasEspeciales && req.query.valorMercado) {
      // primero eliminamos el funko
      const resultado1 = await eliminarFunko(req.query.usuario as string, Number(req.query.id) as number);
      if (resultado1 === true) {
        // luego añadimos el funko
        const funko = new Funko(req.query.nombre as string, req.query.descripcion as string, req.query.tipo as Tipo, req.query.genero as Genero, req.query.franquicia as string, Number(req.query.numero) as number, Boolean(req.query.exclusivo) as boolean, req.query.caracteristicasEspeciales as string, Number(req.query.valorMercado) as number, Number(req.query.id) as number);
        const resultado2 = await addFunko(funko, req.query.usuario as string);
        if (resultado2 === true) {
          res.send("Funko modificado correctamente");
        } else {
          res.status(404).send("No se ha podido modificar el funko");
        }
      } else {
        res.status(404).send("No se ha encontrado el funko a modificar");
      }
    } else {
      res.status(400).send("Faltan parámetros en la petición");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Ha ocurrido un error en el servidor");
  }
});

server.listen(3000, () => {
  console.log('Server is up on port 3000');
});

