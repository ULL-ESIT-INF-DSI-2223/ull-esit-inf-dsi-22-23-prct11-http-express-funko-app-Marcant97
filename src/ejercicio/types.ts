import {Funko} from './funko.js';

/**
 * Enum para los tipos de funkos.
 */
export enum Tipo {
  Pop = "Pop!",
  PopRides = "Pop! Rides",
  VynilSoda = "Vynil Soda",
  VynilGold = "Vynil Gold",
  VynilPlatinum = "Vynil Platinum",
}

/**
 * Enum para los géneros de funkos.
 */
export enum Genero {
  Animacion = "Animacion",
  PeliculasYTV = "Peliculas y TV",
  Videojuegos = "Videojuegos",
  Deportes = "Deportes",
  Musica = "Música",
  Anime = "Anime",
}

/**
 * Type para las peticiones
 */
export type RequestType = {
  comando: 'add' | 'update' | 'remove' | 'read' | 'list';
  funko?: Funko[],
  user? : string,
  id?: number,
  nombre?: string,
}

/**
 * Typer para las respuestas.
 */
export type ResponseType = {
  comando: 'add' | 'update' | 'remove' | 'read' | 'list';
  success: boolean;
  funko?: Funko[];
  cadena?: string;
}
