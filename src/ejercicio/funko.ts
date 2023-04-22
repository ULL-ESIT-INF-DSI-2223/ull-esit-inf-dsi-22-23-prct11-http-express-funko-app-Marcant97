// ID. Debe ser un identificador único del Funko.
// Nombre. Debe ser una cadena de caracteres.
// Descripción. Debe ser una cadena de caracteres.
// Tipo. Debe ser un enumerado con valores como, por ejemplo, Pop!, Pop! Rides, Vynil Soda o Vynil Gold, entre otros.
// Género. Debe ser un enumerado con valores como, por ejemplo, Animación, Películas y TV, Videojuegos, Deportes, Música o Ánime, entre otras.
// Franquicia. Debe ser una cadena de caracteres como, por ejemplo, The Big Bang Theory, Game of Thrones, Sonic The Hedgehog o Marvel: Guardians of the Galaxy, entre otras.
// Número. Debe ser el número identificativo del Funko dentro de la franquicia correspondiente.
// Exclusivo. Debe ser un valor booleano, esto es, verdadero en el caso de que el Funko sea exclusivo o falso en caso contrario.
// Características especiales. Debe ser una cadena de caracteres que indique las característica especiales del Funko como, por ejemplo, si brilla en la oscuridad o si su cabeza balancea.
// Valor de mercado. Debe ser un valor numérico positivo.

import { Tipo, Genero } from './types.js';

/**
 * Clase FUnko
 */
export class Funko {

  private ID: number;
  private nombre: string;
  private descripcion: string;
  private tipo: Tipo;
  private genero: Genero;
  private franquicia: string;
  private numero: number;
  private exclusivo: boolean;
  private caracteristicasEspeciales: string;
  private valorMercado: number;

  /**
   * Constructor de la clase Funko
   * @param nombre_ nombre del funko
   * @param descripcion_ descripcion del funko
   * @param tipo_ tipo del funko
   * @param genero_ genero del funko
   * @param franquicia_ franquicia del funko
   * @param numero_ numero del funko
   * @param exclusivo_ es exlusivo o no
   * @param caracteristicasEspeciales_ caracteristicas especiales del funko
   * @param valorMercado_ valor de mercado del funko
   * @param ID_ identificador del funko
   */
  constructor(nombre_: string, descripcion_: string, tipo_: Tipo, genero_: Genero, franquicia_: string, numero_: number, exclusivo_: boolean, caracteristicasEspeciales_: string, valorMercado_: number, ID_: number) {
    this.nombre = nombre_;
    this.descripcion = descripcion_;
    this.tipo = tipo_;
    this.genero = genero_;
    this.franquicia = franquicia_;
    this.numero = numero_;
    this.exclusivo = exclusivo_;
    this.caracteristicasEspeciales = caracteristicasEspeciales_;
    this.valorMercado = valorMercado_;
    this.ID = ID_;
  }

  /**
   * getter id
   */
  get getID(): number {
    return this.ID;
  }

  /**
   * setter id
   */
  set setID(ID_: number) {
    this.ID = ID_;
  }

  /**
   * getter nombre
   */
  get getNombre(): string {
    return this.nombre;
  }

  /**
   * setter nombre
   */
  set setNombre(nombre_: string) {
    this.nombre = nombre_;
  }

  /**
   * getter descripcion
   */
  get getDescripcion(): string {
    return this.descripcion;
  }

  /**
   * setter descripcion
   */
  set setDescripcion(descripcion_: string) {
    this.descripcion = descripcion_;
  }

  /**
   * getter tipo
   */
  get getTipo(): Tipo {
    return this.tipo;
  }

  /**
   * setter tipo
   */
  set setTipo(tipo_: Tipo) {
    this.tipo = tipo_;
  }

  /**
   * getter genero
   */
  get getGenero(): Genero {
    return this.genero;
  }

  /**
   * setter genero
   */
  set setGenero(genero_: Genero) {
    this.genero = genero_;
  }

  /**
   * getter franquicia
   */
  get getFranquicia(): string {
    return this.franquicia;
  }

  /**
   * setter franquicia
   */
  set setFranquicia(franquicia_: string) {
    this.franquicia = franquicia_;
  }

  /**
   * getter numero
   */
  get getNumero(): number {
    return this.numero;
  }

  /**
   * setter numero
   */
  set setNumero(numero_: number) {
    this.numero = numero_;
  }

  /**
   * getter exclusivo
   */
  get getExclusivo(): boolean {
    return this.exclusivo;
  }

  /**
   * setter exclusivo
   */
  set setExclusivo(exclusivo_: boolean) {
    this.exclusivo = exclusivo_;
  }

  /**
   * getter caracteristicas especiales
   */
  get getCaracteristicasEspeciales(): string {
    return this.caracteristicasEspeciales;
  }

  /**
   * setter caracteristicas especiales
   */
  set setCaracteristicasEspeciales(caracteristicasEspeciales_: string) {
    this.caracteristicasEspeciales = caracteristicasEspeciales_;
  }

  /**
   * getter valor mercado
   */
  get getValorMercado(): number {
    return this.valorMercado;
  }

  /**
   * setter valor mercado
   */
  set setValorMercado(valorMercado_: number) {
    this.valorMercado = valorMercado_;
  }

}
