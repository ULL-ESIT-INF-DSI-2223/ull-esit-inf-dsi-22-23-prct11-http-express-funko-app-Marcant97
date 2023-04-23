import "mocha";
import { expect } from "chai";
import { Funko } from "../../src/ejercicio/funko.js";
import { Tipo, Genero } from "../../src/ejercicio/types.js";

describe("Tests clase Funko", () => {
  it("getters y setters", () => {
    expect(funko1.getNombre).to.equal("nombre");
    expect(funko1.getDescripcion).to.equal("descripcion");
    expect(funko1.getTipo).to.equal(Tipo.PopRides);
    expect(funko1.getGenero).to.equal(Genero.Musica);
    expect(funko1.getFranquicia).to.equal("franquicia");
    expect(funko1.getNumero).to.equal(1);
    expect(funko1.getExclusivo).to.equal(false);
    expect(funko1.getCaracteristicasEspeciales).to.equal("caracteristicas");
    expect(funko1.getValorMercado).to.equal(1);
    expect(funko1.getID).to.equal(1);

    funko1.setNombre = "stitch";
    funko1.setDescripcion = "muñeco de stitch";
    funko1.setTipo = Tipo.VynilSoda;
    funko1.setGenero = Genero.PeliculasYTV;
    funko1.setFranquicia = "Disney";
    funko1.setNumero = 10;
    funko1.setExclusivo = true;
    funko1.setCaracteristicasEspeciales = "se ilumina";
    funko1.setValorMercado = 159;
    funko1.setID = 2;

    expect(funko1.getNombre).to.equal("stitch");
    expect(funko1.getDescripcion).to.equal("muñeco de stitch");
    expect(funko1.getTipo).to.equal(Tipo.VynilSoda);
    expect(funko1.getGenero).to.equal(Genero.PeliculasYTV);
    expect(funko1.getFranquicia).to.equal("Disney");
    expect(funko1.getNumero).to.equal(10);
    expect(funko1.getExclusivo).to.equal(true);
    expect(funko1.getCaracteristicasEspeciales).to.equal("se ilumina");
    expect(funko1.getValorMercado).to.equal(159);
    expect(funko1.getID).to.equal(2);

  });
});


const funko1 = new Funko("nombre", "descripcion", Tipo.PopRides, Genero.Musica, "franquicia", 1, false, "caracteristicas", 1, 1);