import { Funko } from "./funko.js";
import {existsSync, mkdirSync} from 'fs';
import {readdir, readFile, unlink, writeFile} from 'fs';
import chalk from "chalk";
import { Genero, Tipo} from "./types.js";

/**
 * Función que lee los ficheros de un usuario
 * @param usuario nombre del usuario
 * @param callback callback que se ejecuta al terminar la lectura de los ficheros
 */
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

/**
 * FUnción encargada de añadir un funko a la colección de un usuario
 * @param funko funko a añadir a la colección del usuario
 * @param usuario nombre del usuario
 * @param callback callback que se ejecuta al terminar la operación
 */
export function addFunko(funko: Funko, usuario: string, callback: (error: Error | null, resultado: boolean) => void) {
  const nombre_usuario = usuario;
  const id = funko.getID;
  const path = './database/' + nombre_usuario;

  if (!existsSync(path)) {
    // Si la carpeta del usuario no existe, la creamos
    mkdirSync(path);
  }

  readdir(path, (err, filenames) => {
    if (err) {
      console.error(err);
      callback(err, false);
      return;
    }

    let funkoExists = false;

    for (const filename of filenames) {
      const filepath = path + '/' + filename;

      readFile(filepath, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          callback(err, false);
          return;
        }

        const json = JSON.parse(data);

        if (json.ID === id) {
          funkoExists = true;
          callback(null, false);
          return;
        }
      });
    }

    if (funkoExists) {
      console.log(`Funko with ID ${id} already exists in ${nombre_usuario}'s collection`);
      callback(null, false);
      return;
    }

    const filename = path + '/' + funko.getNombre + '.json';
    const data = JSON.stringify(funko);

    writeFile(filename, data, (err) => {
      if (err) {
        console.error(err);
        callback(err, false);
      } else {
        console.log(`Funko with ID ${id} added to ${nombre_usuario}'s collection`);
        callback(null, true);
      }
    });
  });
}

/**
 * 
 * @param usuario nombre de usuario
 * @param ID_ id del funko a eliminar
 * @param callback callback que se ejecuta al terminar la operación
 */
export function eliminarFunko(usuario: string, ID_: number, callback: (error: Error | null, resultado?: boolean) => void) {
  // 1. comprobar que el usuario existe
  const nombre_usuario = usuario;
  const path = "./database/" + nombre_usuario;
  if (existsSync(path) === false) {
    console.log(chalk.red(`User ${usuario} does not exist`));
    callback(new Error(`User ${usuario} does not exist`));
    return;
  }
  readdir("./database/" + nombre_usuario, (error, filenames) => {
    if (error) {
      console.error(error);
      callback(error);
      return;
    }

    // comprobar que el funko existe
    let bandera = false;
    let nombre_aux = 0;

    filenames.forEach((file, index) => {
      readFile("./database/" + nombre_usuario + "/" + file, 'utf8', (err, contenido) => {
        if (err) {
          console.error(err);
          callback(err);
          return;
        }
        const json = JSON.parse(contenido);

        if (json.ID === ID_) {
          // el funko ya existe
          bandera = true;
          nombre_aux = json.nombre;
        }

        if (index === filenames.length - 1) {
          if (bandera === false) {
            console.log(chalk.red(`Funko not found at ${usuario} collection!`));
            callback(new Error(`Funko not found at ${usuario} collection!`));
          } else {
            // eliminar el fichero correspondiente al funko
            unlink("./database/" + usuario + "/" + nombre_aux + ".json", (error) => {
              if (error) {
                console.error(error);
                callback(error);
                return;
              }
              console.log(chalk.green(`Funko removed from ${usuario} collection!`));
              callback(null, true);
            });
          }
        }
      });
    });
  });
}

/**
 * Función que se encarga de listar los funkos de un usuario
 * @param usuario nombre del usuario
 * @param callback callback que se ejecuta al terminar la operación
 */
export function listaFunkos(usuario: string, callback: (error: Error | null, funkos?: Funko[]) => void): void {
  leerFunkos(usuario, (error, lista_funkos) => {
    if (error) {
      callback(error);
      return;
    }
    if (lista_funkos.length === 0) {
      console.log(chalk.red("No funkos in the collection"));
      callback(null, []);
      return;
    }
    const array_funkos: Funko[] = [];
    lista_funkos.forEach((funko) => {
      array_funkos.push(funko);   
    });
    callback(null, array_funkos);
  });
}

/**
 * Función que se encarga de mostrar un funko de un usuario
 * @param usuario nombre del usuario
 * @param id id del funko a mostrar
 * @param callback callback que se ejecuta al terminar la operación
 */
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




