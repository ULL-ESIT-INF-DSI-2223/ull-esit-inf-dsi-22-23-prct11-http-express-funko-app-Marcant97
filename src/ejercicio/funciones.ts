import { Funko } from "./funko.js";
import {readFileSync, readdirSync, writeFileSync, unlinkSync, existsSync, mkdirSync } from 'fs';
import chalk from "chalk";
import { Genero, Tipo, RequestType, ResponseType } from "./types.js";
import { normalize } from "path";

/**
 * función que lee todos los funkos de un usuario
 * @param usuario usuario del que se quieren leer los funkos
 * @returns array de funkos del usuario
 */
export function leerFunkos(usuario: string): Funko[] {
  const nombre_usuario = usuario; 
  const filenames = readdirSync("./database/" + nombre_usuario);
  const lista_funkos: Funko[] = [];

  filenames.forEach((file) => {
    const contenido = readFileSync("./database/" + nombre_usuario + "/" + file, 'utf8');
    const json = JSON.parse(contenido);
    lista_funkos.push(new Funko(json.nombre, json.descripcion, json.tipo, json.genero, json.franquicia, json.numero, json.exclusivo, json.caracteristicasEspeciales, json.valorMercado, json.ID));
  });
  
  return lista_funkos;
}

/**
 * función que añade un funko a la colección de un usuario
 * @param usuario usuario al que se quiere añadir el funko
 */
export function addFunko(peticion: RequestType): ResponseType{

// 1. comprobar que el usuario existe
  const nombre_usuario = peticion.user;
  const id = peticion.id;
  const path = "./database/" + nombre_usuario;
  if (existsSync(path) === false) {
    // si no existe la carpeta del usuario, la creo
    mkdirSync("./database/" + nombre_usuario);
  }
  const filenames = readdirSync("./database/" + nombre_usuario);
  let bandera = true;
  filenames.forEach((file) => {
    const contenido = readFileSync("./database/" + nombre_usuario + "/" + file, 'utf8');
    const json = JSON.parse(contenido);
    if (json.ID === id) {
      // el funko ya existe
      bandera = false;
      console.log(chalk.red(`Funko already exists at ${json.user} collection!`));
    }
    
  });
  if (bandera === true) {
    if (peticion.funko !== undefined) {
      writeFileSync('./database/' + peticion.user + '/' + peticion.nombre + '.json', JSON.stringify(peticion.funko[0]));
      const respueta: ResponseType = {
        comando: 'add',
        success: true,
        cadena: `Funko added to ${nombre_usuario} collection!`
      }
      return respueta;
    }
  }
  const respuesta: ResponseType = {
    comando: 'add',
    success: false,
    cadena: `Funko already exists at ${nombre_usuario} collection!`
  }
  return respuesta;
}

/**
 * función que elimina un funko de la colección de un usuario
 * @param usuario usuario del que se quiere eliminar el funko
 * @param ID_ id del funko a eliminar
 * @returns true si se ha eliminado correctamente, false si no.
 */
export function eliminarFunko(usuario:string, ID_: number): boolean {
  // 1. comprobar que el usuario existe
  const nombre_usuario = usuario;
  const path = "./database/" + nombre_usuario;
  if (existsSync(path) === false) {
    console.log(chalk.red(`User ${usuario} does not exist`));
    return false;
  }
  const filenames = readdirSync("./database/" + nombre_usuario);

  // comprobar que el funko existe
  let bandera = false;
  let nombre_aux = 0;
  filenames.forEach((file) => {
    const contenido = readFileSync("./database/" + nombre_usuario + "/" + file, 'utf8');
    const json = JSON.parse(contenido);
    if (json.ID === ID_) {
      // el funko ya existe
      bandera = true;
      nombre_aux = json.nombre;
    }
  });

  if (bandera === false) {
    console.log(chalk.red(`Funko not found at ${usuario} collection!`));
    return false;
  }
  else {
    // eliminar el fichero correspondiente al funko
    unlinkSync("./database/" + usuario + "/" + nombre_aux + ".json");
    console.log(chalk.green(`Funko removed from ${usuario} collection!`));
    return true;
  }

}

/**
 * Función que modifica un funko de la colección de un usuario
 * @param id id del funko
 * @param usuario nombre del usuario
 * @param nombre nombre del funko
 * @param descripcion descripción del funko
 * @param tipo tipo del funko
 * @param genero género del funko
 * @param franquicia franquicia del funko
 * @param numero numero del funko
 * @param exclusivo exclusivo o no
 * @param caracteristicasEspeciales características especiales del funko
 * @param valorMercado valor de mercado del funko
 * @returns true si se ha modificado correctamente, false si no.
 */
export function modificarFunko(peticion: RequestType): ResponseType {
  // 1. comprobar que el usuario existe
  const nombre_usuario = peticion.user;
  const id = peticion.id;
  const path = "./database/" + nombre_usuario;
  if (existsSync(path) === false) {
    console.log(chalk.red(`User ${nombre_usuario} does not exist`));
    const respuesta: ResponseType = {
      comando: 'update',
      success: false,
      cadena: `User ${nombre_usuario} does not exist`
    }
    return respuesta;
  }
  const filenames = readdirSync("./database/" + nombre_usuario);

  // comprobar que el funko existe
  let bandera = false;
  let nombre_aux = '';
  filenames.forEach((file) => {
    const contenido = readFileSync("./database/" + nombre_usuario + "/" + file, 'utf8');
    const json = JSON.parse(contenido);
    if (json.ID == id) {
      // el funko ya existe
      bandera = true;
      nombre_aux = json.nombre;
    }
  });

  if (bandera === false) {
    console.log(chalk.red(`Funko not found at ${nombre_usuario} collection!`));
    const respuesta: ResponseType = {
      comando: 'update',
      success: false,
      cadena: `Funko not found at ${nombre_usuario} collection!`
    }
    return respuesta;
  }
  else {
    
    // eliminar el fichero correspondiente al funko
    unlinkSync("./database/" + nombre_usuario + "/" + nombre_aux + ".json"); 
    // crear el nuevo funko
    if (peticion.funko !== undefined) {
      writeFileSync('./database/' + peticion.user + '/' + peticion.nombre + '.json', JSON.stringify(peticion.funko[0]));
      console.log(chalk.green(`Funko modified at ${nombre_usuario} collection!`));
    
      const respuesta: ResponseType = {
        comando: 'update',
        success: true,
        cadena: `Funko modified at ${nombre_usuario} collection!`
      }
      return respuesta;  
    }
    const respuesta: ResponseType = {
      comando: 'update',
      success: false,
      cadena: `Funko not modified at ${nombre_usuario} collection!`
    }
    return respuesta;  
  }

}


/**
 * Función que lista los funkos de un usuario
 * @param usuario nombre del usuario
 * @returns true si se ha listado correctamente, false si no.
 */
export function listaFunkos(usuario: string): Funko[] {
  const nombre_usuario = usuario;
  const path = "./database/" + nombre_usuario;
  if (existsSync(path) === false) {
    console.log(chalk.red(`User ${usuario} does not exist`));
    return [];
  }
  const lista_funkos = leerFunkos(usuario);
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

/**
 * Función que muestra un funko
 * @param usuario nombre del usuario
 * @param id identificador del funko
 * @returns true si se ha mostrado correctamente, false si no.
 */
export function mostrarFunko(usuario: string, id: number): Funko | string {
  let mi_funko: Funko = new Funko("", "", "Pop!" as Tipo, "Deportes" as Genero, "", 0, false, "", 0, 0);
  // 1. comprobar que el usuario existe
  const nombre_usuario = usuario;
  const path = "./database/" + nombre_usuario;
  let bandera = false;
  if (existsSync(path) === false) {
    console.log(chalk.red(`User ${usuario} does not exist`));
    return `User ${usuario} does not exist`;
  }
  else {
    // 2. comprobar que el fichero existe
    const filenames = readdirSync("./database/" + nombre_usuario);
    filenames.forEach((file) => {
      const contenido = readFileSync("./database/" + nombre_usuario + "/" + file, 'utf8');
      const json = JSON.parse(contenido);

      if ((json.ID == id) && (bandera === false)) {
        mi_funko = new Funko(json.nombre, json.descripcion, json.tipo, json.genero, json.franquicia, json.numero, json.exclusivo, json.caracteristicasEspeciales, json.valorMercado, json.ID);
        bandera = true;
      }
    });
  }
  if (bandera) {
    return mi_funko;
  }
  console.log(chalk.red(`Funko with ID ${id} does not exist`))
  return `Funko with ID ${id} does not exist`;
  // return mi_funko;
}