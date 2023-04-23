import { addFunko, eliminarFunko, listaFunkos, mostrarFunko} from './funciones.js';
import { Funko } from './funko.js';
import { Tipo, Genero } from './types.js';
import express from 'express';


const server = express();


server.get('/funkos', (req, res) => {
  // se recibe sólo el nombre del usuario -> lista de funkos
  // se recibe el nombre del usuario y el id del funko -> funko concreto
  let responded = false; // Bandera para evitar enviar múltiples respuestas
  if (req.query.usuario) {
    if (req.query.id) {
      // se recibe un array con un funko, lo guardamos y lo enviamos en formato json
      console.log("id: " + req.query.id);
      mostrarFunko(req.query.usuario as string, Number(req.query.id) as number, (error, funkos) => {
        if (responded) return; // Ya se envió una respuesta, salir
        if (error) {
          responded = true;
          res.status(404).send("No existe el funko solicitado");
        } else {
          if (funkos !== undefined) {
            if (funkos.length === 0) {
              responded = true;
              res.status(404).send("No existe el funko solicitado");
            } else {
              responded = true;
              res.send(funkos[0]);
            }
          }
          else {
            responded = true;
            res.status(404).send("No existe el funko solicitado");
          }
        }
      });
    } else {
      // se recibe un array con un funko, lo guardamos y lo enviamos en formato json
      listaFunkos(req.query.usuario as string, (error, funkos) => {
        if (responded) return; // Ya se envió una respuesta, salir
        if (error) {
          responded = true;
          res.status(404).send("No hay funkos en la colección");
        } else {
          responded = true;
          res.send(funkos);
        }
      });
    }
  } else {
    responded = true;
    res.status(400).send('No se ha recibido el nombre del usuario');
  }
});


server.delete('/funkos', (req, res) => {
  if (req.query.usuario && req.query.id) {
    eliminarFunko(req.query.usuario as string, Number(req.query.id) as number, (error, resultado) => {
      if (error) {
        console.error(error);
        res.status(500).send("Ha ocurrido un error al eliminar el funko");
      } else if (resultado === true) {
        res.send("Funko eliminado");
      } else {
        res.status(404).send("No se ha encontrado el funko");
      }
    });
  } else {
    res.status(400).send("Faltan parámetros");
  }
});


server.post('/funkos', (req, res) => {
  const funko = new Funko(req.query.nombre as string, req.query.descripcion as string, req.query.tipo as Tipo, req.query.genero as Genero, req.query.franquicia as string, Number(req.query.numero) as number, Boolean(req.query.exclusivo) as boolean, req.query.caracteristicasEspeciales as string, Number(req.query.valorMercado) as number, Number(req.query.id) as number);
  const usuario = req.query.usuario as string;

  addFunko(funko, usuario, (error, resultado) => {
    if (error) {
      res.status(400).send(`Funko no añadido: ${error.message}`);
    } else if (resultado) {
      res.send("Funko añadido");
    } else {
      res.status(400).send("Funko no añadido");
    }
  });
});



//     if (req.query.usuario && req.query.nombre && req.query.descripcion && req.query.tipo && req.query.genero && req.query.franquicia && req.query.numero && req.query.exclusivo && req.query.caracteristicasEspeciales && req.query.valorMercado) {
//       // primero eliminamos el funko
//       const resultado1 = await eliminarFunko(req.query.usuario as string, Number(req.query.id) as number);
//       if (resultado1 === true) {
//         // luego añadimos el funko
//         const funko = new Funko(req.query.nombre as string, req.query.descripcion as string, req.query.tipo as Tipo, req.query.genero as Genero, req.query.franquicia as string, Number(req.query.numero) as number, Boolean(req.query.exclusivo) as boolean, req.query.caracteristicasEspeciales as string, Number(req.query.valorMercado) as number, Number(req.query.id) as number);
//         const resultado2 = await addFunko(funko, req.query.usuario as string);
//         if (resultado2 === true) {
//           res.send("Funko modificado correctamente");
//         } else {
//           res.status(404).send("No se ha podido modificar el funko");
//         }
//       } else {
//         res.status(404).send("No se ha encontrado el funko a modificar");
//       }
//     } else {
//       res.status(400).send("Faltan parámetros en la petición");
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Ha ocurrido un error en el servidor");
//   }
// });
server.patch('/funkos', (req, res) => {
  try {
    if (req.query.usuario && req.query.nombre && req.query.descripcion && req.query.tipo && req.query.genero && req.query.franquicia && req.query.numero && req.query.exclusivo && req.query.caracteristicasEspeciales && req.query.valorMercado && req.query.id) {
      eliminarFunko(req.query.usuario as string, Number(req.query.id) as number, (error1, resultado1) => {
        if (error1) {
          console.error(error1);
          res.status(500).send("Ha ocurrido un error en el servidor");
        } else if (resultado1 === true) {
          const funko = new Funko(
            req.query.nombre as string,
            req.query.descripcion as string,
            req.query.tipo as Tipo,
            req.query.genero as Genero,
            req.query.franquicia as string,
            Number(req.query.numero) as number,
            Boolean(req.query.exclusivo) as boolean,
            req.query.caracteristicasEspeciales as string,
            Number(req.query.valorMercado) as number,
            Number(req.query.id) as number
          );
          addFunko(funko, req.query.usuario as string, (error2, resultado2) => {
            if (error2) {
              console.error(error2);
              res.status(500).send("Ha ocurrido un error en el servidor");
            } else if (resultado2 === true) {
              res.send("Funko modificado correctamente");
            } else {
              res.status(404).send("No se ha podido modificar el funko");
            }
          });
        } else {
          res.status(404).send("No se ha encontrado el funko a modificar");
        }
      });
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

