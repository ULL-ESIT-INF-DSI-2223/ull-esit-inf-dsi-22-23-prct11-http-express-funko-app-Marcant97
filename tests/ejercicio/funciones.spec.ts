import "mocha";
import { expect } from "chai";
import { Funko } from "../../src/ejercicio/funko.js";
import { Tipo, Genero } from "../../src/ejercicio/types.js";
import { addFunko, eliminarFunko, listaFunkos, mostrarFunko } from "../../src/ejercicio/funciones.js";


describe("Pruebas de funciones", () => {

  const funko = new Funko("Batman", "Funko de Batman", "Pop!" as Tipo, "Deportes" as Genero, "marvel", 1, false, "ninguna", 100, 1);
  
  it("Añade un Funko correctamente", (done) => {
    addFunko(funko, "usuario-tests", (err, resultado) => {
      expect(resultado).to.be.true;
      done();
    });
  });

  it ("lista funkos", (done) => {
    listaFunkos("usuario-tests", (err, resultado) => {
      expect(resultado).to.be.not.null;
      done();
    });
  });

  it ("mostrar funko", (done) => {
    mostrarFunko("usuario-tests", 1, (err, resultado) => {
      expect(resultado).to.be.not.null;
      done();
    });
  });

  it ("no se muestra funko, no existe", (done) => {
    mostrarFunko("usuario-tests", 2, (err, resultado) => {
      expect(resultado).to.be.eql([]);
      done();
    });
  });


  it ("Eliminar funko", (done) => {
    eliminarFunko("usuario-tests", 1, (err, resultado) => {
      expect(resultado).to.be.true;
      done();
    });
  });


});