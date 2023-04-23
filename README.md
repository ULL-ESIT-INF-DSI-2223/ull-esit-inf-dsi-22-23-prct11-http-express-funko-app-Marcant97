# Práctica 11 - Creación de una aplicación Express para gestionar el registro de Funko Pops 

[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-Marcant97/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-Marcant97?branch=main)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2223_ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-Marcant97&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2223_ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-Marcant97)

[![Tests](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-Marcant97/actions/workflows/node.js.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-Marcant97/actions/workflows/node.js.yml)


## Índice
[Ejercicio práctica]()  
[Ejercicio PE-103]() 


## Ejercicio práctica

### Descripción
El desarollo del ejercicio de esta práctica se basa en las 2 prácticas anteriores (prácticas 9 y 10). En este caso, los pasos que he seguido han sido los siguientes:
1. Traer todo el código de la práctica 10 a este repositorio.
2. Eliminar el código del cliente, ya que para esta práctica no es neesario, se utilizará la extesnión *thunderclient* de VSCode para hacer las peticiones. También se eliminó la clase MessageEventEmitterClient y su correspondiente fichero, ya que a partir de ahora no utilizaremos sockets.
3. El siguietne paso fue cambiar el funcionamiento del servidor, quitar los sockets e inciar el servidor con express. Lo siguiente fue empezar a gestionar cada una de las operaciones tal y como dice el enunciado de la práctica (get, post, patch, delete).

```ts
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
```

Por ejemplo, en el caso de la operación *post*, se le pasa la ruta */funkos* y se le pasa un callback que recibe como parámetros la petición y la respuesta. En este caso, se crea un objeto de tipo Funko con los datos que se le pasan por la petición, y se llama a la función *addFunko* que se encarga de añadir el Funko a la base de datos. Si se produce algún error, se devuelve un código 400 y un mensaje de error, si se añade correctamente, se devuelve un código 200 y un mensaje de éxito. (AddFuno será explicado más adelante en este informe). El proceso es muy similiar para todas las operaciones.


4. Una vez tenemos la parte del servidor, me tocó la parte más complicada, mnodificar las funciones que usa el servidor. Me resultó complicado por que tuve que dejar de utilizar las funciones síncronas y usar asíncronas, algo que tendría que haber realizado en la anterior práctica pero no me funcionó. En primer lugar, empezé a cambiar todo para que funcionase bien ed forma síncrona. Luego empezé función por función a cambiar sus elementos a asíncorna, consultando apuntes y algunos recursos de internet.
Para ello, como novedad a cada función se le pasa un callback. Vamos a comentar 2 funciones.  

```ts
  export function leerFunkos(usuario: string, callback: (error: Error | null, funkos: Funko[]) => void): void {
    const nombre_usuario = usuario;
    const lista_funkos: Funko[] = [];
    readdir(`./database/${nombre_usuario}`, (error, files) => {
      if (error) {
        callback(error, []);
        return;
      }
      const readFiles = files.map(file => {
        return new Promise<string>((resolve, reject) => {
          readFile(`./database/${nombre_usuario}/${file}`, 'utf-8', (error, content) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(content);
          });
        });
      });
      Promise.all(readFiles)
        .then(contents => {
          contents.forEach(contenido => {
            const json = JSON.parse(contenido);
            lista_funkos.push(new Funko(json.nombre, json.descripcion, json.tipo, json.genero, json.franquicia, json.numero, json.exclusivo, json.caracteristicasEspeciales, json.valorMercado, json.ID));
          });
          callback(null, lista_funkos);
        })
        .catch(error => callback(error, []));
    });
  }
```
Las promesas son un mecanismo que permite, al igual que los manejadores o callbacks, gestionar la ejecución de código asíncrono. En este caso, se pasan como parámetros el nombre del usuario y un callback. Pasamos a leer de forma asícnrona el contenido del directorio con *readdir* y una vez leído, se crea un array de promesas, que se ejecutan con *Promise.all*. Si se produce algún error, se llama al callback con el error y un array vacío, si no, se llama al callback con un null y el array de funkos.  

```ts
  export function mostrarFunko(usuario: string, id: number, callback: (error: Error | null, funkos?: Funko[]) => void): void {
    let mi_funko: Funko = new Funko("", "", "Pop!" as Tipo, "Deportes" as Genero, "", 0, false, "", 0, 0);
    // 1. comprobar que el usuario existe
    const nombre_usuario = usuario;
    const path = "./database/" + nombre_usuario;
    let bandera = false;
    if (existsSync(path) === false) {
      console.log(chalk.red(`User ${usuario} does not exist`));
      callback(null, []);
      return;
    } else {
      // 2. comprobar que el fichero existe
      let numFiles = 0;
      readdir("./database/" + nombre_usuario, (error, filenames) => {
        if (error) {
          callback(error);
          return;
        }

        filenames.forEach((file) => {
          readFile("./database/" + nombre_usuario + "/" + file, 'utf8', (error, contenido) => {
            if (error) {
              callback(error);
              return;
            }
            const json = JSON.parse(contenido);
            if ((json.ID == id) && (bandera === false)) {
              mi_funko = new Funko(json.nombre, json.descripcion, json.tipo, json.genero, json.franquicia, json.numero, json.exclusivo, json.caracteristicasEspeciales, json.valorMercado, json.ID);
              bandera = true;
            }
            numFiles++;
            if (numFiles == filenames.length) {
              if (!bandera) {
                console.log(chalk.red(`Funko with ID ${id} does not exist`));
                callback(null, []);
                return;
              }
              callback(null, [mi_funko]);
            }
          });
        });
      });
    }
  }
```

Otro ejemplo de función sería la encargada de mostrar la información de un funko. Como argumentos recibe el nombre del usuario, el id del funko y un callback. Primero se comprueba que el usuario existe, si no, se llama al callback con un null y un array vacío. Si existe, se comprueba que el funko existe, si no, se llama al callback con un null y un array vacío. Si existe, se lee el json y se parsea, y se comprueba si el funko de ese json tiene el id solicitado por el id. Si no lo tiene se pasa al siguiente fichero, y si lo tiene entonces nos creamos un funko, y ponemos una bandera a true. Además, para controlar la ejecución del código asíncrono existe una variable numfiles que se va incrementando, por lo tanto no se podrá al fragmento final de la función en la que procesamos el estado de la bandera hasta que no se hayan leído todos los ficheros. Si la bandera está a true, se llama al callback con un null y un array con el funko, si no, se llama al callback con un null y un array vacío.

## Ejercicio PE-103

### Descripción
Implemente un servidor Express en el que se exponga un punto de acceso JSON en la ruta '/execmd'. Al mismo tiempo, haga que el servidor devuelva, por defecto, un código de respuesta 404 cuando se intente acceder a una ruta no válida (vea el uso del método status de un objeto respuesta de Express).

Se espera que la URL que permite acceder a dicho punto de acceso contenga dos parámetros. El primer parámetro, denominado 'cmd', consistirá en un comando Unix/Linux, mientras que el segundo, denominado args, consistirá en las opciones con las que se desea ejecutar el comando. Tenga en cuenta que ambos parámetros son cadenas de caracteres. El primer parámetro correspondiente al comando a ejecutar es obligatorio, mientras que el de los argumentos es opcional. En caso de que la URL no contenga el parámetro 'cmd', se deberá devolver al cliente un código de respuesta 400.

En el resto de casos, el servidor deberá contestar con un objeto JSON:
En caso de que se produzca un error durante la ejecución del comando y sus posibles argumentos, un objeto JSON con una propiedad error que contenga información acerca del error que ha ocurrido. Tenga en cuenta que, en los casos en los que el comando especificado no llegara a ejecutarse, por ejemplo, porque no existe, o se ejecutara produciendo una salida no satisfactoria, por ejemplo, porque se le pasan argumentos no válidos a un comando que si existe, el error correspondiente deberá devolverse en este tipo de objeto JSON. El código de respuesta asociado a este tipo de error sería un 500.
En el caso de que el comando, con sus correspondientes argumentos, se ejecute correctamente, un objeto JSON con una propiedad output que contenga la salida emitida por el comando. El código asociado a esta respuesta, que es el valor por defecto, es el 200 (OK).

### Solución
Para la resolución del ejercicio, he creado un servidor con express en el fichero *app.ts*, será el encargado de gestionar las peticiones que se le hagan a la ruta */execmd*.

```ts
  import express from 'express';
  import {spawnSync} from 'child_process';

  const app = express();

  app.get('/execmd', (req, res) => {
    console.log(req.query);
    if (!req.query.cmd) {
      return res.status(400).send();
    } 
    else {
      if (req.query.args) { // si hay args
        const command = spawnSync(req.query.cmd.toString(), req.query.args.toString().split(' '));
        if (command.stderr.toString()) {
          return res.status(500).send({
            cmd : req.query.cmd.toString(),
            args : req.query.args.toString(),
            error: command.stderr.toString()
          });
        }
        else {
          return res.send({
            cmd : req.query.cmd.toString(),
            args : req.query.args.toString(),
            salida: command.stdout.toString()
          });
        }
      }
      else { // si no hay args
        const command = spawnSync(req.query.cmd.toString());
        return res.send({
          cmd : req.query.cmd.toString(),
          salida: command.stdout.toString()
        })
      }
    }
  });

  app.get('*', (req, res) => {
    res.status(404).send();
  });

  app.listen(3000, () => {
    console.log('Server is up on port 3000');
  });
```

Como podemos observar estará escuchando peticiones en el puerto 3000, para cualquier otra ruta que no sea */execmd* devolverá un código 404. En el caso de que la ruta sea */execmd* se comprobará si se ha pasado el parámetro *cmd*, en caso de que no se haya pasado se devolverá un código 400. 
A continuación distinguimos 2 casos:
1. Si se ha pasado el parámetro *args* se ejecutará el comando con los argumentos pasados, en caso de que se produzca algún error se devolverá un código 500 y un objeto JSON con la información del error, en caso contrario se devolverá un código 200 y un objeto JSON con la salida del comando.
2. Si no se ha pasado el parámetro *args* se ejecutará el comando sin argumentos, en caso de que se produzca algún error se devolverá un código 500 y un objeto JSON con la información del error, en caso contrario se devolverá un código 200 y un objeto JSON con la salida del comando.

Para la ejecución de comandos utilicé *spawnSync* de *child_process*, que es una función que permite ejecutar comandos de forma síncrona, es decir, que se ejecuta el comando y se espera a que termine para continuar con el resto del código.
El motivo para utilizar la versión síncrona fue la falta de tiempo en la sesión, y preferí que funcionase antes que tewnerlo de forma asíncrona y que no funcionase.