import { Funko } from "./funko.js";
import {existsSync, mkdirSync} from 'fs';
import {readdir, readFile, unlink, writeFile} from 'fs';
import chalk from "chalk";
import { Genero, Tipo} from "./types.js";

import { promisify } from 'util';


// import fs from "fs/promises";
// import path from "path";

const readDirAsync = promisify(readdir);
const readFileAsync = promisify(readFile);
const unlinkAsync = promisify(unlink);
const writeFileAsync = promisify(writeFile);


export async function leerFunkos(usuario: string): Promise<Funko[]> {
  const nombre_usuario = usuario;
  const lista_funkos: Funko[] = [];
  const files = await readDirAsync(`./database/${nombre_usuario}`);
  
  for (const file of files) {
    const contenido = await readFileAsync(`./database/${nombre_usuario}/${file}`, 'utf8');
    const json = JSON.parse(contenido);
    lista_funkos.push(new Funko(json.nombre, json.descripcion, json.tipo, json.genero, json.franquicia, json.numero, json.exclusivo, json.caracteristicasEspeciales, json.valorMercado, json.ID));
  }
  
  return lista_funkos;
}


export async function addFunko(funko: Funko, usuario: string): Promise<boolean> {
  try {
    // 1. comprobar que el usuario existe
    const nombre_usuario = usuario;
    const id = funko.getID;
    const path = "./database/" + nombre_usuario;
    if (existsSync(path) === false) {
      // si no existe la carpeta del usuario, la creo
      mkdirSync("./database/" + nombre_usuario);
    }
    const filenames = await readDirAsync("./database/" + nombre_usuario);

    let bandera = true;

    for (const file of filenames) {
      const contenido = await readFileAsync("./database/" + nombre_usuario + "/" + file, 'utf8');
      const json = JSON.parse(contenido);

      if (json.ID === id) {
        // el funko ya existe
        bandera = false;
        console.log(chalk.red(`Funko already exists at ${json.user} collection!`));
        break;
      }
    }

    if (bandera === true) {
      if (funko !== undefined) {
        await writeFileAsync('./database/' + nombre_usuario + '/' + funko.getNombre + '.json', JSON.stringify(funko));
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}


export async function eliminarFunko(usuario: string, ID_: number): Promise<boolean> {
  try {
    // 1. comprobar que el usuario existe
    const nombre_usuario = usuario;
    const path = "./database/" + nombre_usuario;
    if (existsSync(path) === false) {
      console.log(chalk.red(`User ${usuario} does not exist`));
      return false;
    }
    const filenames = await readDirAsync("./database/" + nombre_usuario);

    // comprobar que el funko existe
    let bandera = false;
    let nombre_aux = 0;

    for (const file of filenames) {
      const contenido = await readFileAsync("./database/" + nombre_usuario + "/" + file, 'utf8');
      const json = JSON.parse(contenido);

      if (json.ID === ID_) {
        // el funko ya existe
        bandera = true;
        nombre_aux = json.nombre;
        break;
      }
    }

    if (bandera === false) {
      console.log(chalk.red(`Funko not found at ${usuario} collection!`));
      return false;
    } else {
      // eliminar el fichero correspondiente al funko
      await unlinkAsync("./database/" + usuario + "/" + nombre_aux + ".json");
      console.log(chalk.green(`Funko removed from ${usuario} collection!`));
      return true;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}


export async function listaFunkos(usuario: string): Promise<Funko[]> {
  const nombre_usuario = usuario;
  const path = "./database/" + nombre_usuario;
  if (existsSync(path) === false) {
    console.log(chalk.red(`User ${usuario} does not exist`));
    return [];
  }
  const lista_funkos = await leerFunkos(usuario);
  if (lista_funkos.length === 0) {
    console.log(chalk.red("No funkos in the collection"));
    return [];
  }
  const array_funkos: Funko[] = [];

  lista_funkos.forEach((funko) => {
    array_funkos.push(funko);   
  });
  return array_funkos;
}


export async function mostrarFunko(usuario: string, id: number): Promise<Funko[]> {
  let mi_funko: Funko = new Funko("", "", "Pop!" as Tipo, "Deportes" as Genero, "", 0, false, "", 0, 0);
  // 1. comprobar que el usuario existe
  const nombre_usuario = usuario;
  const path = "./database/" + nombre_usuario;
  let bandera = false;
  if (existsSync(path) === false) {
    console.log(chalk.red(`User ${usuario} does not exist`));
    return [];
  } else {
    // 2. comprobar que el fichero existe
    const filenames = await readDirAsync("./database/" + nombre_usuario);
    for (const file of filenames) {
      const contenido = await readFileAsync("./database/" + nombre_usuario + "/" + file, 'utf8');
      const json = JSON.parse(contenido);

      if ((json.ID == id) && (bandera === false)) {
        mi_funko = new Funko(json.nombre, json.descripcion, json.tipo, json.genero, json.franquicia, json.numero, json.exclusivo, json.caracteristicasEspeciales, json.valorMercado, json.ID);
        bandera = true;
      }
    }
  }
  if (bandera) {
    return [mi_funko];
  }
  console.log(chalk.red(`Funko with ID ${id} does not exist`))
  return [];
}
